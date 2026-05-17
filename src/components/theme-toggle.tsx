"use client"

import { useTheme } from "@/components/theme-provider"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const cycleTheme = () => {
        switch (theme) {
            case "light":
                setTheme("dark")
                break
            case "dark":
                setTheme("light")
                break
            default:
                setTheme("light")
        }
    }

    if (!mounted) {
        return <Button variant="outline" size="icon" className={cn("rounded-full h-10 w-10", className)} disabled />
    }

    // Determine the actual theme being displayed (resolve "system" to actual theme)
    const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={cycleTheme}
            className={cn("rounded-full border-sidebar-border bg-transparent h-10 w-10", className)}
        >
            <Sun className={cn("h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-200", {
                "-rotate-90 scale-0": isDark,
            })} />

            <Moon className={cn("absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-200", {
                "rotate-0 scale-100": isDark,
            })} />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}