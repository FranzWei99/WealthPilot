// lib/tax/helpers.ts
// Centralized, reusable utilities for the tax engine.
// These are pure functions with explicit types to avoid implicit-any issues.

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

// Round to 2 decimals; safe for UI display / storage of money-like values.
export function currency(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

// Generic piecewise calculator (e.g., tax brackets).
// Example brackets: [{ upto: 73000, rate: 0.367 }, { rate: 0.495 }]
export function piecewise(
  value: number,
  brackets: Array<{ upto?: number; rate: number }>
): number {
  let tax = 0;
  let last = 0;
  for (const b of brackets) {
    const cap = (b.upto ?? Infinity);
    const slice = Math.max(0, Math.min(value, cap) - last);
    tax += slice * b.rate;
    last = Math.min(value, cap);
    if (last >= value) break;
  }
  return tax;
}

// Split income rows into yearly totals for employee (loondienst) vs. ZZP/zelfstandig.
type IncomeLike = { type?: string | null; amount: number };

export function splitIncome(incomes: IncomeLike[]): { employeeY: number; zzpY: number } {
  let employeeY = 0;
  let zzpY = 0;
  for (const i of incomes) {
    const t = (i.type ?? "").toLowerCase();
    const yearly = i.amount * 12;
    if (t.includes("zzp") || t.includes("zelfstandig") || t.includes("freelance")) {
      zzpY += yearly;
    } else {
      employeeY += yearly;
    }
  }
  return { employeeY, zzpY };
}

// lib/tax/helpers.ts

// ...your other helpers (currency, clamp, piecewise, splitIncome, etc.)

/**
 * Return a parameter value for a given key/year.
 * Replace the body with your real data source later.
 */
export async function getParam<T = any>(key: string, year: number): Promise<T> {
  console.warn(`[getParam] Placeholder return for key="${key}" year=${year}`);
  return {} as T;
}

// Make sure other helpers are exported as needed, e.g.:
export { /* currency, clamp, piecewise, splitIncome, ... */ };

