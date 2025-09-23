import { prisma } from "@/lib/prisma";

// Infer a single row type from the actual query return type:
type Row = Awaited<ReturnType<typeof prisma.taxYearCalc.findMany>>[number];

export default async function DebugTax() {
  const rows: Row[] = await prisma.taxYearCalc.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-3">
      {rows.map((r: Row) => (
        <details key={r.id as unknown as string} className="rounded-xl border bg-white p-3">
          <summary className="cursor-pointer text-sm font-medium">
            {String(r.year)} • {String(r.userId)} • NBI: €
            {Math.round(Number(r.netto_bestede_inkomen)).toLocaleString()}
          </summary>
          <pre className="text-xs bg-slate-50 rounded-xl p-3 overflow-auto">
            {JSON.stringify(r, null, 2)}
          </pre>
        </details>
      ))}
    </div>
  );
}
