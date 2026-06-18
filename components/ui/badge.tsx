import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border font-mono text-[0.58rem] tracking-widest uppercase font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grv-aqua",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-grv-aqua text-grv-hard",
        secondary:
          "border-transparent bg-grv-soft text-grv-fg2",
        destructive:
          "border-transparent bg-red-900/30 text-red-400",
        outline:
          "border-grv-b text-grv-fg4 hover:border-grv-aqua hover:text-grv-aqua",
        aqua:
          "border-grv-aqua text-grv-aqua",
        ghost:
          "border-transparent text-grv-fg3 hover:text-grv-fg",
      },
      size: {
        default: "h-5 px-2 py-0.5",
        sm:      "h-4 px-1.5 py-0",
        lg:      "h-6 px-2.5 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  render?: React.ReactElement
}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
