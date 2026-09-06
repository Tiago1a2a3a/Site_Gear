import Link from "next/link";

export type BreadcrumbItem = Readonly<{
  href?: string;
  label: string;
}>;

export function Breadcrumbs({
  items,
}: Readonly<{ items: readonly BreadcrumbItem[] }>) {
  if (!items.length) return null;
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
              {index > 0 ? (
                <span aria-hidden="true" className="breadcrumbs__separator">
                  /
                </span>
              ) : null}
              {!isCurrent && item.href ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
