import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-heading tracking-wide rounded-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-card border border-primary/30",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-destructive/30",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-secondary/30",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Heritage variants - solid, grounded, archival
        heritage: "bg-primary text-primary-foreground border-2 border-ink/20 shadow-deep hover:shadow-elegant hover:bg-primary/95 uppercase tracking-[0.15em] font-display",
        parchment: "bg-parchment-dark text-foreground border-2 border-border hover:border-primary hover:bg-muted shadow-card",
        tyrian: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-deep uppercase tracking-[0.15em] font-display border-2 border-accent/30", // Use sparingly - prestige only
        gold: "bg-gold text-ink hover:bg-gold/90 shadow-deep border-2 border-gold/30",
        pepper: "bg-pepper-red text-parchment hover:bg-pepper-red/95 shadow-deep uppercase tracking-[0.15em] font-display border-2 border-ink/20",
        ink: "bg-ink text-parchment hover:bg-ink/90 shadow-deep uppercase tracking-[0.15em] font-display border-2 border-ink/20",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
