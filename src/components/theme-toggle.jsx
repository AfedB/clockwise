"use client"

import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md bg-slate-200 dark:bg-slate-800"
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  )
}