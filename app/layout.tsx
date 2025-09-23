import "./globals.css";
import React from "react";
import Link from "next/link";
export const metadata = { title: "WealthPilot" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <header className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <div className="h-6 w-6 rounded-xl bg-brand-500" /> WealthPilot
            </div>
            <nav className="hidden md:flex gap-4 text-sm">
              {[
                ["/", "Home"],
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
                <Link key={href as string} href={href as string} className="text-slate-600 hover:text-brand-700">{label as string}</Link>
              ))}
            </nav>
          </header>
          {children}
          <footer className="mt-10 text-xs text-slate-500">© {new Date().getFullYear()} WealthPilot • For educational purposes only</footer>
        </div>
      </body>
    </html>
  );
}
