"use client";
import { useMemo } from "react";
import { KPI, gradients } from "@/components/ui/KPI";
import { FloatingPanel } from "@/components/ui/FloatingPanel";
import { currency } from "@/lib/format";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

const demoAssets = [
  { type: "Real Estate", value: 525000, debt: 350000 },
  { type: "Stocks & ETFs", value: 78000, debt: 0 },
  { type: "Cash & Liquid", value: 22000, debt: 0 },
  { type: "Retirement", value: 65000, debt: 0 },
  { type: "Private Equity / Debt", value: 15000, debt: 0 },
  { type: "Bonds", value: 12000, debt: 0 }
];
const demoIncome = [{ amount: 4200 }, { amount: 180 }, { amount: 800 }];
const demoExpenses = [{ amount: 1650 }, { amount: 230 }, { amount: 600 }, { amount: 280 }];

export default function Dashboard() {
  const totalAssets = useMemo(()=> demoAssets.reduce((a,b)=>a+b.value,0),[]);
  const totalDebt = useMemo(()=> demoAssets.reduce((a,b)=>a+b.debt,0),[]);
  const netWorth = totalAssets - totalDebt;
  const monthlyIncome = demoIncome.reduce((a,b)=>a+b.amount,0);
  const monthlyExpenses = demoExpenses.reduce((a,b)=>a+b.amount,0);
  const monthlyCF = monthlyIncome - monthlyExpenses;
  const allocation = useMemo(()=>{ const by:Record<string,number>={}; demoAssets.forEach(a=>by[a.type]=(by[a.type]||0)+a.value); return Object.entries(by).map(([name,value])=>({ name, value })); },[]);
  const cashFlowData = [ { name: "Income", value: monthlyIncome }, { name: "Expenses", value: monthlyExpenses } ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon={null} title="Net Worth" value={currency(netWorth)} gradient={gradients.purple} />
        <KPI icon={null} title="Total Assets" value={currency(totalAssets)} gradient={gradients.green} />
        <KPI icon={null} title="Monthly Cash Flow" value={currency(monthlyCF)} gradient={gradients.orange} />
        <KPI icon={null} title="Goals Tracked" value={`2+`} gradient={gradients.blue} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FloatingPanel title="Net Worth & Allocation" right={<span className="text-xs text-slate-500">Pastel visuals</span>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-slate-500 mb-1">Net Worth</div>
              <div className="text-3xl font-bold mb-4">{currency(netWorth)}</div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={allocation} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50} paddingAngle={2}>
                    {allocation.map((_, idx) => (<Cell key={idx} fill={["#c7d2fe","#bbf7d0","#fde68a","#fbcfe8","#a7f3d0","#e9d5ff"][idx%6]} stroke="#fff" strokeWidth={1} />))}
                  </Pie>
                  <Tooltip formatter={(v)=>currency(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-1">Monthly Cash Flow</div>
              <div className={`text-2xl font-semibold mb-4 ${monthlyCF>=0?"text-emerald-600":"text-rose-600"}`}>{currency(monthlyCF)}</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={cashFlowData}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip formatter={(v)=>currency(Number(v))} />
                  <Area type="monotone" dataKey="value" stroke="#a855f7" fill="#e9d5ff" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FloatingPanel>
        <div className="lg:col-span-2">
          <FloatingPanel title="Scenario Projection (placeholder)"><div className="text-sm text-slate-500">Hook up your scenario lines here later.</div></FloatingPanel>
        </div>
      </div>
    </div>
  );
}
