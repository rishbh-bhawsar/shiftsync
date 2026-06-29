import * as React from 'react';
import useTheme from '../../hooks/useTheme';

const Input = React.forwardRef(({ className = '', style = {}, ...props }, ref) => {
  const { colors } = useTheme();
  return (
    <input ref={ref} style={{ backgroundColor: colors.bgCard, borderColor: colors.border, color: colors.text, ...style }}
      className={`flex h-10 w-full rounded-lg border px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${className}`}
      {...props} />
  );
});
Input.displayName = 'Input';

export { Input };
