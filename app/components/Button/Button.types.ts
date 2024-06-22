import { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<unknown> {
  children: ReactNode;
  size?: ButtonSize;
  color?: "primary" | "neutral";
  variant?: "solid" | "outline" | "text" | "ghost";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}
