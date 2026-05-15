"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

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

const entities: Entity[] = [
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

export function ERDiagram() {
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
                    {/* Grid background */}
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

                    {/* SVG for relations */}
                    <svg
                        className="absolute inset-0 pointer-events-none"
                        width="100%"
                        height="100%"
                        style={{ overflow: 'visible' }}
                    >
                        <defs>
                            <marker
                                id="arrow"
                                markerWidth="10"
                                markerHeight="7"
                                refX="9"
                                refY="3.5"
                                orient="auto"
                            >
                                <polygon
                                    points="0 0, 10 3.5, 0 7"
                                    className="fill-primary/60"
                                />
                            </marker>
                        </defs>

                        {/* Users -> Orders */}
                        <path
                            d="M 100 95 L 100 155"
                            className="stroke-primary/60"
                            strokeWidth="2"
                            fill="none"
                            markerEnd="url(#arrow)"
                        />

                        {/* Orders -> OrderItems */}
                        <path
                            d="M 180 215 L 225 215"
                            className="stroke-primary/60"
                            strokeWidth="2"
                            fill="none"
                            markerEnd="url(#arrow)"
                        />

                        {/* Products -> OrderItems */}
                        <path
                            d="M 300 95 L 300 155"
                            className="stroke-primary/60"
                            strokeWidth="2"
                            fill="none"
                            markerEnd="url(#arrow)"
                        />
                    </svg>

                    {/* Entity boxes */}
                    <div className="relative grid grid-cols-2 gap-4">
                        {entities.map((entity) => (
                            <div
                                key={entity.id}
                                className="bg-card border border-border rounded-md overflow-hidden shadow-lg shadow-black/20"
                            >
                                <div className="bg-primary/20 border-b border-border px-3 py-1.5">
                                    <span className="font-semibold text-foreground text-xs">
                                        {entity.name}
                                    </span>
                                </div>

                                <div className="p-2 space-y-0.5">
                                    {entity.fields.map((field) => (
                                        <div
                                            key={field.name}
                                            className="flex items-center justify-between text-[10px] py-0.5"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                {field.isPrimary && (
                                                    <span className="text-[8px] bg-primary/20 text-primary px-1 rounded">PK</span>
                                                )}

                                                {field.isForeign && (
                                                    <span className="text-[8px] bg-chart-2/20 text-chart-2 px-1 rounded">FK</span>
                                                )}

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
