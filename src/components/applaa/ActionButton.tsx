import { APP_CONFIG } from "@/app-config";
import { THEMES } from "@/components/applaa/presets/themes";
import type { ReactNode } from "react";

interface ActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "ghost";
}

export function ActionButton({
  children,
  onClick,
  size = "md",
  className = "",
  disabled = false,
  variant = "primary",
}: ActionButtonProps) {
  const theme = THEMES[APP_CONFIG.theme];

  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-xl",
    md: "px-6 py-3 text-base rounded-2xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
  };

  if (variant === "ghost") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`font-bold ${theme.primaryText} ${sizeClasses[size]}
          transition-all duration-200 hover:scale-105 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-black text-white ${theme.primaryClass} ${sizeClasses[size]}
        shadow-lg transition-all duration-200 hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-2 justify-center ${className}`}
    >
      {children}
    </button>
  );
}
