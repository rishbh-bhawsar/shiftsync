import * as React from 'react';
import useTheme from '../../hooks/useTheme';

const Badge = React.forwardRef(({ className = '', variant = 'default', style = {}, ...props }, ref) => {
  const { colors, isDark } = useTheme();

  const variants = {
    default: { backgroundColor: '#3b82f6', color: '#ffffff' },
    secondary: { backgroundColor: colors.bgSecondary, color: colors.text },
    destructive: { backgroundColor: '#ef4444', color: '#ffffff' },
    outline: { color: colors.text, borderColor: colors.border },
    success: { backgroundColor: isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.1)', color: isDark ? '#34d399' : '#059669' },
    warning: { backgroundColor: isDark ? 'rgba(245,158,11,0.2)' : 'rgba(245,158,11,0.1)', color: isDark ? '#fbbf24' : '#d97706' },
    info: { backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)', color: isDark ? '#60a5fa' : '#2563eb' },
  };

  return (
    <div ref={ref} style={{ ...variants[variant], ...style }}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`} {...props} />
  );
});
Badge.displayName = 'Badge';

export { Badge };
