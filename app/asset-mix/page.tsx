"use client";
import { FloatingPanel } from "@/components/ui/FloatingPanel";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { percent } from "@/lib/format";
export default function AssetMix(){
  const current=[{name:"Stocks",pct:.52},{name:"Liquidities",pct:.14},{name:"Real Assets",pct:.24},{name:"Private Equity / Private Debt",pct:.10}];
  const ideal=[{name:"Stocks",pct:.60},{name:"Liquidities",pct:.15},{name:"Real Assets",pct:.15},{name:"Private Equity / Private Debt",pct:.10}];
  const data=current.map(c=>({ name:c.name, Current:c.pct, Ideal:(ideal.find(i=>i.name===c.name)?.pct)||0 }));
  return (
    <FloatingPanel title="Asset Mix — Current vs Ideal">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(v)=>percent(Number(v))} />
          <Tooltip formatter={(v)=>percent(Number(v))} />
          <Legend />
          <Line type="monotone" dataKey="Current" stroke="#818cf8" strokeWidth={2} dot />
          <Line type="monotone" dataKey="Ideal" stroke="#f59e0b" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </FloatingPanel>
  );
}
