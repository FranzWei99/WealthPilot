import { prisma } from "@/lib/prisma";
export default async function DebugTax(){
  const rows = await prisma.taxYearCalc.findMany({ orderBy:{ createdAt:"desc" }, take: 20 });
  return (
    <div className="space-y-3">
      {rows.map(r=> (
        <details key={r.id} className="rounded-xl border bg-white p-3">
          <summary className="cursor-pointer text-sm font-medium">{r.year} • {r.userId} • NBI: €{Math.round(r.netto_bestede_inkomen).toLocaleString()}</summary>
          <pre className="text-xs bg-slate-50 rounded-xl p-3 overflow-auto">{JSON.stringify(r, null, 2)}</pre>
        </details>
      ))}
    </div>
  );
}
