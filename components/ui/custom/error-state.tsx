"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { RotateCwIcon, TriangleAlertIcon, type LucideIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

const errorStateVariants = cva(
  "flex size-full flex-col items-center justify-center gap-3 px-6 text-center",
  {
    variants: {
      variant: {
        centered: "min-h-screen",
        inline: "min-h-0 py-6",
      },
    },
    defaultVariants: {
      variant: "centered",
    },
  }
)

const errorStateMediaVariants = cva(
  "flex size-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/15 ring-inset",
  {
    variants: {
      size: {
        sm: "size-9 [&_svg]:size-4",
        default: "size-11 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type ErrorStateProps = Omit<ComponentProps<"div">, "title"> &
  VariantProps<typeof errorStateVariants> & {
    title?: string
    message?: ReactNode
    icon?: LucideIcon
    action?: ReactNode
    onRetry?: () => void
    retryLabel?: string
    isRetrying?: boolean
  }

export function ErrorState({
  className,
  variant = "centered",
  title = "Something went wrong",
  message,
  icon: Icon = TriangleAlertIcon,
  action,
  onRetry,
  retryLabel = "Try again",
  isRetrying = false,
  ...props
}: ErrorStateProps) {
  return (
    <div
      data-slot="error-state"
      role="alert"
      aria-live="polite"
      className={cn(errorStateVariants({ variant }), className)}
      {...props}
    >
      <span data-slot="error-state-icon" className={cn(errorStateMediaVariants())}>
        <Icon aria-hidden="true" />
      </span>

      <div data-slot="error-state-copy" className="flex max-w-sm flex-col gap-1.5">
        <p className="font-heading text-base font-semibold tracking-tight text-foreground">
          {title}
        </p>
        {message && <p className="text-sm/relaxed text-muted-foreground">{message}</p>}
      </div>

      {(onRetry || action) && (
        <div data-slot="error-state-actions" className="mt-1 flex items-center gap-2">
          {onRetry && (
            <Button type="button" variant="outline" disabled={isRetrying} onClick={onRetry}>
              {isRetrying ? <Spinner /> : <RotateCwIcon aria-hidden="true" />}
              {retryLabel}
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  )
}
