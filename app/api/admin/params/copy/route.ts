export const runtime = 'nodejs';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const { fromYear, toYear } = await req.json();

    if (typeof fromYear !== 'number' || typeof toYear !== 'number') {
      return Response.json(
        { error: 'fromYear and toYear must be numbers' },
        { status: 400 }
      );
    }

    const rows = await prisma.taxParam.findMany({ where: { year: fromYear } });

    if (rows.length === 0) {
      return Response.json({ ok: true, count: 0, note: 'No rows to copy' });
    }

    await prisma.$transaction(
      rows.map((r) =>
        prisma.taxParam.upsert({
          where: { key_year: { key: r.key, year: toYear } },
          update: {
            value: r.value as Prisma.InputJsonValue,
            meta: (r.meta ?? undefined) as Prisma.InputJsonValue | undefined,
          },
          create: {
            key: r.key,
            value: r.value as Prisma.InputJsonValue,
            year: toYear,
            meta: (r.meta ?? undefined) as Prisma.InputJsonValue | undefined,
          },
        })
      )
    );

    return Response.json({ ok: true, count: rows.length });
  } catch (err: any) {
    console.error(err);
    return Response.json(
      { error: 'Failed to copy tax params', detail: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
