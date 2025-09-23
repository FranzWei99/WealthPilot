"use client";
import useSWR from "swr";
import { useState } from "react";
const fetcher=(u:string)=>fetch(u).then(r=>r.json());
export default function ParamsAdmin(){
  const { data, mutate } = useSWR("/api/admin/params", fetcher);
  const [copyFrom,setCopyFrom]=useState(2025); const [copyTo,setCopyTo]=useState(2026);
  async function copy(){ await fetch("/api/admin/params/copy",{ method:"POST", body: JSON.stringify({ fromYear:copyFrom, toYear:copyTo })}); mutate(); }
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-white p-4 shadow">
        <div className="font-semibold mb-2">Kopieer parameters naar nieuw jaar</div>
        <div className="flex gap-2 text-sm">
          <input className="border rounded-xl p-2 w-24" type="number" value={copyFrom} onChange={e=>setCopyFrom(Number((e.target as any).value))} />
          <span>→</span>
          <input className="border rounded-xl p-2 w-24" type="number" value={copyTo} onChange={e=>setCopyTo(Number((e.target as any).value))} />
          <button className="px-3 py-2 rounded-xl bg-brand-600 text-white" onClick={copy}>Kopieer</button>
        </div>
      </div>
      <div className="rounded-2xl border bg-white p-4 shadow">
        <div className="font-semibold mb-2">Parameters ({data?data.length:0})</div>
        <pre className="text-xs bg-slate-50 rounded-xl p-3 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
