'use client';

import { useEffect } from 'react';

type ThemeSettings = { primaryColor?: string; accentColor?: string; backgroundColor?: string; motion?: 'full' | 'soft' | 'off' };

export function ThemeRuntime() {
  useEffect(() => {
    function applyTheme() {
      const saved = window.localStorage.getItem('plant_shop_theme');
      const theme = saved ? JSON.parse(saved) as ThemeSettings : {};
      const root = document.documentElement;
      if (theme.primaryColor) root.style.setProperty('--primary', theme.primaryColor);
      if (theme.primaryColor) root.style.setProperty('--primary-strong', theme.primaryColor);
      if (theme.accentColor) root.style.setProperty('--accent', theme.accentColor);
      if (theme.backgroundColor) root.style.setProperty('--background', theme.backgroundColor);
      root.dataset.motion = theme.motion || 'full';
    }
    applyTheme();
    window.addEventListener('plant-shop-theme-updated', applyTheme);
    return () => window.removeEventListener('plant-shop-theme-updated', applyTheme);
  }, []);

  return null;
}
