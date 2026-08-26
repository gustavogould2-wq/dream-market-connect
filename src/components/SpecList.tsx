import type { Spec } from "@/lib/specs";

export function SpecList({ specs, limit }: { specs: Spec[]; limit?: number }) {
  const visible = limit ? specs.slice(0, limit) : specs;
  if (visible.length === 0) return null;

  return (
    <dl className="divide-y divide-border/60 border-y border-border/60">
      {visible.map((spec) => (
        <div key={spec.label} className="flex items-baseline justify-between gap-4 py-2">
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">{spec.label}</dt>
          <dd className="text-sm font-medium text-foreground text-right">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}
