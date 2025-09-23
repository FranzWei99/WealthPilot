// Keep your existing helper imports here (getParam, splitIncome, piecewise, clamp, currency, etc.)
// Example (adjust to your project):
// import { getParam, splitIncome, piecewise, clamp, currency } from "./helpers";
import { prisma } from "@/lib/prisma";

// --------------------------------------------------------------------------------------
// Strong, inference-based row types derived from your actual Prisma queries
// --------------------------------------------------------------------------------------
type IncomeRow  = Awaited<ReturnType<typeof prisma.income.findMany>>[number];
type ExpenseRow = Awaited<ReturnType<typeof prisma.expense.findMany>>[number];
type AssetRow   = Awaited<ReturnType<typeof prisma.asset.findMany>>[number];
type PersonRow  = Awaited<ReturnType<typeof prisma.person.findMany>>[number];

// --------------------------------------------------------------------------------------
// ZVW (health insurance) calculation
// --------------------------------------------------------------------------------------
export async function calc_zvw(userId: string, year: number) {
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

// --------------------------------------------------------------------------------------
// Heffingskortingen (general & labour credits)
// --------------------------------------------------------------------------------------
export async function calc_heffingskortingen(userId: string, year: number) {
  const alg = await getParam<any>("Heffingskorting_algemeen", year);
  const arb = await getParam<any>("Heffingskorting_arbeid", year);

  const incomes = await prisma.income.findMany({ where: { userId } });
  const { employeeY, zzpY } = splitIncome(incomes as any);
  const income = employeeY + zzpY;

  const algemene = clamp(
    alg.max - Math.max(0, income - alg.afbouw_start) * alg.afbouw_rate,
    0,
    alg.max
  );

  const arbeids = clamp(
    Math.min(arb.max, income * arb.opbouw) -
      Math.max(0, income - arb.afbouw_start) * arb.afbouw_rate,
    0,
    arb.max
  );

  const kortingen = { algemene: currency(algemene), arbeids: currency(arbeids) };

  await prisma.taxYearCalc.upsert({
    where: { userId_year: { userId, year } },
    update: { heffingskortingen: kortingen as any },
    create: { userId, year, heffingskortingen: kortingen as any },
  });

  return kortingen;
}

// --------------------------------------------------------------------------------------
// Box 2 tax (substantial interest / dividends)
// --------------------------------------------------------------------------------------
export async function calc_box2_tax(userId: string, year: number) {
  const brackets = await getParam<any>("Box2_tarief", year);

  const incomes = await prisma.income.findMany({ where: { userId } });

  const dividendY = incomes
    .filter((i: IncomeRow) => ((i.type || "") as string).toLowerCase().includes("dividend"))
    .reduce((a: number, i: IncomeRow) => a + Number(i.amount) * 12, 0);

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

// --------------------------------------------------------------------------------------
// Box 3 tax (savings & investments)
// --------------------------------------------------------------------------------------
export async function calc_box3_tax(userId: string, year: number) {
  const vrij = await getParam<number>("Box3_vrijstelling_per_persoon", year);
  const forfait = await getParam<any>("Box3_forfait", year);
  const tarief = await getParam<number>("Box3_tarief", year);

  const assets = await prisma.asset.findMany({ where: { userId } });
  const persons = await prisma.person.findMany({ where: { userId } });

  const spaargeld = assets
    .filter((a: AssetRow) => a.type.includes("Cash"))
    .reduce((a: number, b: AssetRow) => a + Number(b.value), 0);

  const overig = assets
    .filter((a: AssetRow) => !a.type.includes("Cash"))
    .reduce((a: number, b: AssetRow) => a + Number(b.value), 0);

  const allowance = vrij * Math.max(1, Math.min(2, persons.length));

  const fict =
    Math.max(0, spaargeld - allowance) * forfait.spaargeld +
    Math.max(0, overig - Math.max(0, allowance - spaargeld)) * forfait.overig;

  const tax = currency(fict * tarief);

  await prisma.taxYearCalc.upsert({
    where: { userId_year: { userId, year } },
    update: { box3_tax: tax },
    create: { userId, year, box3_tax: tax },
  });

  return tax;
}

// --------------------------------------------------------------------------------------
// Combine the year’s taxes and compute NBI
// --------------------------------------------------------------------------------------
export async function combine_tax_year(userId: string, year: number) {
  const [box1, zvw, kort, box2, box3] = await Promise.all([
    calc_box1_tax(userId, year), // NOTE: assumes you already have this function in the same module
    calc_zvw(userId, year),
    calc_heffingskortingen(userId, year),
    calc_box2_tax(userId, year),
    calc_box3_tax(userId, year),
  ]);

  const incomes = await prisma.income.findMany({ where: { userId } });
  const expenses = await prisma.expense.findMany({ where: { userId } });

  const grossY = incomes.reduce((a: number, i: IncomeRow) => a + Number(i.amount) * 12, 0);
  const expY = expenses.reduce((a: number, e: ExpenseRow) => a + Number(e.amount) * 12, 0);

  const kortingSum = Object.values(kort).reduce(
    (a: number, b: any) => a + Number(b || 0),
    0
  );

  const totalTax = Math.max(0, box1 + zvw + box2 + box3 - kortingSum);
  const nbi = currency(grossY - expY - totalTax);

  const prev = await prisma.taxYearCalc.findUnique({
    where: { userId_year: { userId, year } },
  });

  const breakdown = {
    ...(prev?.breakdown ?? {}),
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

// --------------------------------------------------------------------------------------
// NOTE: This file expects that you already define/import:
// - calc_box1_tax(userId: string, year: number)
// - getParam, splitIncome, piecewise, clamp, currency
// If those live in other modules, keep your existing imports.
// --------------------------------------------------------------------------------------
