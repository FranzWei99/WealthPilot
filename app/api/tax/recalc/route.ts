import { auth } from "@/lib/auth";
import { combine_tax_year } from "@/lib/tax/engine";
export async function POST(){
  const session = await auth(); if(!session?.user?.id) return Response.json({ error:"unauthorized" }, { status:401 });
  const year = 2025; const calc = await combine_tax_year(session.user.id, year);
  return Response.json(calc);
}
