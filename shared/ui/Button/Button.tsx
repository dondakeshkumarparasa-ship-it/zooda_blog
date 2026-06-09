import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-[#15A148] hover:bg-[#128a3d] text-white shadow-md shadow-green-600/20 focus:ring-[#15A148]",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-300",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 focus:ring-red-500",
    ghost: "bg-transparent hover:bg-slate-50 text-slate-700 focus:ring-slate-200"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
