import type { ReactNode } from "react";

export type CardListProps<T> = {
  items: readonly T[];
  getKey: (item: T) => React.Key;
  renderItem: (item: T) => ReactNode;
  empty: ReactNode;
  className?: string;
};

export function CardList<T>({
  items,
  getKey,
  renderItem,
  empty,
  className,
}: CardListProps<T>) {
  const shell = `w-full overflow-hidden rounded-lg border border-border bg-card${className ? ` ${className}` : ""}`;

  if (items.length === 0) {
    return (
      <div className={shell}>
        <div className="flex min-h-30 w-full items-center justify-center px-6 py-10">
          {empty}
        </div>
      </div>
    );
  }

  return (
    <div className={`${shell} divide-y divide-border`}>
      {items.map((item) => (
        <div key={getKey(item)}>{renderItem(item)}</div>
      ))}
    </div>
  );
}
