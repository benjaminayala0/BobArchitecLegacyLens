"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Code2, Database, Layers, FileJson, FileCode2, Package, Sparkles, Workflow } from "lucide-react"

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container max-w-5xl mx-auto py-12 px-6">
                <div className="space-y-4 mb-16 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Documentation
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Learn how BobArchitecLegacyLens transforms your legacy spaghetti code into a clean, modern architecture in seconds.
                    </p>
                </div>

                <div className="grid gap-12">
                    {/* The Problem Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 border-b pb-4">
                            <Workflow className="h-6 w-6 text-destructive" />
                            <h2 className="text-3xl font-semibold tracking-tight text-foreground">The Problem</h2>
                        </div>
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                Legacy code costs enterprises <strong>billions of dollars</strong> annually. Entire development teams spend months reverse-engineering spaghetti codebases just to understand what the system does before they can even begin modernizing it.
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                {[
                                    "Expensive consulting firms charging $200-500/hour",
                                    "Manual code audits taking weeks or months",
                                    "Architecture meetings that drag on endlessly",
                                    "Documentation that's outdated before it's finished"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 bg-secondary/20 p-4 rounded-lg border border-border/50">
                                        <div className="h-2 w-2 rounded-full bg-destructive" />
                                        <span className="text-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* The Solution Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 border-b pb-4">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <h2 className="text-3xl font-semibold tracking-tight text-foreground">The Solution</h2>
                        </div>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            BobArchitecLegacyLens leverages <strong>IBM watsonx.ai (Granite 4H Small)</strong> to automate the most painful phase of modernization: the architectural analysis. Simply upload your code, and get a complete modernization blueprint instantly.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {[
                                { icon: Database, title: "ER Diagram", desc: "Interactive visual diagram of the detected database schema." },
                                { icon: Layers, title: "SQL Schema", desc: "Normalized PostgreSQL schema generated from implicit table structures." },
                                { icon: Code2, title: "Folder Scaffolding", desc: "Clean Architecture directory tree ready to be built upon." },
                                { icon: FileCode2, title: "Legacy Code Inspector", desc: "Clean, syntax-highlighted viewer for the uploaded legacy source." },
                                { icon: Package, title: "Export ZIP", desc: "One-click download of the complete modernized project scaffold." },
                                { icon: FileJson, title: "API Contract", desc: "Auto-generated REST endpoint definitions based on business logic." },
                            ].map((feature, i) => (
                                <Card key={i} className="bg-card border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-2">
                                        <feature.icon className="h-6 w-6 text-primary mb-2" />
                                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* How It Works Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 border-b pb-4">
                            <Workflow className="h-6 w-6 text-chart-2" />
                            <h2 className="text-3xl font-semibold tracking-tight text-foreground">How It Works</h2>
                        </div>

                        <div className="relative pt-8 pb-12">
                            <div className="absolute top-0 bottom-0 left-[27px] w-0.5 bg-border" />
                            
                            {[
                                { step: "1", title: "Upload", desc: "Upload your legacy file, ZIP archive, or paste code directly into the dashboard." },
                                { step: "2", title: "Analyze", desc: "IBM watsonx.ai reads the full context, extracts business entities, relationships, and implicit schemas." },
                                { step: "3", title: "Visualize", desc: "The dashboard renders interactive ER diagrams, folder trees, and API contracts." },
                                { step: "4", title: "Export", desc: "Download the complete modernized scaffold as a .zip file with real, working code." },
                            ].map((step, i) => (
                                <div key={i} className="relative flex items-start gap-6 mb-10 last:mb-0">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground font-bold shadow-sm z-10">
                                        {step.step}
                                    </div>
                                    <div className="pt-3">
                                        <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                                        <p className="text-muted-foreground text-lg leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}
