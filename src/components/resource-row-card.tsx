import type { ReactNode } from "react";

export type ResourceRowCardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function ResourceRowCard({
  title,
  subtitle,
  description,
  actions,
  className,
}: ResourceRowCardProps) {
  return (
    <div
      className={`flex w-full gap-4 bg-card px-6 py-4${className ? ` ${className}` : ""}`}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-lg font-medium text-foreground">{title}</span>
        {subtitle != null && subtitle !== "" ? (
          <span className="text-sm text-muted-foreground">{subtitle}</span>
        ) : null}
        {description != null && description !== "" ? (
          <span className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {description}
          </span>
        ) : null}
      </div>
      {actions != null ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
