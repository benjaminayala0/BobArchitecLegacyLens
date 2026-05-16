"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateMermaidERDiagram, type BobBlueprint } from "@/lib"

interface ERDiagramProps {
    blueprint: BobBlueprint | null
}

interface Entity {
    id: string
    name: string
    x: number
    y: number
    fields: { name: string; type: string; isPrimary?: boolean; isForeign?: boolean }[]
}

interface Relation {
    from: string
    to: string
    type: "one-to-many" | "many-to-many" | "one-to-one"
}

const fallbackEntities: Entity[] = [
    {
        id: "users",
        name: "Users",
        x: 20,
        y: 20,
        fields: [
            { name: "id", type: "uuid", isPrimary: true },
            { name: "email", type: "varchar" },
            { name: "username", type: "varchar" },
        ],
    },
    {
        id: "products",
        name: "Products",
        x: 220,
        y: 20,
        fields: [
            { name: "id", type: "uuid", isPrimary: true },
            { name: "product_id", type: "varchar" },
            { name: "name", type: "varchar" },
        ],
    },
    {
        id: "orders",
        name: "Orders",
        x: 20,
        y: 160,
        fields: [
            { name: "id", type: "uuid", isPrimary: true },
            { name: "user_id", type: "uuid", isForeign: true },
            { name: "customer_id", type: "uuid", isForeign: true },
        ],
    },
    {
        id: "order_items",
        name: "OrderItems",
        x: 220,
        y: 160,
        fields: [
            { name: "id", type: "uuid", isPrimary: true },
            { name: "order_id", type: "uuid", isForeign: true },
            { name: "product_id", type: "uuid", isForeign: true },
            { name: "quantity", type: "int" },
        ],
    },
]

const relations: Relation[] = [
    { from: "users", to: "orders", type: "one-to-many" },
    { from: "orders", to: "order_items", type: "one-to-many" },
    { from: "products", to: "order_items", type: "one-to-many" },
]

export function ERDiagram({ blueprint }: ERDiagramProps) {
    const [svgContent, setSvgContent] = useState<string>('')
    const [isRendering, setIsRendering] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false) // ← nuevo

    useEffect(() => {
        if (!blueprint) {
            setSvgContent('')
            return
        }

        let isMounted = true
        setIsRendering(true)

        const sanitizeMermaid = (diagram: string): string => {
            return diagram
                .split('\n')
                .map(line => {
                    if (line.includes('||') || line.includes('}o') || line.includes('o{')) {
                        return line.replace(/\}$/, '').trim()
                    }
                    return line
                })
                .join('\n')
        }

        const mermaidCode = sanitizeMermaid(generateMermaidERDiagram(blueprint))

        import('mermaid').then(async (mermaidModule) => {
            const mermaid = mermaidModule.default

            mermaid.initialize({
                startOnLoad: false,
                theme: 'dark',
                themeVariables: {
                    primaryColor: '#3b82f6',
                    primaryTextColor: '#fff',
                    primaryBorderColor: '#1e40af',
                    lineColor: '#64748b',
                    secondaryColor: '#1e293b',
                    tertiaryColor: '#334155',
                }
            })

            try {
                const id = `mermaid-${Date.now()}`
                const { svg } = await mermaid.render(id, mermaidCode)

                if (isMounted) {
                    setSvgContent(svg)
                    setIsRendering(false)
                }
            } catch (error) {
                console.error('Error rendering Mermaid diagram:', error)
                if (isMounted) {
                    setSvgContent('')
                    setIsRendering(false)
                }
            }
        }).catch((error) => {
            console.error('Error loading Mermaid:', error)
            if (isMounted) {
                setIsRendering(false)
            }
        })

        return () => { isMounted = false }
    }, [blueprint])

    // Fallback sin blueprint — igual que antes
    if (!blueprint) {
        return (
            <Card className="bg-card border-border h-full">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-foreground">
                        Visual ER Diagram
                    </CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="relative bg-secondary/30 rounded-lg p-4 min-h-[300px] overflow-hidden">
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: `
                                    linear-gradient(to right, var(--border) 1px, transparent 1px),
                                    linear-gradient(to bottom, var(--border) 1px, transparent 1px)
                                `,
                                backgroundSize: '20px 20px'
                            }}
                        />
                        <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%" style={{ overflow: 'visible' }}>
                            <defs>
                                <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" className="fill-primary/60" />
                                </marker>
                            </defs>
                            <path d="M 100 95 L 100 155" className="stroke-primary/60" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                            <path d="M 180 215 L 225 215" className="stroke-primary/60" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                            <path d="M 300 95 L 300 155" className="stroke-primary/60" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                        </svg>
                        <div className="relative grid grid-cols-2 gap-4">
                            {fallbackEntities.map((entity) => (
                                <div key={entity.id} className="bg-card border border-border rounded-md overflow-hidden shadow-lg shadow-black/20">
                                    <div className="bg-primary/20 border-b border-border px-3 py-1.5">
                                        <span className="font-semibold text-foreground text-xs">{entity.name}</span>
                                    </div>
                                    <div className="p-2 space-y-0.5">
                                        {entity.fields.map((field) => (
                                            <div key={field.name} className="flex items-center justify-between text-[10px] py-0.5">
                                                <div className="flex items-center gap-1.5">
                                                    {field.isPrimary && <span className="text-[8px] bg-primary/20 text-primary px-1 rounded">PK</span>}
                                                    {field.isForeign && <span className="text-[8px] bg-chart-2/20 text-chart-2 px-1 rounded">FK</span>}
                                                    <span className="text-foreground">{field.name}</span>
                                                </div>
                                                <span className="text-muted-foreground">{field.type}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // ── Diagrama con datos reales ──────────────────────────────────────────────
    const diagramContent = (
        isRendering ? (
            <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground text-sm">Rendering diagram...</div>
            </div>
        ) : svgContent ? (
            <div
                className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto"
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
        ) : (
            <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground text-sm">No diagram available</div>
            </div>
        )
    )

    return (
        <>
            <Card className="bg-card border-border">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-foreground">
                        Visual ER Diagram
                    </CardTitle>
                    {/* ← botón ahora abre el expanded */}
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsExpanded(true)}>
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <CardContent>
                    <div
                        className="bg-secondary/30 rounded-lg p-2 h-[350px]  relative cursor-pointer"
                        onClick={() => setIsExpanded(true)}
                    >
                        {diagramContent}
                        {svgContent && (
                            <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground/60 bg-background/80 px-2 py-0.5 rounded">
                                Click to expand
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Modal pantalla completa */}
            {isExpanded && (
                <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-8">
                    <div className="h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold text-foreground">Visual ER Diagram</h2>
                            
                            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="flex-1 bg-secondary/30 rounded-lg p-8 overflow-auto">
                            {diagramContent}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}