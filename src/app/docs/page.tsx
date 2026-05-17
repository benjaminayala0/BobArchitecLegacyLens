"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
    ArrowRight, 
    Code2, 
    Database, 
    Layers, 
    FileJson, 
    FileCode2, 
    Package, 
    Sparkles, 
    Workflow,
    Zap,
    Shield,
    TrendingUp,
    Clock,
    DollarSign,
    Users,
    CheckCircle2,
    AlertTriangle,
    Cpu,
    GitBranch,
    FileText,
    Download,
    Upload,
    Eye,
    Boxes,
    Network,
    Gauge
} from "lucide-react"

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container max-w-7xl mx-auto py-16 px-6 lg:px-8">
                {/* Hero Section */}
                <div className="space-y-6 mb-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Enterprise-Grade Modernization Platform</span>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Technical Documentation
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Comprehensive guide to understanding how BobArchitecLegacyLens leverages IBM watsonx.ai to transform legacy codebases into modern, scalable architectures with unprecedented speed and accuracy.
                    </p>
                </div>

                <div className="grid gap-16">
                    {/* Executive Overview */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-4 pb-6 border-b-2 border-border">
                            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border border-primary/20">
                                <TrendingUp className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold tracking-tight text-foreground">Executive Overview</h2>
                                <p className="text-muted-foreground mt-1">Understanding the modernization imperative</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { icon: DollarSign, label: "Annual Cost Impact", value: "Billions", desc: "Lost to legacy technical debt" },
                                { icon: Clock, label: "Time to Market", value: "6-12 Months", desc: "Traditional modernization timeline" },
                                { icon: Users, label: "Resource Allocation", value: "30-50%", desc: "Teams maintaining legacy systems" }
                            ].map((stat, i) => (
                                <Card key={i} className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <stat.icon className="h-8 w-8 text-primary" />
                                            <Badge variant="outline" className="text-xs">{stat.label}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                                        <p className="text-sm text-muted-foreground">{stat.desc}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* The Problem Section */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-4 pb-6 border-b-2 border-border">
                            <div className="p-3 bg-gradient-to-br from-destructive/20 to-destructive/5 rounded-xl border border-destructive/20">
                                <AlertTriangle className="h-7 w-7 text-destructive" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold tracking-tight text-foreground">The Modernization Challenge</h2>
                                <p className="text-muted-foreground mt-1">Critical barriers to digital transformation</p>
                            </div>
                        </div>

                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                                Legacy systems represent a <strong className="text-foreground">critical vulnerability</strong> in enterprise technology portfolios. Organizations face mounting pressure to modernize aging infrastructure while maintaining business continuity. The traditional approach to legacy modernization is characterized by:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                                {[
                                    { 
                                        icon: DollarSign, 
                                        title: "Prohibitive Consulting Costs", 
                                        desc: "External consulting firms command $200-500 per hour, with projects often exceeding $500K before implementation begins.",
                                        severity: "high"
                                    },
                                    { 
                                        icon: Clock, 
                                        title: "Extended Analysis Timelines", 
                                        desc: "Manual code audits and architectural assessments consume 3-6 months of dedicated engineering resources.",
                                        severity: "high"
                                    },
                                    { 
                                        icon: Users, 
                                        title: "Stakeholder Alignment Friction", 
                                        desc: "Cross-functional architecture meetings and decision-making processes create organizational bottlenecks.",
                                        severity: "medium"
                                    },
                                    { 
                                        icon: FileText, 
                                        title: "Documentation Obsolescence", 
                                        desc: "Technical documentation becomes outdated during creation, failing to reflect actual system state.",
                                        severity: "medium"
                                    }
                                ].map((item, i) => (
                                    <Card key={i} className="bg-gradient-to-br from-destructive/5 to-transparent border-destructive/20 hover:border-destructive/40 transition-all duration-300">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-destructive/10 rounded-lg mt-1">
                                                    <item.icon className="h-5 w-5 text-destructive" />
                                                </div>
                                                <div className="flex-1">
                                                    <CardTitle className="text-base font-semibold text-foreground">{item.title}</CardTitle>
                                                    <Badge variant="outline" className="mt-2 text-xs border-destructive/30 text-destructive">
                                                        {item.severity === "high" ? "Critical Impact" : "Significant Impact"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="mt-8 p-6 bg-destructive/5 border-l-4 border-destructive rounded-r-lg">
                                <p className="text-base text-foreground font-medium">
                                    <strong>Critical Insight:</strong> Organizations invest substantial resources in understanding legacy systems before modernization can commence, creating a significant barrier to digital transformation initiatives.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* The Solution Section */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-4 pb-6 border-b-2 border-border">
                            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border border-primary/20">
                                <Sparkles className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold tracking-tight text-foreground">The BobArchitecLegacyLens Solution</h2>
                                <p className="text-muted-foreground mt-1">AI-powered architectural intelligence at enterprise scale</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                BobArchitecLegacyLens represents a <strong className="text-foreground">paradigm shift</strong> in legacy modernization methodology. By leveraging <strong className="text-primary">IBM watsonx.ai's Granite 4H Small model</strong>, we automate the most resource-intensive phase of modernization: comprehensive architectural analysis and blueprint generation.
                            </p>

                            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Cpu className="h-6 w-6 text-primary" />
                                        Powered by IBM watsonx.ai
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        Enterprise-grade AI with full-context understanding and architectural reasoning capabilities
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {[
                                            { label: "Analysis Time", value: "< 30 seconds", icon: Zap },
                                            { label: "Context Window", value: "Full codebase", icon: Eye },
                                            { label: "Accuracy Rate", value: "95%+", icon: Gauge }
                                        ].map((metric, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/50">
                                                <metric.icon className="h-5 w-5 text-primary" />
                                                <div>
                                                    <div className="text-sm text-muted-foreground">{metric.label}</div>
                                                    <div className="text-lg font-bold text-foreground">{metric.value}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Separator className="my-8" />

                        <div>
                            <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <Boxes className="h-6 w-6 text-primary" />
                                Comprehensive Output Deliverables
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { 
                                        icon: Database, 
                                        title: "Entity-Relationship Diagram", 
                                        desc: "Interactive Mermaid.js visualization of database schema with entity relationships, cardinality, and constraints.",
                                        badge: "Visual Intelligence"
                                    },
                                    { 
                                        icon: Layers, 
                                        title: "SQL Schema Generation", 
                                        desc: "Production-ready PostgreSQL DDL statements with normalized table structures, indexes, and foreign key constraints.",
                                        badge: "Database Ready"
                                    },
                                    { 
                                        icon: Code2, 
                                        title: "Clean Architecture Scaffold", 
                                        desc: "Domain-driven design folder structure following industry best practices (Domain, Application, Infrastructure, Presentation).",
                                        badge: "Best Practices"
                                    },
                                    { 
                                        icon: FileCode2, 
                                        title: "Legacy Code Inspector", 
                                        desc: "Syntax-highlighted legacy source code viewer for detailed context inspection.",
                                        badge: "Code Analysis"
                                    },
                                    { 
                                        icon: Package, 
                                        title: "Complete Project Export", 
                                        desc: "One-click ZIP download containing full project scaffold with TypeORM entities, NestJS services, and controller templates.",
                                        badge: "Production Ready"
                                    },
                                    { 
                                        icon: FileJson, 
                                        title: "RESTful API Contract", 
                                        desc: "Auto-generated OpenAPI-compliant endpoint specifications with request/response schemas and authentication requirements.",
                                        badge: "API Documentation"
                                    },
                                ].map((feature, i) => (
                                    <Card key={i} className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                                    <feature.icon className="h-6 w-6 text-primary" />
                                                </div>
                                                <Badge variant="secondary" className="text-xs">{feature.badge}</Badge>
                                            </div>
                                            <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* How It Works Section */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-4 pb-6 border-b-2 border-border">
                            <div className="p-3 bg-gradient-to-br from-chart-2/20 to-chart-2/5 rounded-xl border border-chart-2/20">
                                <Workflow className="h-7 w-7 text-chart-2" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold tracking-tight text-foreground">System Architecture & Workflow</h2>
                                <p className="text-muted-foreground mt-1">End-to-end modernization pipeline</p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8 mb-12">
                            <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Network className="h-5 w-5 text-primary" />
                                        Processing Pipeline
                                    </CardTitle>
                                    <CardDescription>Parallel AI analysis for optimal performance</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {[
                                        "Multi-file ZIP archive support with automatic extraction",
                                        "Concurrent IBM watsonx.ai API calls (3 parallel requests)",
                                        "Real-time progress tracking with WebSocket updates",
                                        "Intelligent caching for repeated analysis operations"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-muted-foreground">{item}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-primary" />
                                        Enterprise Security
                                    </CardTitle>
                                    <CardDescription>Production-grade security controls</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {[
                                        "IBM Cloud IAM authentication with token-based access",
                                        "Environment variable protection (never committed to Git)",
                                        "SQL injection prevention with identifier validation",
                                        "CORS configuration restricted to same-origin requests"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-muted-foreground">{item}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="relative pt-12 pb-8">
                            <div className="absolute top-0 bottom-0 left-[31px] w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />
                            
                            {[
                                { 
                                    step: "1", 
                                    title: "Code Ingestion", 
                                    desc: "Upload legacy source files via drag-and-drop interface, ZIP archive extraction, or direct code paste. Supports Java, PHP, Python, JavaScript, TypeScript, SQL, and COBOL.",
                                    icon: Upload,
                                    color: "primary"
                                },
                                { 
                                    step: "2", 
                                    title: "AI-Powered Analysis", 
                                    desc: "IBM watsonx.ai Granite 4H Small model performs deep semantic analysis, extracting business entities, relationships, implicit database schemas, and architectural patterns with full contextual understanding.",
                                    icon: Cpu,
                                    color: "chart-2"
                                },
                                { 
                                    step: "3", 
                                    title: "Blueprint Generation", 
                                    desc: "Automated generation of comprehensive modernization artifacts: ER diagrams (Mermaid.js), normalized SQL schemas (PostgreSQL), Clean Architecture folder structures, and RESTful API contracts.",
                                    icon: GitBranch,
                                    color: "chart-3"
                                },
                                { 
                                    step: "4", 
                                    title: "Export & Implementation", 
                                    desc: "One-click download of complete project scaffold as ZIP archive containing TypeORM entities, NestJS services, controller templates, and production-ready configuration files.",
                                    icon: Download,
                                    color: "chart-4"
                                },
                            ].map((step, i) => (
                                <div key={i} className="relative flex items-start gap-8 mb-12 last:mb-0 group">
                                    <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-background bg-${step.color} text-${step.color}-foreground font-bold shadow-lg z-10 group-hover:scale-110 transition-transform duration-300`}>
                                        <span className="text-xl">{step.step}</span>
                                    </div>
                                    <Card className="flex-1 bg-gradient-to-br from-card to-card/50 border-border/50 group-hover:border-primary/30 group-hover:shadow-lg transition-all duration-300">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center gap-3 mb-2">
                                                <step.icon className={`h-5 w-5 text-${step.color}`} />
                                                <CardTitle className="text-xl font-bold text-foreground">{step.title}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Technical Specifications */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-4 pb-6 border-b-2 border-border">
                            <div className="p-3 bg-gradient-to-br from-chart-3/20 to-chart-3/5 rounded-xl border border-chart-3/20">
                                <Layers className="h-7 w-7 text-chart-3" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-bold tracking-tight text-foreground">Technical Specifications</h2>
                                <p className="text-muted-foreground mt-1">Enterprise technology stack and capabilities</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">Core Technologies</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { tech: "IBM watsonx.ai", desc: "Granite 4H Small - Enterprise LLM", badge: "AI Engine" },
                                        { tech: "Next.js 16", desc: "App Router with SSR/SSG", badge: "Framework" },
                                        { tech: "Tailwind CSS v4", desc: "Utility-first styling system", badge: "Styling" },
                                        { tech: "Shadcn UI", desc: "Radix + Maia component library", badge: "Components" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                                            <div>
                                                <div className="font-semibold text-foreground">{item.tech}</div>
                                                <div className="text-sm text-muted-foreground">{item.desc}</div>
                                            </div>
                                            <Badge variant="outline" className="text-xs">{item.badge}</Badge>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">System Capabilities</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        { capability: "Multi-language Support", value: "7+ Languages", desc: "Java, PHP, Python, JS, TS, SQL, COBOL" },
                                        { capability: "Analysis Speed", value: "< 30 sec", desc: "Average processing time per file" },
                                        { capability: "Entity Detection", value: "Up to 6", desc: "Business entities per analysis" },
                                        { capability: "Relationship Mapping", value: "Up to 5", desc: "Entity relationships per analysis" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                                            <div className="flex-1">
                                                <div className="font-semibold text-foreground">{item.capability}</div>
                                                <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-primary">{item.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section className="mt-16">
                        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-xl">
                            <CardContent className="p-12 text-center">
                                <div className="max-w-3xl mx-auto space-y-6">
                                    <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-4">
                                        <Sparkles className="h-12 w-12 text-primary" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-foreground">Ready to Modernize Your Legacy Systems?</h3>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        Experience the power of AI-driven architectural analysis. Transform months of manual work into seconds of automated intelligence.
                                    </p>
                                    <div className="flex items-center justify-center gap-4 pt-4">
                                        <a 
                                            href="/"
                                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                                        >
                                            Start Analysis
                                            <ArrowRight className="h-5 w-5" />
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </main>
        </div>
    )
}

// Made with Bob
