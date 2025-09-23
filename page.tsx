// app/debug/tax/page.tsx
// Server component to inspect TaxYearCalc rows without importing the Prisma model type.
import { prisma } from "@/lib/prisma";

export default async function DebugTax() {
  const rows = await prisma.taxYearCalc.findMany({
    orderBy: [{ year: "desc" }],
    take: 50,
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">TaxYearCalc (latest 50)</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-3">User</th>
            <th className="py-2 pr-3">Year</th>
            <th className="py-2 pr-3">Box1</th>
            <th className="py-2 pr-3">Zvw</th>
            <th className="py-2 pr-3">Box2</th>
            <th className="py-2 pr-3">Box3</th>
            <th className="py-2 pr-3">NBI</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.userId}-${r.year}`} className="border-b last:border-b-0">
              <td className="py-2 pr-3">{r.userId}</td>
              <td className="py-2 pr-3">{r.year}</td>
              <td className="py-2 pr-3">{String(r.box1_tax ?? "")}</td>
              <td className="py-2 pr-3">{String(r.zvw ?? "")}</td>
              <td className="py-2 pr-3">{String(r.box2_tax ?? "")}</td>
              <td className="py-2 pr-3">{String(r.box3_tax ?? "")}</td>
              <td className="py-2 pr-3">{String(r.netto_bestede_inkomen ?? "")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
