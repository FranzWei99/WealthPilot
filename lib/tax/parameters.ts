import { prisma } from "@/lib/prisma";
export async function getParam<T=any>(key:string, year:number){ const p = await prisma.taxParam.findUnique({ where: { key_year: { key, year } } }); if (!p) throw new Error(`Param not found: ${key} ${year}`); return p.value as T; }
