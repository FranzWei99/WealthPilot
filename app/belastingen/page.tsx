"use client";
import useSWR from "swr";
import { FloatingPanel } from "@/components/ui/FloatingPanel";
import { currency } from "@/lib/format";
const fetcher=(u:string)=>fetch(u,{ method:"POST" }).then(r=>r.json());
export default function BelastingPrive(){
  const { data } = useSWR("/api/tax/recalc", fetcher, { refreshInterval:0, revalidateOnFocus:false });
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <FloatingPanel title="Box 1 + Kortingen"><Pre v={{ box1_tax:data?.box1_tax, kortingen:data?.heffingskortingen }} /></FloatingPanel>
      <FloatingPanel title="Zvw"><Pre v={data?.zvw} /></FloatingPanel>
      <FloatingPanel title="Box 2"><Pre v={data?.box2_tax} /></FloatingPanel>
      <FloatingPanel title="Box 3"><Pre v={data?.box3_tax} /></FloatingPanel>
      <FloatingPanel title="Netto besteedbaar inkomen"><div className="text-3xl font-bold">{data?currency(data.netto_bestede_inkomen):"—"}</div></FloatingPanel>
    </div>
  );
}
function Pre({ v }:{ v:any }){ return <pre className="text-xs bg-slate-50 rounded-xl p-3 overflow-auto">{JSON.stringify(v, null, 2)}</pre>; }
