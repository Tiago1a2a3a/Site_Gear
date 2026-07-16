import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type SharedButtonProps = Readonly<{
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
}>;

type ButtonLinkProps = SharedButtonProps &
  Readonly<{
    href: `/${string}` | "/";
  }>;

type NativeButtonProps = SharedButtonProps &
  Readonly<{
    href?: never;
  }> &
  ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = ButtonLinkProps | NativeButtonProps;

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = ["button", `button--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href) {
    return (
      <Link className={classes} href={props.href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}
