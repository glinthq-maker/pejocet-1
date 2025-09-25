import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const base = "inline-flex items-center justify-center whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-0";
    const variants = {
      default: "bg-cyan-500 text-black hover:bg-cyan-400 focus:ring-cyan-400/60",
      outline: "border border-white/20 bg-white text-black transition-all duration-300 hover:bg-black hover:text-white hover:border-white",
    };
    return (
      <button ref={ref} className={`${base} ${variants[variant]} ${className}`} {...props} />
    );
  }
);
Button.displayName = "Button";
