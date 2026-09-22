import type { ReactNode } from "react";
import { FloatingActionButton } from "./floating-action-button";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";

export type ListPageLayoutProps = {
  title: string;
  description: string;
  headerAction?: {
    icon: LucideIcon,
    onClick: () => void,
    label: string
  };
  children: ReactNode;
};

export function ListPageLayout({
  title,
  description,
  headerAction,
  children,
}: ListPageLayoutProps) {
  return (
    <div className="flex flex-col gap-4 bg-background p-4 md:p-8">
      <div className="flex w-full">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-2 max-w-prose text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        {headerAction != null ? (
          <>
            <FloatingActionButton className="md:hidden" icon={headerAction.icon} label={headerAction.label} onClick={headerAction.onClick} />
            <div className="hidden md:flex flex-1 justify-end py-2">{<Button label={headerAction.label} icon={headerAction.icon} onClick={headerAction.onClick} />}</div>
          </>
        ) : null}
      </div>
      {children}
    </div>
  );
}
