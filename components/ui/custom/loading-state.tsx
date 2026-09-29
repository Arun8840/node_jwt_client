import { cn } from "cn"
import { Spinner } from "../spinner"


interface LoadingStateProps {
 label?: string
 className?: string
}

export function LoadingState({ label, className }: LoadingStateProps) {
 return (
  <div
   className={cn(
    "w-full min-h-screen flex flex-col items-center justify-center gap-2",
    className,
   )}
  >
   <Spinner />
   {label && (
    <p className="text-xs text-muted-foreground">{label}</p>
   )}
  </div>
 )
}
