// lib/tax/engine.ts
import { prisma } from "@/lib/prisma";
import type { Prisma, TaxYearCalc } from "@prisma/client";

/**
 * Shape of the calculated results you want to persist for a user/year.
 * Add/remove fields here to match what you compute elsewhere.
 */
export type TaxCalcInput = {
  year: number;
  userId: string;

  // numeric columns on TaxYearCalc
  taxable_box1: number;
  box1_tax: number;
  zvw: number;
  box2_tax: number;
  box3_tax: number;
  vpb: number;
  netto_bestede_inkomen: number;

  /**
   * heffingskortingen is a JSON column in your schema.
   * Pass any JSON-serializable value (usually an object).
   */
  heffingskortingen?: Prisma.InputJsonValue;

  /**
   * New information you want to store inside the JSON `breakdown` column.
   * Pass an object of key/value pairs (JSON-serializable).
   */
  breakdown?: Record<string, unknown>;
};

/**
 * Upserts a TaxYearCalc row for (userId, year), merging previous JSON breakdown (if any)
 * with the new breakdown values you provide.
 */
export async function saveTaxYearCalc(input: TaxCalcInput): Promise<TaxYearCalc> {
  const {
    year,
    userId,
    taxable_box1,
    box1_tax,
    zvw,
    box2_tax,
    box3_tax,
    vpb,
    netto_bestede_inkomen,
    heffingskortingen,
    breakdown,
  } = input;

  // 1) Load existing row (if it exists)
  const existing = await prisma.taxYearCalc.findUnique({
    where: { userId_year: { userId, year } },
    select: { breakdown: true },
  });

  // 2) Safely coerce the existing breakdown to a plain object (or {} if null/array/primitive)
  const prevBreakdown: Prisma.JsonObject =
    existing?.breakdown &&
    typeof existing.breakdown === "object" &&
    !Array.isArray(existing.breakdown)
      ? (existing.breakdown as Prisma.JsonObject)
      : {};

  // 3) Safely coerce the *new* breakdown you’re passing in
  const nextBreakdown: Prisma.JsonObject =
    breakdown && typeof breakdown === "object" && !Array.isArray(breakdown)
      ? (breakdown as unknown as Prisma.JsonObject)
      : {};

  // 4) Merge (object spread is now safe because both sides are JsonObject)
  const mergedBreakdown: Prisma.InputJsonValue = {
    ...prevBreakdown,
    ...nextBreakdown,
  };

  // 5) Upsert with merged JSON + numeric columns
  const row = await prisma.taxYearCalc.upsert({
    where: { userId_year: { userId, year } },
    update: {
      taxable_box1,
      box1_tax,
      zvw,
      box2_tax,
      box3_tax,
      vpb,
      netto_bestede_inkomen,
      heffingskortingen: heffingskortingen as Prisma.InputJsonValue | undefined,
      breakdown: mergedBreakdown,
    },
    create: {
      userId,
      year,
      taxable_box1,
      box1_tax,
      zvw,
      box2_tax,
      box3_tax,
      vpb,
      netto_bestede_inkomen,
      heffingskortingen: heffingskortingen as Prisma.InputJsonValue | undefined,
      breakdown: mergedBreakdown,
    },
  });

  return row;
}
