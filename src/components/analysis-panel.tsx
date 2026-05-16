"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"

interface AnalysisStep {
    id: string
    label: string
    status: "pending" | "running" | "completed"
}

interface AnalysisPanelProps {
    isAnalyzing: boolean
}

const initialSteps: AnalysisStep[] = [
    { id: "parse", label: "Parsing source files...", status: "pending" },
    { id: "detect", label: "Detecting patterns and structures", status: "pending" },
    { id: "sql", label: "Mapping data dependencies", status: "pending" },
    { id: "business", label: "Extracting business logic", status: "pending" },
    { id: "generate", label: "Generating modern architecture", status: "pending" },
]

export function AnalysisPanel({ isAnalyzing }: AnalysisPanelProps) {
    const [steps, setSteps] = useState<AnalysisStep[]>(initialSteps)
    const [currentLine, setCurrentLine] = useState(0)
    const [scanningText, setScanningText] = useState("Initializing...")

    const scanningLines = [
        "Reading legacy code structure...",
        "Analyzing code patterns...",
        "Detecting database operations...",
        "Mapping entity relationships...",
        "Identifying business rules...",
        "Extracting API endpoints...",
        "Analyzing dependencies...",
        "Generating entity models...",
        "Creating folder structure...",
        "Finalizing blueprint...",
    ]

    useEffect(() => {
        if (!isAnalyzing) {
            // Reset state when not analyzing
            setSteps(initialSteps)
            setCurrentLine(0)
            setScanningText("Initializing...")
            return
        }

        // Animate scanning text
        const textInterval = setInterval(() => {
            setCurrentLine((prev) => {
                const next = (prev + 1) % scanningLines.length
                setScanningText(scanningLines[next])
                return next
            })
        }, 1200)

        // Animate steps progression
        const stepInterval = setInterval(() => {
            setSteps((prevSteps) => {
                const runningIndex = prevSteps.findIndex((s) => s.status === "running")
                const pendingIndex = prevSteps.findIndex((s) => s.status === "pending")

                if (runningIndex === -1 && pendingIndex !== -1) {
                    // Start first pending step
                    return prevSteps.map((s, i) =>
                        i === pendingIndex ? { ...s, status: "running" as const } : s
                    )
                } else if (runningIndex !== -1 && runningIndex < prevSteps.length - 1) {
                    // Complete current and start next
                    return prevSteps.map((s, i) => {
                        if (i === runningIndex) return { ...s, status: "completed" as const }
                        if (i === runningIndex + 1 && s.status === "pending")
                            return { ...s, status: "running" as const }
                        return s
                    })
                }
                return prevSteps
            })
        }, 2000)

        return () => {
            clearInterval(textInterval)
            clearInterval(stepInterval)
        }
    }, [isAnalyzing])

    const completedSteps = steps.filter((s) => s.status === "completed").length
    const progressPercentage = Math.round((completedSteps / steps.length) * 100)

    return (
        <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-3 text-foreground">
                    <div className="relative flex items-center justify-center">
                        {completedSteps === steps.length ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                            <>
                                <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                                <div className="absolute h-3 w-3 rounded-full bg-primary animate-ping" />
                            </>
                        )}
                    </div>

                    {completedSteps === steps.length ? "✅ Analysis Complete!" : "IBM Bob Analyzing..."}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Code scanning visualization */}
                <div className="bg-secondary/50 rounded-lg p-4 font-mono text-xs overflow-hidden">
                    <div className="flex gap-4">
                        {/* Line numbers */}
                        <div className="flex flex-col text-muted-foreground/50 select-none">
                            {Array.from({ length: 12 }, (_, i) => (
                                <span
                                    key={i}
                                    className={`leading-5 transition-colors ${i === currentLine % 12 ? "text-primary" : ""
                                        }`}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                            ))}
                        </div>

                        <div className="flex-1 relative">
                            {/* Scan line effect */}
                            <div
                                className="absolute left-0 right-0 h-5 bg-primary/10 border-l-2 border-primary transition-all duration-300"
                                style={{ top: `${(currentLine % 12) * 20}px` }}
                            />

                            <div className="relative space-y-0">
                                {Array.from({ length: 12 }, (_, i) => (
                                    <div
                                        key={i}
                                        className={`leading-5 transition-all duration-300 ${i === currentLine % 12
                                            ? "text-primary"
                                            : i < currentLine % 12
                                                ? "text-muted-foreground"
                                                : "text-muted-foreground/30"
                                            }`}
                                    >
                                        {i === currentLine % 12 ? scanningText : "..."}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Analysis steps */}
                <div className="space-y-2">
                    {steps.map((step) => (
                        <div key={step.id} className="flex items-center gap-3">
                            {step.status === "completed" ? (
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                            ) : step.status === "running" ? (
                                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                            ) : (
                                <Circle className="h-4 w-4 text-muted-foreground/30" />
                            )}

                            <span
                                className={`text-sm transition-colors ${step.status === "completed"
                                    ? "text-foreground"
                                    : step.status === "running"
                                        ? "text-primary"
                                        : "text-muted-foreground/50"
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Progress */}
                <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            {isAnalyzing ? "Analyzing with DeepSeek AI..." : "Analysis complete"}
                        </span>

                        <span className="text-primary font-medium">{progressPercentage}%</span>
                    </div>

                    <Progress value={progressPercentage} className="h-2" />
                </div>
            </CardContent>
        </Card>
    )
}
