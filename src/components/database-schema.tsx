"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateSqlSchema, type BobBlueprint } from "@/lib"

interface DatabaseSchemaProps {
    blueprint: BobBlueprint | null
}

const fallbackSQL = `-- Generated PostgreSQL Schema
-- BlueprintAI Modernization Output

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  total DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);`

export function DatabaseSchema({ blueprint }: DatabaseSchemaProps) {
    const schemaSQL = blueprint ? generateSqlSchema(blueprint) : fallbackSQL

    const handleCopy = () => {
        navigator.clipboard.writeText(schemaSQL)
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-foreground">
                    Database Schema (SQL)
                </CardTitle>

                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
                        <Copy className="h-3 w-3" />
                    </Button>

                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className="bg-secondary/30 rounded-lg max-h-[280px] overflow-y-auto overflow-x-hidden">
                    <pre className="p-3 text-[10px] leading-4 font-mono">
                        <code>
                            {schemaSQL.split("\n").map((line, i) => (
                                <div
                                    key={i}
                                    className={`${line.startsWith("--")
                                        ? "text-muted-foreground/50"
                                        : line.startsWith("CREATE")
                                            ? "text-primary"
                                            : line.includes("PRIMARY KEY") || line.includes("REFERENCES")
                                                ? "text-chart-2"
                                                : "text-foreground/80"
                                        }`}
                                >
                                    {line || " "}
                                </div>
                            ))}
                        </code>
                    </pre>
                </div>
            </CardContent>
        </Card>
    )
}
