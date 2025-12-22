import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-display tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant rounded-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-sm",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground rounded-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-sm",
        ghost: "hover:bg-muted hover:text-foreground rounded-sm",
        link: "text-primary underline-offset-4 hover:underline",
        // Heritage variants
        heritage: "bg-primary text-primary-foreground border border-primary/20 shadow-elegant hover:shadow-deep hover:bg-primary/90 uppercase tracking-widest rounded-sm",
        parchment: "bg-card text-card-foreground border-2 border-border hover:border-primary hover:bg-muted rounded-sm",
        tyrian: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-elegant uppercase tracking-widest rounded-sm",
        gold: "bg-gold text-foreground hover:bg-gold/90 shadow-elegant rounded-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
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
