"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateApiContract, type BobBlueprint } from "@/lib"

interface ApiContractProps {
    blueprint: BobBlueprint | null
}

interface Endpoint {
    endpoint: string
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
    description: string
}

const fallbackEndpoints: Endpoint[] = [
    { endpoint: "/api/v1/users", method: "GET", description: "List all users with pagination" },
    { endpoint: "/api/v1/users/:id", method: "GET", description: "Get user by ID" },
    { endpoint: "/api/v1/users", method: "POST", description: "Create new user" },
    { endpoint: "/api/v1/orders", method: "GET", description: "List orders with filters" },
    { endpoint: "/api/v1/orders", method: "POST", description: "Create new order" },
    { endpoint: "/api/v1/orders/:id", method: "GET", description: "Get order details" },
    { endpoint: "/api/v1/orders/:id", method: "PATCH", description: "Update order status" },
    { endpoint: "/api/v1/products", method: "GET", description: "List all products" },
    { endpoint: "/api/v1/products", method: "POST", description: "Create new product" },
    { endpoint: "/api/v1/products/:id", method: "PUT", description: "Update product" },
]

const methodColors: Record<string, string> = {
    GET: "bg-chart-2/20 text-chart-2",
    POST: "bg-primary/20 text-primary",
    PUT: "bg-chart-4/20 text-chart-4",
    DELETE: "bg-destructive/20 text-destructive",
    PATCH: "bg-chart-3/20 text-chart-3",
}

export function ApiContract({ blueprint }: ApiContractProps) {
    // Use apiContracts from watsonx.ai if available, otherwise generate from entities
    let endpoints: Endpoint[]
    
    if (blueprint?.apiContracts && blueprint.apiContracts.length > 0) {
        // Use API contracts directly from watsonx.ai
        endpoints = blueprint.apiContracts
    } else if (blueprint) {
        // Generate from entities using the helper
        const apiMarkdown = generateApiContract(blueprint)
        endpoints = parseEndpoints(apiMarkdown)
    } else {
        endpoints = fallbackEndpoints
    }

    const parseEndpoints = (markdown: string): Endpoint[] => {
        const endpoints: Endpoint[] = []
        const lines = markdown.split('\n')

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            const match = line.match(/^-\s+\*\*(\w+)\*\*\s+`([^`]+)`\s+-\s+(.+)$/)
            if (match) {
                const [, method, endpoint, description] = match
                endpoints.push({
                    method: method as Endpoint['method'],
                    endpoint,
                    description
                })
            }
        }

        return endpoints.length > 0 ? endpoints : fallbackEndpoints
    }

    return (
        <Card className="bg-card border-border h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-foreground">
                    API Contract
                </CardTitle>

                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent>
                <div className="bg-secondary/30 rounded-lg overflow-hidden">
                    <div className="overflow-auto max-h-[300px]">
                        <table className="w-full text-[10px]">
                            <thead className="bg-secondary/50 sticky top-0">
                                <tr>
                                    <th className="text-left p-2 font-medium text-foreground">Endpoint</th>
                                    <th className="text-left p-2 font-medium text-foreground w-16">Method</th>
                                    <th className="text-left p-2 font-medium text-foreground">Description</th>
                                </tr>
                            </thead>

                            <tbody>
                                {endpoints.map((ep, index) => (
                                    <tr key={index} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                                        <td className="p-2 font-mono text-muted-foreground">{ep.endpoint}</td>

                                        <td className="p-2">
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${methodColors[ep.method]}`}>
                                                {ep.method}
                                            </span>
                                        </td>

                                        <td className="p-2 text-muted-foreground">{ep.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
