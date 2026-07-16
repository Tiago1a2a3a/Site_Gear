import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type ContainerProps<TElement extends ElementType> = Readonly<{
  as?: TElement;
  children: ReactNode;
  className?: string;
}> &
  Omit<ComponentPropsWithoutRef<TElement>, "as" | "children" | "className">;

export function Container<TElement extends ElementType = "div">({
  as,
  children,
  className,
  ...props
}: ContainerProps<TElement>) {
  const Element = as ?? "div";
  const classes = ["container", className].filter(Boolean).join(" ");

  return (
    <Element className={classes} {...props}>
      {children}
    </Element>
  );
}
