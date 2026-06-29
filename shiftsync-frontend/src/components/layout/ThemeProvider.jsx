import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((s) => s.ui);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    document.body.style.backgroundColor = theme === 'dark' ? '#0f172a' : '#ffffff';
    document.body.style.color = theme === 'dark' ? '#f8fafc' : '#0f172a';
  }, [theme]);

  return children;
};

export default ThemeProvider;
