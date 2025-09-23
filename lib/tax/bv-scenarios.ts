import { getParam } from "./parameters";
export async function bvScenario({ profit, salary, dividend, year }:{ profit:number; salary:number; dividend:number; year:number }){
  const gebruikelijk = await getParam<number>("DGA_gebruikelijk_loon", year).catch(()=>56000);
  const salaryUsed = Math.max(salary, gebruikelijk);
  const vpbSchijven = await getParam<any>("Vpb_schijven", year);
  const vpb = piecewise(profit, vpbSchijven);
  const profitAfterVpb = Math.max(0, profit - vpb);
  const box2Schijven = await getParam<any>("Box2_tarief", year);
  const grossBox2 = piecewise(dividend, box2Schijven);
  const withholdRate = await getParam<number>("Dividendbelasting", year).catch(()=>0.15);
  const withheld = dividend * withholdRate;
  const netBox2Payable = Math.max(0, grossBox2 - withheld);
  const net_for_owner = profitAfterVpb - dividend + (dividend - withheld - netBox2Payable);
  return { vpb, profitAfterVpb, salaryUsed, withheld, box2: grossBox2, box2_net: netBox2Payable, net_for_owner };
}
function piecewise(amount:number,br:{from:number;to:number;rate:number}[]){ let t=0; for(const b of br){ const base=Math.max(0,Math.min(amount,b.to)-b.from); if(base>0) t+=base*b.rate; if(amount<=b.to) break; } return t; }
