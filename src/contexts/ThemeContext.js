"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const themes = {
  light: "light",
  dark: "dark", 
  blue: "blue",
  orangeGold: "orange-gold"
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(themes.light);

  useEffect(() => {
    // Get theme from localStorage on component mount
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && Object.values(themes).includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    // Remove all theme classes
    Object.values(themes).forEach(t => {
      root.classList.remove(t);
    });
    
    // Add current theme class
    if (theme !== themes.light) {
      root.classList.add(theme);
    }
    
    // Save theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const themeValues = Object.values(themes);
    const currentIndex = themeValues.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeValues.length;
    setTheme(themeValues[nextIndex]);
  };

  const setThemeDirectly = (newTheme) => {
    if (Object.values(themes).includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme: setThemeDirectly, 
      toggleTheme,
      themes 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
