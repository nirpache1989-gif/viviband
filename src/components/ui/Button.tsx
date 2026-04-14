import { Link } from "@/i18n/navigation";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentProps<"button">, keyof ButtonBaseProps> & {
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentProps<typeof Link>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-accent text-text-primary hover:bg-accent-hover active:bg-accent-hover",
  secondary:
    "border border-border text-text-primary hover:border-accent hover:text-accent",
  ghost:
    "text-text-secondary hover:text-text-primary",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-6 py-2.5 text-xs",
  lg: "px-8 py-3.5 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-body uppercase tracking-[0.15em] transition-all duration-200";
  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className ?? ""}`;

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props as ButtonAsLink;
    return (
      <Link href={href} className={styles} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button className={styles} {...buttonProps}>
      {children}
    </button>
  );
}
