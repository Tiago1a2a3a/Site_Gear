import type { ReactNode } from "react";

type BadgeProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function Badge({ children, className }: BadgeProps) {
  const classes = ["badge", className].filter(Boolean).join(" ");

  return <span className={classes}>{children}</span>;
}
