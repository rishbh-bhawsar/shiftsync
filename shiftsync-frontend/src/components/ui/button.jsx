import * as React from 'react';
import { cva } from 'class-variance-authority';
import useTheme from '../../hooks/useTheme';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-md',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'border bg-transparent hover:opacity-80',
        secondary: 'hover:opacity-80',
        ghost: 'hover:opacity-80',
        link: 'text-blue-500 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, style = {}, ...props }, ref) => {
  const { colors } = useTheme();
  const Comp = asChild ? 'button' : 'button';

  const variantStyles = {
    outline: { borderColor: colors.border, color: colors.text },
    secondary: { backgroundColor: colors.bgSecondary, color: colors.text },
    ghost: { color: colors.textSecondary },
  };

  return (
    <Comp ref={ref} style={{ ...variantStyles[variant], ...style }}
      className={buttonVariants({ variant, size, className })} {...props} />
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
