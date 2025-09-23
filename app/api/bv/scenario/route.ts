import { auth } from "@/lib/auth";
import { bvScenario } from "@/lib/tax/bv-scenarios";
export async function POST(req:Request){ const session = await auth(); if(!session?.user?.id) return Response.json({ error:"unauthorized" }, { status:401 }); const { profit, salary, dividend, year=2025 } = await req.json(); const calc = await bvScenario({ profit:Number(profit||0), salary:Number(salary||0), dividend:Number(dividend||0), year }); return Response.json(calc); }
