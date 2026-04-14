import type { ReactNode } from "react";

interface CardProps {
  className?: string;
  children: ReactNode;
  hover?: boolean;
}

export default function Card({ className, children, hover = true }: CardProps) {
  return (
    <div
      className={`border border-border bg-bg-secondary ${
        hover ? "transition-colors duration-200 hover:border-accent/30" : ""
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
