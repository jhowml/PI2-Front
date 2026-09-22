import { forwardRef } from "react"
import { cn } from "@/shared/lib/cn"

export const FIELD_CLASS =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-destructive md:text-sm"

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    function Input({ className, ...props }, ref) {
        return <input ref={ref} {...props} className={cn(FIELD_CLASS, className)} />
    },
)

export const TextArea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    function TextArea({ className, ...props }, ref) {
        return <textarea ref={ref} {...props} className={cn(FIELD_CLASS, "h-auto min-h-20 resize-none", className)} />
    },
)

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
    function Select({ className, ...props }, ref) {
        return <select ref={ref} {...props} className={cn(FIELD_CLASS, className)} />
    },
)
