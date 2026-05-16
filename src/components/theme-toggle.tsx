"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Monitor, Moon, Sun } from "lucide-react"

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setMounted(true)
    }, [])

    const cycleTheme = () => {
        switch (theme) {
            case "light":
                setTheme("dark")
                break
            case "dark":
                setTheme("system")
                break
            default:
                setTheme("light")
        }
    }

    if (!mounted) {
        return <Button variant="outline" size="icon" className={cn("rounded-full h-10 w-10", className)} disabled />
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={cycleTheme}
            className={cn("rounded-full border-sidebar-border bg-transparent h-10 w-10", className)}
        >
            <Sun className={cn("h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-200", {
                "-rotate-90 scale-0": theme === "dark" || theme === "system",
            })} />

            <Moon className={cn("absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-200", {
                "rotate-0 scale-100": theme === "dark",
            })} />
            
            <Monitor className={cn("absolute h-[1.2rem] w-[1.2rem] scale-0 transition-all duration-200", {
                "scale-100": theme === "system",
            })} />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}