"use client"

import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
    return (
        <header className="border-b border-border bg-card">
            <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">BobArchitec<span className="text-primary font-semibold">LegacyLens</span></span>
                    </Link>

                    <nav className="flex items-center gap-6">
                        <Link
                            href="/docs"
                            className="text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                            Docs
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}
