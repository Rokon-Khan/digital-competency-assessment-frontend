import { setSystemTheme } from "@/redux/fetures/themeSlice";
// Import RootState from your store file (adjust the path as needed)
import type { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { theme, systemTheme } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    // Detect system theme preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      dispatch(setSystemTheme(e.matches ? "dark" : "light"));
    };

    // Set initial system theme
    dispatch(setSystemTheme(mediaQuery.matches ? "dark" : "light"));

    // Listen for changes
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [dispatch]);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    // Determine active theme
    let activeTheme: "light" | "dark";
    if (theme === "system") {
      activeTheme = systemTheme;
    } else {
      activeTheme = theme;
    }

    // Apply theme class
    root.classList.add(activeTheme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        activeTheme === "dark" ? "#1e1e1e" : "#ffffff"
      );
    }
  }, [theme, systemTheme]);

  return <>{children}</>;
};
