"use client"

import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
    return (
        <header className="border-b border-border bg-card">
            <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">

                        <div className="flex h-13 w-13 items-center justify-center">
                            <Image
                                src='/images/bob3.png'
                                alt="bob"
                                className="h-13 w-13 rounded-full "
                                width={24}
                                height={24}
                            />
                        </div>

                        <span className="text-lg font-semibold text-foreground">Bob Architec Legacy Lens</span>
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
