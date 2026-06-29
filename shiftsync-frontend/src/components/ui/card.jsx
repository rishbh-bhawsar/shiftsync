import * as React from 'react';
import useTheme from '../../hooks/useTheme';

const Card = React.forwardRef(({ className = '', style = {}, ...props }, ref) => {
  const { colors } = useTheme();
  return (
    <div ref={ref} style={{ backgroundColor: colors.bgCard, borderColor: colors.border, color: colors.text, ...style }}
      className={`rounded-xl border shadow-sm transition-colors ${className}`} {...props} />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className = '', style = {}, ...props }, ref) => {
  const { colors } = useTheme();
  return <h3 ref={ref} style={{ color: colors.text, ...style }} className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />;
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className = '', style = {}, ...props }, ref) => {
  const { colors } = useTheme();
  return <p ref={ref} style={{ color: colors.textSecondary, ...style }} className={`text-sm ${className}`} {...props} />;
});
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className = '', ...props }, ref) => (
  <div ref={ref} className={`flex items-center p-6 pt-0 ${className}`} {...props} />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
