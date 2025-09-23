import Link from "next/link";
export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        ["/dashboard", "Dashboard"],
        ["/assets", "Assets"],
        ["/income-expenses", "Income & Expenses"],
        ["/investments", "Investments"],
        ["/goals", "Goals"],
        ["/asset-mix", "Asset Mix"],
        ["/scenarios", "Scenarios"],
        ["/belastingen", "Belastingen"],
        ["/belastingen-bv", "Belastingen (BV/DGA)"],
        ["/admin/parameters", "Admin"],
      ].map(([href, label]) => (
        <Link key={href as string} href={href as string} className="p-6 rounded-2xl border bg-white shadow hover:shadow-lg transition">
          <div className="text-lg font-semibold">{label as string}</div>
          <div className="text-sm text-slate-500">Open {label as string}</div>
        </Link>
      ))}
    </div>
  );
}
