// app/debug/tax/page.tsx

"use client";

import { useEffect, useState } from "react";

// Define a minimal row type so TS knows what r is
type Row = {
  userId: string;
  year: number;
  taxable_box1?: number;
  box1_tax?: number;
  zvw?: number;
  heffingskortingen?: number;
  box2_tax?: number;
  box3_tax?: number;
  vpb?: number;
  netto_bestede_inkomen?: number;
  [k: string]: any;
};

export default function DebugTaxPage() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/tax/recalc");
        const data = await res.json();
        setRows(data as Row[]);
      } catch (err) {
        console.error("Failed to fetch tax data", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Debug Tax Calculations</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-3 py-2 border">User</th>
            <th className="px-3 py-2 border">Year</th>
            <th className="px-3 py-2 border">Box 1 Taxable</th>
            <th className="px-3 py-2 border">Box 1 Tax</th>
            <th className="px-3 py-2 border">ZVW</th>
            <th className="px-3 py-2 border">Heffingskortingen</th>
            <th className="px-3 py-2 border">Box 2 Tax</th>
            <th className="px-3 py-2 border">Box 3 Tax</th>
            <th className="px-3 py-2 border">VPB</th>
            <th className="px-3 py-2 border">Netto besteedbaar inkomen</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: Row) => (
            <tr
              key={`${r.userId}-${r.year}`}
              className="border-b last:border-b-0"
            >
              <td className="py-2 px-3 border">{r.userId}</td>
              <td className="py-2 px-3 border">{r.year}</td>
              <td className="py-2 px-3 border">{r.taxable_box1 ?? "-"}</td>
              <td className="py-2 px-3 border">{r.box1_tax ?? "-"}</td>
              <td className="py-2 px-3 border">{r.zvw ?? "-"}</td>
              <td className="py-2 px-3 border">{r.heffingskortingen ?? "-"}</td>
              <td className="py-2 px-3 border">{r.box2_tax ?? "-"}</td>
              <td className="py-2 px-3 border">{r.box3_tax ?? "-"}</td>
              <td className="py-2 px-3 border">{r.vpb ?? "-"}</td>
              <td className="py-2 px-3 border">
                {r.netto_bestede_inkomen ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
