import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-colors duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-grv-aqua focus-visible:ring-offset-1 focus-visible:ring-offset-grv-hard disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-grv-aqua text-grv-hard hover:bg-grv-aqua2 active:translate-y-px",
        outline:
          "border border-grv-b bg-transparent text-grv-fg2 hover:border-grv-aqua hover:text-grv-fg active:translate-y-px",
        secondary:
          "bg-grv-soft text-grv-fg hover:bg-grv-hover active:translate-y-px",
        ghost:
          "bg-transparent text-grv-fg3 hover:bg-grv-soft hover:text-grv-fg",
        destructive:
          "bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-800",
        link:
          "text-grv-aqua underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-9 px-5 text-xs font-mono tracking-[0.1em] uppercase gap-2",
        sm:      "h-7 px-3 text-[0.65rem] font-mono tracking-widest uppercase gap-1.5",
        lg:      "h-11 px-7 text-xs font-mono tracking-[0.12em] uppercase gap-2",
        icon:    "size-9",
        "icon-sm": "size-7",
        "icon-lg": "size-11",
        "icon-xs": "size-6",
        xs:      "h-6 px-2.5 text-[0.6rem] font-mono tracking-widest uppercase gap-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {}

function Button({ className, variant, size, render, nativeButton, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      nativeButton={nativeButton ?? render == null}
      render={render}
      {...props}
    />
  )
}

export { Button, buttonVariants }
