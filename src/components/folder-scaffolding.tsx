"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileCode, FileText, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FolderNode } from "@/lib/zipGenerator"

interface FolderScaffoldingProps {
    folderStructure?: unknown
}

interface TreeNode {
    name: string
    type: "folder" | "file"
    children?: TreeNode[]
    fileType?: "ts" | "json" | "config" | "md"
    content?: string
}

const defaultFolderStructure: TreeNode = {
    name: "Clean Architecture",
    type: "folder",
    children: [
        {
            name: "src",
            type: "folder",
            children: [
                {
                    name: "controllers",
                    type: "folder",
                    children: [
                        { name: "OrderController.ts", type: "file", fileType: "ts" },
                        { name: "UserController.ts", type: "file", fileType: "ts" },
                        { name: "ProductController.ts", type: "file", fileType: "ts" },
                    ],
                },
                {
                    name: "services",
                    type: "folder",
                    children: [
                        { name: "OrderService.ts", type: "file", fileType: "ts" },
                        { name: "UserService.ts", type: "file", fileType: "ts" },
                        { name: "ProductService.ts", type: "file", fileType: "ts" },
                    ],
                },
                {
                    name: "repositories",
                    type: "folder",
                    children: [
                        { name: "OrderRepository.ts", type: "file", fileType: "ts" },
                        { name: "UserRepository.ts", type: "file", fileType: "ts" },
                    ],
                },
                {
                    name: "entities",
                    type: "folder",
                    children: [
                        { name: "Order.ts", type: "file", fileType: "ts" },
                        { name: "User.ts", type: "file", fileType: "ts" },
                        { name: "Product.ts", type: "file", fileType: "ts" },
                        { name: "OrderItem.ts", type: "file", fileType: "ts" },
                    ],
                },
                {
                    name: "dto",
                    type: "folder",
                    children: [
                        { name: "CreateOrderDto.ts", type: "file", fileType: "ts" },
                        { name: "UpdateOrderDto.ts", type: "file", fileType: "ts" },
                    ],
                },
                { name: "main.ts", type: "file", fileType: "ts" },
            ],
        },
        {
            name: "database",
            type: "folder",
            children: [
                { name: "schema.sql", type: "file", fileType: "config" },
                { name: "migrations", type: "folder", children: [] },
            ],
        },
        {
            name: "config",
            type: "folder",
            children: [
                { name: "database.config.ts", type: "file", fileType: "ts" },
                { name: "app.config.ts", type: "file", fileType: "ts" },
            ],
        },
        { name: "package.json", type: "file", fileType: "json" },
        { name: "tsconfig.json", type: "file", fileType: "json" },
        { name: "README.md", type: "file", fileType: "md" },
    ],
}

function TreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
    const [isOpen, setIsOpen] = useState(depth < 2)

    const getFileIcon = () => {
        if (node.type === "folder") {
            return isOpen ? (
                <FolderOpen className="h-4 w-4 text-chart-4" />
            ) : (
                <Folder className="h-4 w-4 text-chart-4" />
            )
        }
        switch (node.fileType) {
            case "ts":
                return <FileCode className="h-4 w-4 text-primary" />
            case "json":
                return <Settings className="h-4 w-4 text-chart-3" />
            case "config":
                return <Settings className="h-4 w-4 text-chart-2" />
            default:
                return <FileText className="h-4 w-4 text-muted-foreground" />
        }
    }

    return (
        <div>
            <button
                onClick={() => node.type === "folder" && setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 py-0.5 w-full text-left hover:bg-secondary/50 rounded px-1 transition-colors ${node.type === "folder" ? "cursor-pointer" : "cursor-default"
                    }`}
                style={{ paddingLeft: `${depth * 12 + 4}px` }}
            >
                {node.type === "folder" && (
                    <span className="w-3 flex items-center justify-center">
                        {isOpen ? (
                            <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        ) : (
                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        )}
                    </span>
                )}

                {node.type === "file" && <span className="w-3" />}
                {getFileIcon()}
                
                <span className={`text-xs ${node.type === "folder" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {node.name}
                </span>
            </button>

            {node.type === "folder" && isOpen && node.children && (
                <div>
                    {node.children.map((child, index) => (
                        <TreeItem key={`${child.name}-${index}`} node={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    )
}

export function FolderScaffolding({ folderStructure: propsFolderStructure }: FolderScaffoldingProps) {
    // Convert the props structure to TreeNode format
    const folderStructure = propsFolderStructure
        ? (propsFolderStructure as TreeNode)
        : defaultFolderStructure
    
    return (
        <Card className="bg-card border-border h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-foreground">
                    Folder Scaffolding
                </CardTitle>

                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent>
                <div className="bg-secondary/30 rounded-lg p-2 max-h-[300px] overflow-auto">
                    <TreeItem node={folderStructure} />
                </div>
            </CardContent>
        </Card>
    )
}
