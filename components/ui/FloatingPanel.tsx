import { Card } from "@/components/ui/shadcn-card";
export function FloatingPanel({ title, right, children }: { title:string; right?:React.ReactNode; children:React.ReactNode }) {
  return (
    <Card className="rounded-2xl border bg-white shadow-floating card-hover">
      <div className="px-4 py-3 flex items-center justify-between border-b">
        <div className="text-lg font-semibold text-slate-800">{title}</div>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </Card>
  );
}
