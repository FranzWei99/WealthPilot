import { motion } from "framer-motion";
export function KPI({ icon: Icon, title, value, gradient }: { icon: any; title:string; value:string; gradient:string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className={`rounded-2xl text-white shadow-lg ${gradient} card-hover`}>
        <div className="p-5 flex items-center gap-3">
          <div className="bg-white/20 rounded-xl p-2 shadow">{Icon ? <Icon className="h-5 w-5" /> : <span>•</span>}</div>
          <div>
            <div className="text-xs uppercase tracking-wide opacity-90">{title}</div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
export const gradients = {
  blue: "bg-gradient-to-br from-sky-400 via-sky-300 to-sky-500",
  green: "bg-gradient-to-br from-emerald-400 via-emerald-300 to-emerald-500",
  orange: "bg-gradient-to-br from-orange-400 via-amber-300 to-orange-500",
  purple: "bg-gradient-to-br from-brand-400 via-brand-300 to-brand-600"
};
