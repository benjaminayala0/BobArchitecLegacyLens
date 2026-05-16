"use client"

import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
    return (
        <header className="border-b border-border bg-card">
            <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <svg
                                className="h-5 w-5 text-primary-foreground"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
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
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            A
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    )
}
