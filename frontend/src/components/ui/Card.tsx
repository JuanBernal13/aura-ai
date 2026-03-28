import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  variant?: "asym" | "asym-alt" | "sliced" | "elevated";
  className?: string;
  onClick?: () => void;
  accent?: boolean;
}

export function Card({ 
  children, 
  variant = "asym", 
  className = "", 
  onClick,
  accent = false
}: CardProps) {
  
  const baseStyles = "bg-white border border-[var(--border)] transition-all overflow-hidden";
  
  const variants = {
    asym: "card-asym",
    "asym-alt": "card-asym-alt",
    sliced: "card-sliced",
    elevated: "card-elevated"
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${accent ? "card-accent" : ""} ${onClick ? "cursor-pointer" : ""} ${className}`;

  return (
    <div onClick={onClick} className={combinedClasses}>
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  progress?: number;
  icon?: ReactNode;
  variant?: "asym" | "asym-alt";
}

export function StatCard({ label, value, subLabel, progress, icon, variant = "asym" }: StatCardProps) {
  return (
    <Card variant={variant} className="p-10 group">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--accent)] transition-colors">{label}</h3>
          <span className="text-[11px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">{subLabel}</span>
        </div>
        {icon}
      </div>
      <div className="flex gap-16 mb-10 items-end">
        <div>
          <span className="text-3xl font-bold text-[var(--foreground)]">{value}</span>
        </div>
      </div>
      {progress !== undefined && (
        <div className="w-full h-2 bg-[var(--surface-alt)] rounded-full overflow-hidden">
          <div className="h-full progress-accent transition-all duration-1000" style={{ width: `${progress}%` }} />
        </div>
      )}
    </Card>
  );
}
