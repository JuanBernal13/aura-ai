import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
}

export function Button({ 
  children, 
  onClick, 
  className = "", 
  type = "button", 
  disabled = false,
  variant = "primary",
  size = "md",
  href
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  
  const variants = {
    primary: "btn-accent text-white shadow-lg shadow-[#6c5ce7]/20",
    outline: "btn-outline bg-white",
    ghost: "text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--surface-alt)]",
    danger: "bg-[var(--danger)] text-white hover:opacity-90"
  };

  const sizes = {
    sm: "px-4 py-2 text-[12px] rounded-lg",
    md: "px-6 py-3 text-[14px] rounded-xl",
    lg: "px-8 py-4 text-[17px] rounded-2xl",
    xl: "px-10 py-5 text-[19px] rounded-full"
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={combinedClasses}>
      <span>{children}</span>
    </button>
  );
}
