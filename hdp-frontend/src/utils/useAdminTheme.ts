import { useCallback, useEffect, useState } from 'react';

export type AdminTheme = 'dark' | 'light';

const STORAGE_KEY = 'adminTheme';

const readStoredTheme = (): AdminTheme => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

export const useAdminTheme = () => {
  const [theme, setTheme] = useState<AdminTheme>(readStoredTheme);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this session.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme, themeClass: theme === 'light' ? 'admin-light' : '' };
};
