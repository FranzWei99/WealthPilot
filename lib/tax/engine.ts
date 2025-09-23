// lib/tax/engine.ts
// Tax calculation functions with explicit typing in callbacks to satisfy TS checks.

import { prisma } from "@/lib/prisma";
// Keep your existing getParam implementation and import path as-is:
import { getParam } from "@/lib/tax/params";
import { clamp, currency, piecewise, splitIncome } from "./helpers";

// ---- Box 1 ---------------------------------------------------------------
// Calculates Box 1 tax based on progressive brackets and incomes.
export async function calc_box1_tax(userId: string, year: number): Promise<number> {
  // Expecting brackets like: [{ upto: number, rate: number }, { rate: number }]
  const brackets = await getParam<Array<{ upto?: number; rate: number }>>("Box1_brackets", year);
  const incomes = await prisma.income.findMany({ where: { userId } });

  // yearly gross across all income rows
  const grossY = incomes.reduce((a: number, i: { amount: number }) => a + i.amount * 12, 0);
  // Apply piecewise to grossY (if you have deductions, subtract before calling piecewise)
  const tax = piecewise(grossY, brackets);
  await prisma.taxYearCalc.upsert({
    where: { userId_year: { userId, year } },
    update: { box1_tax: currency(tax) },
    create: { userId, year, box1_tax: currency(tax) },
  });
  return currency(tax);
}

// ---- Zvw (Health insurance contribution) --------------------------------
export async function calc_zvw(userId: string, year: number): Promise<number> {
  const incomes = await prisma.income.findMany({ where: { userId } });
  const { employeeY, zzpY } = splitIncome(incomes as any);

  const paramEmp = await getParam<any>("Zvw_werknemer", year);
  const paramZZP = await getParam<any>("Zvw_zelfstandig", year);

  const baseEmp = Math.min(paramEmp.max_income, employeeY);
  const baseZZP = Math.min(paramZZP.max_income, zzpY);
  const amount = baseEmp * paramEmp.rate + baseZZP * paramZZP.rate;

  await prisma.taxYearCalc.upsert({
    where: { userId_year: { userId, year } },
    update: { zvw: amount },
    create: { userId, year, zvw: amount },
  });
  return amount;
}

// ---- Heffingskortingen (general + labour) --------------------------------
export async function calc_heffingskortingen(userId: string, year: number): Promise<{ algemene: number; arbeids: number }> {
  const alg = await getParam<any>("Heffingskorting_algemeen", year);
  const arb = await getParam<any>("Heffingskorting_arbeid", year);

  const incomes = await prisma.income.findMany({ where: { userId } });
  const { employeeY, zzpY } = splitIncome(incomes as any);
  const income = employeeY + zzpY;

  const algemene = clamp(alg.max - Math.max(0, income - alg.afbouw_start) * alg.afbouw_rate, 0, alg.max);
  const arbeids = clamp(Math.min(arb.max, income * arb.opbouw) - Math.max(0, income - arb.afbouw_start) * arb.afbouw_rate, 0, arb.max);

  const kortingen = { algemene: currency(algemene), arbeids: currency(arbeids) };
  await prisma.taxYearCalc.upsert({
    where: { userId_year: { userId, year } },
    update: { heffingskortingen: kortingen as any },
    create: { userId, year, heffingskortingen: kortingen as any },
  });
  return kortingen;
}

// ---- Box 2 ---------------------------------------------------------------
export async function calc_box2_tax(userId: string, year: number): Promise<number> {
  const brackets = await getParam<Array<{ upto?: number; rate: number }>>("Box2_tarief", year);
  const incomes = await prisma.income.findMany({ where: { userId } });

  const dividendY = incomes
    .filter((i: { type?: string | null }) => ((i.type ?? "").toLowerCase()).includes("dividend"))
    .reduce((a: number, i: { amount: number }) => a + i.amount * 12, 0);

  const gross = piecewise(dividendY, brackets);
  const withhold = await getParam<number>("Dividendbelasting", year).catch(() => 0.15);
  const net = Math.max(0, gross - dividendY * withhold);

  await prisma.taxYearCalc.upsert({
    where: { userId_year: { userId, year } },
    update: { box2_tax: currency(net) },
    create: { userId, year, box2_tax: currency(net) },
  });
  return currency(net);
}

// ---- Box 3 ---------------------------------------------------------------
export async function calc_box3_tax(userId: string, year: number): Promise<number> {
  const vrij = await getParam<number>("Box3_vrijstelling_per_persoon", year);
  const forfait = await getParam<any>("Box3_forfait", year); // { spaargeld: number, overig: number }
  const tarief = await getParam<number>("Box3_tarief", year);

  const assets = await prisma.asset.findMany({ where: { userId } });

  const spaargeld = assets
    .filter((a: { type: string }) => a.type.includes("Cash"))
    .reduce((a: number, b: { value: number }) => a + b.value, 0);

  const overig = assets
    .filter((a: { type: string }) => !a.type.includes("Cash"))
    .reduce((a: number, b: { value: number }) => a + b.value, 0);

  const persons = await prisma.person.findMany({ where: { userId } });
  const allowance = vrij * Math.max(1, Math.min(2, persons.length));

  const fict = Math.max(0, spaargeld - allowance) * (forfait.spaargeld ?? forfait["spaargeld"])
             + Math.max(0, overig - Math.max(0, allowance - spaargeld)) * (forfait.overig ?? forfait["overig"]);

  const tax = currency(fict * tarief);

  await prisma.taxYearCalc.upsert({
    where: { userId_year: { userId, year } },
    update: { box3_tax: tax },
    create: { userId, year, box3_tax: tax },
  });
  return tax;
}

// ---- Combined year summary -----------------------------------------------
export async function combine_tax_year(userId: string, year: number): Promise<any> {
  const [box1, zvw, kort, box2, box3] = await Promise.all([
    calc_box1_tax(userId, year),
    calc_zvw(userId, year),
    calc_heffingskortingen(userId, year),
    calc_box2_tax(userId, year),
    calc_box3_tax(userId, year),
  ]);

  const incomes = await prisma.income.findMany({ where: { userId } });
  const expenses = await prisma.expense.findMany({ where: { userId } });

  const grossY = incomes.reduce((a: number, i: { amount: number }) => a + i.amount * 12, 0);
  const expY = expenses.reduce((a: number, e: { amount: number }) => a + e.amount * 12, 0);

  const kortingSum = Object.values(kort).reduce((a: number, b: unknown) => a + Number((b as number) ?? 0), 0);
  const totalTax = Math.max(0, box1 + zvw + box2 + box3 - kortingSum);
  const nbi = currency(grossY - expY - totalTax);

  const existing = await prisma.taxYearCalc.findUnique({ where: { userId_year: { userId, year } } });
  const breakdown = {
    ...(existing?.breakdown ?? {}),
    grossY,
    expY,
    totalTax,
    nbi,
    kortingen: kort,
  };

  await prisma.taxYearCalc.upsert({
    where: { userId_year: { userId, year } },
    update: { netto_bestede_inkomen: nbi, breakdown },
    create: { userId, year, netto_bestede_inkomen: nbi, breakdown },
  });

  return { year, grossY, expY, totalTax, nbi } as any;
}
