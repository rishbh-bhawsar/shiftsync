import { useSelector } from 'react-redux';

const useTheme = () => {
  const { theme } = useSelector((s) => s.ui);
  const isDark = theme === 'dark';

  const colors = {
    bg: isDark ? '#0f172a' : '#ffffff',
    bgSecondary: isDark ? '#1e293b' : '#f8fafc',
    bgCard: isDark ? '#1e293b' : '#ffffff',
    bgHover: isDark ? '#334155' : '#f1f5f9',
    text: isDark ? '#f8fafc' : '#0f172a',
    textSecondary: isDark ? '#94a3b8' : '#64748b',
    textMuted: isDark ? '#64748b' : '#94a3b8',
    border: isDark ? '#334155' : '#e2e8f0',
    borderHover: isDark ? '#475569' : '#cbd5e1',
  };

  return { theme, isDark, colors };
};

export default useTheme;
