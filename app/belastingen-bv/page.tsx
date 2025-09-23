"use client";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { FloatingPanel } from "@/components/ui/FloatingPanel";
import { currency } from "@/lib/format";
async function post(url:string,{ arg }:{ arg:any }){ const r=await fetch(url,{ method:"POST", body: JSON.stringify(arg) }); return r.json(); }
export default function BelastingBv(){
  const [form,setForm]=useState({ profit:150000, salary:56000, dividend:30000, year:2025 });
  const { trigger, data } = useSWRMutation("/api/bv/scenario", post);
  function run(){ trigger(form as any); }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <FloatingPanel title="Invoer">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[ ["Winst voor Vpb","profit"], ["DGA-loon","salary"], ["Dividend","dividend"], ["Jaar","year"] ].map(([label,key])=> (
            <label key={key} className="space-y-1"><div className="text-xs text-slate-500">{label}</div><input className="border rounded-xl p-2" type="number" value={(form as any)[key]} onChange={(e)=>setForm(s=>({...s,[key as string]: Number((e.target as any).value)}))} /></label>
          ))}
          <div className="col-span-2"><button onClick={run} className="px-4 py-2 rounded-xl bg-brand-600 text-white">Bereken scenario</button></div>
        </div>
      </FloatingPanel>
      <FloatingPanel title="Resultaat BV & aandeelhouder">
        {data? (<div className="text-sm space-y-2">
          <div>Vpb: <b>{currency(data.vpb)}</b></div>
          <div>Winst na Vpb: <b>{currency(data.profitAfterVpb)}</b></div>
          <div>Gebruikelijk loon (gebruikt): <b>{currency(data.salaryUsed)}</b></div>
          <div>Dividend voorheffing 15%: <b>{currency(data.withheld)}</b></div>
          <div>Box 2 totaal: <b>{currency(data.box2)}</b> • te betalen na voorheffing: <b>{currency(data.box2_net)}</b></div>
          <div className="mt-2">Netto voordeel aandeelhouder (ex loonbelasting): <b>{currency(data.net_for_owner)}</b></div>
        </div>) : <div className="text-slate-500 text-sm">Voer waarden in en bereken.</div>}
      </FloatingPanel>
      <FloatingPanel title="Scenario’s (mix)"><p className="text-sm text-slate-600">Varieer tussen hoger loon / lager dividend. Loon beïnvloedt Box 1 + Zvw; dividend via Box 2 met 15% voorheffing.</p></FloatingPanel>
    </div>
  );
}
