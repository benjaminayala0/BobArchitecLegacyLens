"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileCode, FileText, Settings, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { type BobBlueprint, type FolderStructure } from "@/lib"

interface FolderScaffoldingProps {
    blueprint: BobBlueprint | null
}

interface TreeNode {
    name: string
    type: "folder" | "file"
    children?: TreeNode[]
    fileType?: "ts" | "json" | "config" | "md"
}

const fallbackFolderStructure: TreeNode = {
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

// ── Code-editor-style syntax highlighting ────────────────────────────────────
function highlightLine(line: string): string {
    const escaped = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')

    return escaped
        .replace(
            /\b(import|export|from|class|const|let|var|async|await|return|if|else|new|this|extends|implements|type|interface|void|string|number|boolean|Promise|null|undefined|true|false)\b/g,
            '<span style="color:#c792ea;font-weight:500">$1</span>'
        )
        .replace(/('[^']*'|"[^"]*")/g, '<span style="color:#c3e88d">$1</span>')
        .replace(/(\/\/.*$)/g, '<span style="color:#546e7a;font-style:italic">$1</span>')
        .replace(/(@\w+)/g, '<span style="color:#82aaff">$1</span>')
}

// ── TreeItem ──────────────────────────────────────────────────────────────────
function TreeItem({
    node,
    depth = 0,
    onFileClick,
}: {
    node: TreeNode
    depth?: number
    onFileClick?: (node: TreeNode) => void
}) {
    const [isOpen, setIsOpen] = useState(depth < 2)

    const getFileIcon = () => {
        if (node.type === "folder") {
            return isOpen
                ? <FolderOpen className="h-4 w-4 text-chart-4" />
                : <Folder className="h-4 w-4 text-chart-4" />
        }
        switch (node.fileType) {
            case "ts": return <FileCode className="h-4 w-4 text-primary" />
            case "json": return <Settings className="h-4 w-4 text-chart-3" />
            case "config": return <Settings className="h-4 w-4 text-chart-2" />
            default: return <FileText className="h-4 w-4 text-muted-foreground" />
        }
    }

    return (
        <div>
            {/* Row wrapper — `group` enables the hover-reveal eye icon */}
            <div
                className="flex items-center gap-1 group hover:bg-secondary/50 rounded px-1 transition-colors"
                style={{ paddingLeft: `${depth * 12 + 4}px` }}
            >
                <button
                    onClick={() => node.type === "folder" && setIsOpen(!isOpen)}
                    className={`flex items-center gap-1.5 py-0.5 flex-1 text-left ${node.type === "folder" ? "cursor-pointer" : "cursor-default"
                        }`}
                >
                    {node.type === "folder" && (
                        <span className="w-3 flex items-center justify-center">
                            {isOpen
                                ? <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                        </span>
                    )}
                    {node.type === "file" && <span className="w-3" />}
                    {getFileIcon()}
                    <span className={`text-xs ${node.type === "folder"
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                        }`}>
                        {node.name}
                    </span>
                </button>

                {/* Eye button — only for files, only visible on row hover */}
                {node.type === "file" && onFileClick && (
                    <button
                        onClick={() => onFileClick(node)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary/20 rounded"
                        title="Preview file"
                    >
                        <Eye className="h-3 w-3 text-primary" />
                    </button>
                )}
            </div>

            {node.type === "folder" && isOpen && node.children && (
                <div>
                    {node.children.map((child, index) => (
                        <TreeItem
                            key={`${child.name}-${index}`}
                            node={child}
                            depth={depth + 1}
                            onFileClick={onFileClick}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function convertToTreeNode(name: string, structure: FolderStructure | string[]): TreeNode {
    if (Array.isArray(structure)) {
        return {
            name,
            type: "folder",
            children: structure.map(fileName => ({
                name: fileName,
                type: "file" as const,
                fileType: getFileType(fileName),
            })),
        }
    }
    return {
        name,
        type: "folder",
        children: Object.entries(structure).map(([key, value]) =>
            convertToTreeNode(key, value)
        ),
    }
}

function getFileType(fileName: string): TreeNode["fileType"] {
    if (/\.(ts|tsx|js|jsx)$/.test(fileName)) return "ts"
    if (/\.json$/.test(fileName)) return "json"
    if (/\.(sql|config\.ts|config\.js)$/.test(fileName)) return "config"
    if (/\.md$/.test(fileName)) return "md"
    return undefined
}

function parseTextFolderStructure(text: string): TreeNode {
    const lines = text.split("\n").filter(l => l.trim())
    const root: TreeNode = { name: "Modernized Architecture", type: "folder", children: [] }
    const stack: { node: TreeNode; indent: number }[] = [{ node: root, indent: -1 }]

    for (const line of lines) {
        const indent = line.search(/\S/)
        const name = line.trim().replace(/\/$/, "")
        if (!name) continue

        const isFolder = line.trim().endsWith("/")
        const node: TreeNode = {
            name,
            type: isFolder ? "folder" : "file",
            children: isFolder ? [] : undefined,
            fileType: isFolder ? undefined : getFileType(name),
        }

        while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop()
        const parent = stack[stack.length - 1].node
        if (parent.children) parent.children.push(node)
        if (isFolder) stack.push({ node, indent })
    }

    return root
}

// ── Content generator ─────────────────────────────────────────────────────────
function generateFileContent(fileName: string, blueprint: BobBlueprint | null): string {
    if (!blueprint) return "// File content will be generated based on your blueprint"

    const ext = fileName.split(".").pop()?.toLowerCase() ?? ""
    const baseName = fileName.replace(/\.(ts|js|tsx|jsx)$/, "")
    const cleanName = baseName.replace(/Entity|entity|Model|model/gi, "")
    const matchedEntity = blueprint.entities.find(
        e => e.name.toLowerCase() === cleanName.toLowerCase() ||
            e.name.toLowerCase() === baseName.toLowerCase()
    )

    // Entity / Model
    if (
        matchedEntity &&
        ["ts", "js"].includes(ext) &&
        !/(Service|Controller|Repository|Route|[Tt]est|spec)/i.test(fileName)
    ) {
        return `import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('${matchedEntity.table}')
export class ${matchedEntity.name} {
${matchedEntity.fields
                .map(f => `  @${f.primary_key ? "PrimaryGeneratedColumn" : "Column"}()
  ${f.name}: ${f.type === "integer" ? "number" : f.type === "boolean" ? "boolean" : "string"};`)
                .join("\n\n")}
}
`
    }

    // Service
    if (/Service/i.test(fileName)) {
        const entityName = baseName.replace(/Service/i, "")
        const entity = blueprint.entities.find(e => e.name.toLowerCase() === entityName.toLowerCase())
        const resolved = entity?.name ?? entityName
        return `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${resolved} } from '../entities/${resolved.toLowerCase()}.entity';

@Injectable()
export class ${baseName} {
  constructor(
    @InjectRepository(${resolved})
    private repo: Repository<${resolved}>,
  ) {}

  findAll() { return this.repo.find(); }
  findOne(id: string) { return this.repo.findOne({ where: { id } as any }); }
  create(data: Partial<${resolved}>) { return this.repo.save(this.repo.create(data)); }
  async update(id: string, data: Partial<${resolved}>) {
    await this.repo.update(id, data);
    return this.findOne(id);
  }
  remove(id: string) { return this.repo.delete(id); }
}
`
    }

    // Controller
    if (/Controller/i.test(fileName)) {
        const entityName = baseName.replace(/Controller/i, "")
        const entity = blueprint.entities.find(e => e.name.toLowerCase() === entityName.toLowerCase())
        const resolved = entity?.name ?? entityName
        return `import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ${resolved}Service } from './${resolved.toLowerCase()}.service';

@Controller('${resolved.toLowerCase()}s')
export class ${baseName} {
  constructor(private readonly svc: ${resolved}Service) {}

  @Get()    findAll()               { return this.svc.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post()   create(@Body() body: any) { return this.svc.create(body); }
  @Patch(':id') update(@Param('id') id: string, @Body() body: any) { return this.svc.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
`
    }

    // Repository
    if (/Repository/i.test(fileName)) {
        const entityName = baseName.replace(/Repository/i, "")
        const entity = blueprint.entities.find(e => e.name.toLowerCase() === entityName.toLowerCase())
        const resolved = entity?.name ?? entityName
        return `import { EntityRepository, Repository } from 'typeorm';
import { ${resolved} } from '../entities/${resolved.toLowerCase()}.entity';

@EntityRepository(${resolved})
export class ${baseName} extends Repository<${resolved}> {
  // Add custom query methods here
}
`
    }

    // SQL
    if (ext === "sql") {
        return blueprint.entities
            .map(e =>
                `CREATE TABLE ${e.table} (\n${e.fields
                    .map(f => `  ${f.name} ${f.type.toUpperCase()}${f.primary_key ? " PRIMARY KEY" : ""}${f.nullable === false ? " NOT NULL" : ""}`)
                    .join(",\n")}\n);`
            )
            .join("\n\n")
    }

    // JSON
    if (ext === "json") return `{\n  "name": "${baseName}",\n  "version": "1.0.0"\n}\n`

    // Markdown
    if (ext === "md") return `# ${baseName}\n\nGenerated documentation.\n`

    return `// ${fileName}\n// TODO: Implement\n`
}

// ── Main component ────────────────────────────────────────────────────────────
export function FolderScaffolding({ blueprint }: FolderScaffoldingProps) {
    const [selectedFile, setSelectedFile] = useState<TreeNode | null>(null)

    let folderStructure: TreeNode
    if (blueprint?.folderStructure) {
        folderStructure = parseTextFolderStructure(blueprint.folderStructure)
    } else if (blueprint?.suggested_folder_structure) {
        folderStructure = convertToTreeNode("Modernized Architecture", blueprint.suggested_folder_structure)
    } else {
        folderStructure = fallbackFolderStructure
    }

    const ext = selectedFile?.name.split(".").pop()?.toLowerCase() ?? ""
    const fileContent = selectedFile ? generateFileContent(selectedFile.name, blueprint) : ""

    return (
        <>
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
                        <TreeItem node={folderStructure} onFileClick={setSelectedFile} />
                    </div>
                </CardContent>
            </Card>

            {/* Code-editor-style preview dialog */}
            <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
                <DialogContent className="w-[95vw] max-w-[1400px] h-[85vh] p-0 overflow-hidden bg-[#0d1117] border-slate-700">
                    {/* Title bar */}
                    <DialogHeader className="px-4 py-2 border-b border-slate-700 bg-[#161b22]">
                        <DialogTitle className="flex items-center gap-2 text-slate-300 text-sm font-mono">
                            <FileCode className="h-4 w-4 text-primary" />
                            {selectedFile?.name}
                            <span className="ml-auto text-[10px] text-slate-500 font-sans">
                                {["ts", "tsx", "js", "jsx"].includes(ext) ? "TypeScript" : ext.toUpperCase()}
                            </span>
                        </DialogTitle>
                    </DialogHeader>

                    {/* Code area */}
                    <div className="overflow-auto h-[calc(80vh-52px)]">
                        <table className="w-full border-collapse min-w-max">
                            <tbody>
                                {fileContent.split('\n').map((line, i) => (
                                    <tr key={i} className="hover:bg-slate-800/50">
                                        <td className="select-none text-right pr-4 pl-4 text-slate-600 text-[11px] leading-6 align-top w-10 border-r border-slate-800 sticky left-0 bg-[#0d1117]">
                                            {i + 1}
                                        </td>
                                        <td className="pl-4 pr-8 leading-6 text-[12px] font-mono text-slate-300 whitespace-pre align-top">
                                            <span dangerouslySetInnerHTML={{ __html: highlightLine(line) || '&nbsp;' }} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}