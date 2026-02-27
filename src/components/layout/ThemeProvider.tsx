"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/store/useUIStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useUIStore();
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
      root.style.backgroundColor = "#191022";
    } else {
      root.classList.remove("dark");
      root.style.backgroundColor = "#f7f6f8";
    }
  }, [theme, mounted]);

  return <>{children}</>;
}
