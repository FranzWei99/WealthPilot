"use client";
import { useState, useMemo } from "react";
import { FloatingPanel } from "@/components/ui/FloatingPanel";
import { currency } from "@/lib/format";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
function scenarios({ start, annual, years, expected, stdev }:{ start:number; annual:number; years:number; expected:number; stdev:number; }){
  const mu=expected/100, sigma=stdev/100; let p=start,n=start,m=start; const out:any[]=[];
  for(let y=0;y<=years;y++){ if(y>0){ p=(p+annual)*(1+mu+sigma); n=(n+annual)*(1+mu); m=(m+annual)*(1+mu-sigma);} out.push({ year:y, Positive:p, Neutral:n, Negative:m }); } return out;
}
export default function Scenarios(){
  const [cfg,setCfg]=useState({ start:182000, annual:12000, years:15, expected:7, stdev:12 });
  const lines = useMemo(()=> scenarios(cfg),[cfg]);
  const summaries=[ { name:"Positive", final: lines.at(-1)?.Positive||0 }, { name:"Neutral", final: lines.at(-1)?.Neutral||0 }, { name:"Negative", final: lines.at(-1)?.Negative||0 } ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <FloatingPanel title="Scenario Controls">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[ ["Starting portfolio (€)","start"], ["Annual contribution (€)","annual"], ["Horizon (years)","years"], ["Expected return (%)","expected"], ["Std deviation (%)","stdev"] ].map(([label,key])=> (
            <label key={key} className="space-y-1"><div className="text-xs text-slate-500">{label}</div><input className="border rounded-xl p-2" type="number" value={(cfg as any)[key]} onChange={(e)=>setCfg(s=>({...s,[key as string]: Number((e.target as any).value)}))} /></label>
          ))}
        </div>
      </FloatingPanel>
      <div className="lg:col-span-2">
        <FloatingPanel title="Projection">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={lines}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(v)=>currency(Number(v))} />
              <Legend />
              <Line type="monotone" dataKey="Positive" stroke="#22c55e" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Neutral" stroke="#6366f1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Negative" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            {summaries.map(s=> (<div key={s.name} className="rounded-xl border p-4 bg-white"><div className="text-xs text-slate-500">{s.name} (final)</div><div className="text-xl font-bold">{currency(s.final)}</div></div>))}
          </div>
        </FloatingPanel>
      </div>
    </div>
  );
}
