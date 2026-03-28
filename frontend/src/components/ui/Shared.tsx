import { ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "neutral";
  className?: string;
  size?: "sm" | "md";
}

export function Badge({ 
  children, 
  variant = "primary", 
  className = "", 
  size = "md" 
}: BadgeProps) {
  
  const baseStyles = "inline-flex items-center tag-pill";
  
  const variants = {
    primary: "bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent)]/20",
    success: "bg-emerald-50 text-emerald-600 border-emerald-200/50",
    warning: "bg-indigo-50 text-indigo-400 border-indigo-100",
    danger: "bg-rose-50 text-rose-500 border-rose-100",
    neutral: "bg-slate-50 text-slate-400 border-slate-100"
  };

  const sizes = {
    sm: "px-3 py-1 text-[9px]",
    md: "px-4 py-1.5 text-[10px]"
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <span className={combinedClasses} role="status">
      {children}
    </span>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="group">
      {label && (
        <label className="block text-[13px] font-black uppercase tracking-[0.1em] text-[#86868B] mb-3 ml-1 group-focus-within:text-[var(--accent)] transition-colors">
          {label}
        </label>
      )}
      <input 
        className={`w-full px-6 py-5 bg-[#F5F5F7] border-transparent rounded-[16px] focus:bg-white focus:ring-4 focus:ring-[var(--accent-glow)] transition-all text-[17px] font-medium outline-none placeholder:text-[#C5C5C7] ${className}`}
        {...props}
      />
    </div>
  );
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = "", ...props }: TextareaProps) {
  return (
    <div className="group">
      {label && (
        <label className="block text-[13px] font-black uppercase tracking-[0.1em] text-[#86868B] mb-3 ml-1 group-focus-within:text-[var(--accent)] transition-colors">
          {label}
        </label>
      )}
      <textarea 
        className={`w-full px-6 py-5 bg-[#F5F5F7] border-transparent rounded-[16px] focus:bg-white focus:ring-4 focus:ring-[var(--accent-glow)] transition-all text-[17px] font-medium outline-none resize-none placeholder:text-[#C5C5C7] ${className}`}
        {...props}
      />
    </div>
  );
}
