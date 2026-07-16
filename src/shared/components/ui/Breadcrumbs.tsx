import Link from "next/link";

export type BreadcrumbItem = Readonly<{
  href?: string;
  label: string;
}>;

export function Breadcrumbs({
  items,
}: Readonly<{ items: readonly BreadcrumbItem[] }>) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li
              aria-current={isCurrent ? "page" : undefined}
              key={`${item.label}-${index}`}
            >
              {!isCurrent && item.href ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                item.label
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
