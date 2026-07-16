import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type CardProps<TElement extends ElementType> = Readonly<{
  as?: TElement;
  children: ReactNode;
  className?: string;
}> &
  Omit<ComponentPropsWithoutRef<TElement>, "as" | "children" | "className">;

export function Card<TElement extends ElementType = "article">({
  as,
  children,
  className,
  ...props
}: CardProps<TElement>) {
  const Element = as ?? "article";
  const classes = ["card", className].filter(Boolean).join(" ");

  return (
    <Element className={classes} {...props}>
      {children}
    </Element>
  );
}
