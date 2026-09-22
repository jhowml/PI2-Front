import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";

type ButtonBase = Omit<ComponentProps<"button">, "children"> & {
  iconClassName?: string;
};

export type ButtonProps = ButtonBase &
  (
    | { variant?: "default"; label: string; icon?: LucideIcon }
    | { variant: "icon"; label: string; icon: LucideIcon }
  );

export function Button({
  label,
  icon: Icon,
  iconClassName,
  className,
  type = "button",
  variant = "default",
  ...props
}: ButtonProps) {
  const isIcon = variant === "icon";
  const iconClasses = ["size-4 shrink-0", iconClassName].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      className={
        isIcon
          ? `group inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[calc(var(--radius)-2px)] border-0 bg-transparent p-0 [-webkit-tap-highlight-color:transparent] font-inherit text-sm font-medium leading-tight text-inherit transition-colors duration-150 ease-in-out hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50${className ? ` ${className}` : ""}`
          : `inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50${className ? ` ${className}` : ""}`
      }
      {...props}
    >
      {isIcon ? (
        <>
          <span className="sr-only">{label}</span>
          {Icon != null ? (
            <Icon className={iconClasses} aria-hidden />
          ) : null}
        </>
      ) : (
        <>
          {Icon != null ? (
            <Icon className={iconClasses} aria-hidden />
          ) : null}
          {label}
        </>
      )}
    </button>
  );
}
