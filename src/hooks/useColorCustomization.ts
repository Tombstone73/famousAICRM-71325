import { useState, useEffect } from 'react';

interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
  destructive: string;
}

const defaultColors: CustomColors = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  accent: '#8b5cf6',
  destructive: '#ef4444'
};

const useColorCustomization = () => {
  const [colors, setColors] = useState<CustomColors>(defaultColors);

  // Load colors from localStorage on mount
  useEffect(() => {
    const savedColors = localStorage.getItem('customColors');
    if (savedColors) {
      try {
        setColors(JSON.parse(savedColors));
      } catch (error) {
        console.error('Failed to parse saved colors:', error);
      }
    }
  }, []);

  // Apply colors to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    
    // Convert hex to HSL for CSS variables
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    root.style.setProperty('--primary', hexToHsl(colors.primary));
    root.style.setProperty('--secondary', hexToHsl(colors.secondary));
    root.style.setProperty('--accent', hexToHsl(colors.accent));
    root.style.setProperty('--destructive', hexToHsl(colors.destructive));
  }, [colors]);

  const updateColors = (newColors: Partial<CustomColors>) => {
    const updatedColors = { ...colors, ...newColors };
    setColors(updatedColors);
    localStorage.setItem('customColors', JSON.stringify(updatedColors));
  };

  const resetColors = () => {
    setColors(defaultColors);
    localStorage.removeItem('customColors');
  };

  return {
    colors,
    updateColors,
    resetColors
  };
};

export default useColorCustomization;