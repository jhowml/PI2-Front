import { cn } from "@/shared/lib/cn"
import type { LucideIcon } from "lucide-react"
import { HTMLAttributes } from "react"

export type FloatingActionButtonProps = {
  icon: LucideIcon
  label: string
  onClick?: () => void
} & HTMLAttributes<HTMLButtonElement>

export function FloatingActionButton({ icon: Icon, label, onClick, className, ...props }: FloatingActionButtonProps) {
  return (
    <button
      type="button"
      {...props}
      onClick={onClick}
      aria-label={label}
      className={cn(
        "fixed bottom-20 right-4 z-40 flex size-14 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95 md:bottom-6 md:right-6",
        className
      )}
    >
      <Icon className="size-6" aria-hidden="true" />
    </button>
  )
}
