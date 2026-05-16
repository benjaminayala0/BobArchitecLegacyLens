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
    isAnalyzing?: boolean
    onComplete?: () => void
}

const initialSteps: AnalysisStep[] = [
    { id: "parse", label: "Parsing source files...", status: "pending" },
    { id: "detect", label: "Detecting Java patterns", status: "pending" },
    { id: "sql", label: "Mapping SQL dependencies", status: "pending" },
    { id: "business", label: "Extracting business logic", status: "pending" },
    { id: "generate", label: "Generating modern architecture", status: "pending" },
]

export function AnalysisPanel({ isAnalyzing = true, onComplete }: AnalysisPanelProps) {
    const [steps, setSteps] = useState<AnalysisStep[]>(initialSteps)
    const [progress, setProgress] = useState(0)
    const [currentLine, setCurrentLine] = useState(1)
    const [scanningText, setScanningText] = useState("Initializing...")

    const scanningLines = [
        "Reading LegacyOrderService.java...",
        "Found: public void processOrder()",
        "Detected: JDBC connection pattern",
        "Mapping: SELECT * FROM orders",
        "Found: Legacy DAO implementation",
        "Analyzing: CustomerRepository.java",
        "Detected: Singleton pattern",
        "Mapping: JOIN customers ON...",
        "Found: Business rule validation",
        "Generating: Clean Architecture layers",
    ]

    useEffect(() => {
        if (!isAnalyzing) return

        const textInterval = setInterval(() => {
            setCurrentLine((prev) => (prev + 1) % scanningLines.length)
            setScanningText(scanningLines[currentLine])
        }, 800)

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    onComplete?.()
                    return 100
                }
                return prev + 2
            })
        }, 150)

        const stepInterval = setInterval(() => {
            setSteps((prevSteps) => {
                const runningIndex = prevSteps.findIndex((s) => s.status === "running")
                const pendingIndex = prevSteps.findIndex((s) => s.status === "pending")

                if (runningIndex === -1 && pendingIndex !== -1) {
                    return prevSteps.map((s, i) =>
                        i === pendingIndex ? { ...s, status: "running" as const } : s
                    )
                } else if (runningIndex !== -1) {
                    return prevSteps.map((s, i) => {
                        if (i === runningIndex) return { ...s, status: "completed" as const }
                        if (i === runningIndex + 1 && s.status === "pending")
                            return { ...s, status: "running" as const }
                        return s
                    })
                }
                return prevSteps
            })
        }, 1500)

        return () => {
            clearInterval(textInterval)
            clearInterval(progressInterval)
            clearInterval(stepInterval)
        }
    }, [isAnalyzing, currentLine, onComplete])

    const completedSteps = steps.filter((s) => s.status === "completed").length
    const estimatedTime = Math.max(0, Math.ceil((steps.length - completedSteps) * 0.5))

    return (
        <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-3 text-foreground">
                    <div className="relative flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                        <div className="absolute h-3 w-3 rounded-full bg-primary animate-ping" />
                    </div>

                    IBM Bob Analyzing...
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
                            Estimated completion: {estimatedTime > 0 ? `${estimatedTime} minutes` : "Almost done..."}
                        </span>

                        <span className="text-primary font-medium">{Math.round(progress)}%</span>
                    </div>

                    <Progress value={progress} className="h-2" />
                </div>
            </CardContent>
        </Card>
    )
}
