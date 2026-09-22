"use client"

import { cloneElement, isValidElement, useId } from "react"

type FieldControlProps = {
    id?: string
    "aria-invalid"?: boolean
    "aria-describedby"?: string
    "aria-required"?: boolean
}

export interface FormFieldProps {
    label: string
    error?: string
    hint?: string
    required?: boolean
    hideLabel?: boolean
    children: React.ReactElement<FieldControlProps>
}

export function FormField({ label, error, hint, required, hideLabel, children }: FormFieldProps) {
    const generatedId = useId()
    const id = children.props.id ?? generatedId
    const hintId = `${id}-hint`
    const errorId = `${id}-error`
    const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined

    const control = isValidElement(children)
        ? cloneElement(children, {
            id,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": describedBy,
            "aria-required": required || undefined,
        })
        : children

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className={hideLabel ? "sr-only" : "text-sm font-medium leading-none"}>
                {label}
                {required && <span aria-hidden="true" className="text-primary"> *</span>}
            </label>
            {control}
            {hint && !error && (
                <span id={hintId} className="text-xs text-muted-foreground">{hint}</span>
            )}
            {error && (
                <span id={errorId} role="alert" className="text-xs font-medium text-destructive">{error}</span>
            )}
        </div>
    )
}
