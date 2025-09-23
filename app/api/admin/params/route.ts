import { prisma } from "@/lib/prisma";
export async function GET(){ const list = await prisma.taxParam.findMany({ where:{ year:2025 } }); return Response.json(list); }
export async function POST(req:Request){ const body = await req.json(); const created = await prisma.taxParam.upsert({ where:{ key_year:{ key: body.key, year: body.year } }, update:{ value: body.value, meta: body.meta }, create: body }); return Response.json(created); }
