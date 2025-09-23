"use client";
import { useState } from "react";
import { FloatingPanel } from "@/components/ui/FloatingPanel";
export default function AssetsPage(){
  const [list,setList]=useState([{ id:"1", type:"Stocks & ETFs", name:"S&P 500 ETF", value:78000, debt:0 }]);
  const [form,setForm]=useState({ type:"Stocks & ETFs", name:"", value:0, debt:0 });
  function add(){ if(!form.name) return; setList(p=>[{ id:Math.random().toString(36).slice(2,9), ...form },...p]); setForm({ type:"Stocks & ETFs", name:"", value:0, debt:0 }); }
  function del(id:string){ setList(p=>p.filter(i=>i.id!==id)); }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <FloatingPanel title="Asset Overview">(Allocation Pie can go here)</FloatingPanel>
      <div className="lg:col-span-2">
        <FloatingPanel title="Assets" right={<span className="text-xs text-slate-500">Add / edit / delete</span>}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pb-3">
            <select value={form.type} onChange={(e)=>setForm(f=>({...f,type:(e.target as any).value}))} className="border rounded-xl p-2">
              {["Real Estate","Stocks & ETFs","Bonds","Cash & Liquid","Retirement","Private Equity / Debt"].map(t=> <option key={t}>{t}</option>)}
            </select>
            <input className="border rounded-xl p-2" placeholder="Name" value={form.name} onChange={(e)=>setForm(f=>({...f,name:(e.target as any).value}))} />
            <input className="border rounded-xl p-2" type="number" placeholder="Value (€)" value={form.value} onChange={(e)=>setForm(f=>({...f,value:Number((e.target as any).value)}))} />
            <input className="border rounded-xl p-2" type="number" placeholder="Debt (€)" value={form.debt} onChange={(e)=>setForm(f=>({...f,debt:Number((e.target as any).value)}))} />
            <div className="md:col-span-4"><button onClick={add} className="px-4 py-2 rounded-xl bg-brand-600 text-white">Add Asset</button></div>
          </div>
          <div className="space-y-2">
            {list.map(a=> (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-xl border">
                <div>
                  <div className="text-sm text-slate-500">{a.type}</div>
                  <div className="font-medium">{a.name}</div>
                  <div className="text-sm">€{a.value.toLocaleString()} {a.debt?/* */"• Debt €{a.debt.toLocaleString()}":""}</div>
                </div>
                <button className="px-3 py-1 rounded-xl border" onClick={()=>del(a.id)}>Delete</button>
              </div>
            ))}
          </div>
        </FloatingPanel>
      </div>
    </div>
  );
}
