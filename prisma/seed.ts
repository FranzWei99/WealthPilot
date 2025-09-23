import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main(){
  const year = 2025;
  const data = [
    { key:"IB_box1_schijven", value:[{from:0,to:75000,rate:0.3687},{from:75000,to:999999999,rate:0.495}], year },
    { key:"IB_box1_schijven_AOW", value:[{from:0,to:38500,rate:0.1962},{from:38500,to:75000,rate:0.3687},{from:75000,to:999999999,rate:0.495}], year },
    { key:"Heffingskorting_algemeen", value:{ max:3370, afbouw_start:24000, afbouw_rate:0.06095 }, year },
    { key:"Heffingskorting_arbeid", value:{ max:5500, opbouw:0.03094, afbouw_start:39000, afbouw_rate:0.06095 }, year },
    { key:"Heffingskorting_iack", value:{ max:2500, voorwaarden:"minimaal 1 kind <12 jaar, voldoende arbeidsinkomen" }, year },
    { key:"Heffingskorting_ouderenkorting", value:{ max:2000, afbouw_start:42000, afbouw_rate:0.150 }, year },
    { key:"Zvw_werknemer", value:{ rate:0.0687, max_income:70500 }, year },
    { key:"Zvw_zelfstandig", value:{ rate:0.0590, max_income:70500 }, year },
    { key:"Box2_tarief", value:[{from:0,to:67000,rate:0.245},{from:67000,to:999999999,rate:0.317}], year },
    { key:"Box3_vrijstelling_per_persoon", value:57000, year },
    { key:"Box3_forfait", value:{ spaargeld:0.0096, overig:0.0677 }, year },
    { key:"Box3_tarief", value:0.36, year },
    { key:"Eigenwoningforfait", value:[{from:0,to:1270000,rate:0.0035},{from:1270000,to:999999999,rate:0.021}], year },
    { key:"Hypotheekrenteaftrek_max", value:0.367, year },
    { key:"Vpb_schijven", value:[{from:0,to:200000,rate:0.19},{from:200000,to:999999999,rate:0.258}], year },
    { key:"DGA_gebruikelijk_loon", value:56000, year },
    { key:"Dividendbelasting", value:0.15, year },
    { key:"Zelfstandigenaftrek", value:3750, year },
    { key:"Startersaftrek", value:2123, year },
    { key:"Mkb_winstvrijstelling", value:0.14, year },
    { key:"Kleinschaligheidsinvesteringsaftrek", value:{ max_percentage:0.28, grensbedragen:[{from:0,to:21000,percentage:0.28},{from:21001,to:120000,percentage:0.13},{from:120001,to:999999999,percentage:0.0}] }, year },
    { key:"BTW_tarief_laatste_standaard", value:0.21, year },
    { key:"BTW_tarief_laatste_verlaagd", value:0.09, year },
    { key:"Testcase_werknemer", value:{ inkomen:50000, woning:350000, hypotheek:250000 }, year },
    { key:"Testcase_zzp", value:{ inkomen:60000, zelfstandigenaftrek:true }, year },
    { key:"Testcase_DGA", value:{ BV_winst:150000, dga_loon:56000, dividend:30000 }, year },
    { key:"Testcase_pensioen", value:{ AOW:17000, pensioen:10000 }, year },
    { key:"Testcase_box3", value:{ spaargeld:120000, beleggingen:300000, schuld:100000 }, year }
  ];
  for(const row of data){
    await prisma.taxParam.upsert({
      where:{ key_year: { key:row.key, year:row.year }},
      update:{ value:row.value },
      create:row as any
    });
  }
}
main().finally(()=>prisma.$disconnect());
