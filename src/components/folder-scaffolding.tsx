"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileCode, FileText, Settings, Eye, X } from "lucide-react"
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
    content?: string
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

function TreeItem({ node, depth = 0, onFileClick }: { node: TreeNode; depth?: number; onFileClick?: (node: TreeNode) => void }) {
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

                {node.type === "file" && onFileClick && (
                    <button
                        onClick={() => onFileClick(node)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary/20 rounded"
                        title="Preview content"
                    >
                        <Eye className="h-3 w-3 text-primary" />
                    </button>
                )}
            </div>

            {node.type === "folder" && isOpen && node.children && (
                <div>
                    {node.children.map((child, index) => (
                        <TreeItem key={`${child.name}-${index}`} node={child} depth={depth + 1} onFileClick={onFileClick} />
                    ))}
                </div>
            )}
        </div>
    )
}

// Convert FolderStructure to TreeNode format
function convertToTreeNode(name: string, structure: FolderStructure | string[]): TreeNode {
    if (Array.isArray(structure)) {
        // It's a list of files
        return {
            name,
            type: "folder",
            children: structure.map(fileName => ({
                name: fileName,
                type: "file" as const,
                fileType: getFileType(fileName)
            }))
        }
    } else {
        // It's a nested folder structure
        return {
            name,
            type: "folder",
            children: Object.entries(structure).map(([key, value]) =>
                convertToTreeNode(key, value)
            )
        }
    }
}

function getFileType(fileName: string): TreeNode['fileType'] {
    if (fileName.endsWith('.ts') || fileName.endsWith('.tsx') || fileName.endsWith('.js') || fileName.endsWith('.jsx')) {
        return 'ts'
    }
    if (fileName.endsWith('.json')) {
        return 'json'
    }
    if (fileName.endsWith('.sql') || fileName.endsWith('.config.ts') || fileName.endsWith('.config.js')) {
        return 'config'
    }
    if (fileName.endsWith('.md')) {
        return 'md'
    }
    return undefined
}

export function FolderScaffolding({ blueprint }: FolderScaffoldingProps) {
    const [selectedFile, setSelectedFile] = useState<TreeNode | null>(null)
    const [fileContent, setFileContent] = useState<string>("")

    // Convert blueprint folder structure to TreeNode format
    const folderStructure = blueprint?.suggested_folder_structure
        ? convertToTreeNode("Modernized Architecture", blueprint.suggested_folder_structure)
        : fallbackFolderStructure

    const generateFileContent = (fileName: string): string => {
        if (!blueprint) return "// File content will be generated based on your blueprint"

        const ext = fileName.split('.').pop()?.toLowerCase()
        const baseName = fileName.replace(/\.(ts|js|tsx|jsx)$/, '')
        
        // Try to match entity by name (handles "Student.ts", "StudentEntity.ts", "student.entity.ts" etc.)
        const cleanName = baseName.replace(/Entity|entity|\.entity/gi, '').replace(/Model|model|\.model/gi, '')
        const matchedEntity = blueprint.entities.find(e => 
            e.name.toLowerCase() === cleanName.toLowerCase() ||
            e.name.toLowerCase() === baseName.toLowerCase()
        )
        
        // Generate entity/model files
        if (matchedEntity && (ext === 'ts' || ext === 'js') && !fileName.includes('Service') && !fileName.includes('Controller') && !fileName.includes('Repository') && !fileName.includes('Route') && !fileName.includes('Test') && !fileName.includes('test') && !fileName.includes('spec')) {
            return `import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('${matchedEntity.table}')
export class ${matchedEntity.name} {
${matchedEntity.fields.map(f => `  @${f.primary_key ? 'PrimaryGeneratedColumn' : 'Column'}()
  ${f.name}: ${f.type === 'integer' ? 'number' : f.type === 'boolean' ? 'boolean' : 'string'};`).join('\n\n')}
}
`
        }
        
        // Generate service files
        if (fileName.includes('Service') || fileName.includes('service')) {
            const serviceName = baseName
            const entityName = serviceName.replace(/Service|service/gi, '')
            const entity = blueprint.entities.find(e => e.name.toLowerCase() === entityName.toLowerCase())
            const resolvedName = entity ? entity.name : entityName
            
            return `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${resolvedName} } from './entities/${resolvedName.toLowerCase()}.entity';

@Injectable()
export class ${serviceName} {
  constructor(
    @InjectRepository(${resolvedName})
    private repository: Repository<${resolvedName}>,
  ) {}

  async findAll(): Promise<${resolvedName}[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<${resolvedName}> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<${resolvedName}>): Promise<${resolvedName}> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<${resolvedName}>): Promise<${resolvedName}> {
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
`
        }

        // Generate controller files
        if (fileName.includes('Controller') || fileName.includes('controller')) {
            const controllerName = baseName
            const entityName = controllerName.replace(/Controller|controller/gi, '')
            const entity = blueprint.entities.find(e => e.name.toLowerCase() === entityName.toLowerCase())
            const resolvedName = entity ? entity.name : entityName

            return `import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ${resolvedName}Service } from './${resolvedName.toLowerCase()}.service';

@Controller('${resolvedName.toLowerCase()}s')
export class ${controllerName} {
  constructor(private readonly ${resolvedName.toLowerCase()}Service: ${resolvedName}Service) {}

  @Get()
  findAll() {
    return this.${resolvedName.toLowerCase()}Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.${resolvedName.toLowerCase()}Service.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<any>) {
    return this.${resolvedName.toLowerCase()}Service.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.${resolvedName.toLowerCase()}Service.remove(id);
  }
}
`
        }

        // Generate repository files
        if (fileName.includes('Repository') || fileName.includes('repository')) {
            const repoName = baseName
            const entityName = repoName.replace(/Repository|repository/gi, '')
            const entity = blueprint.entities.find(e => e.name.toLowerCase() === entityName.toLowerCase())
            const resolvedName = entity ? entity.name : entityName

            return `import { EntityRepository, Repository } from 'typeorm';
import { ${resolvedName} } from './entities/${resolvedName.toLowerCase()}.entity';

@EntityRepository(${resolvedName})
export class ${repoName} extends Repository<${resolvedName}> {
  // Custom query methods can be added here
}
`
        }
        
        // Default content based on extension
        switch (ext) {
            case 'ts':
            case 'tsx':
                return `// ${fileName}\n// Generated by BobArchitecLegacyLens\n\nexport {};\n`
            case 'json':
                return `{\n  "name": "${fileName.replace('.json', '')}",\n  "version": "1.0.0"\n}\n`
            case 'md':
                return `# ${fileName.replace('.md', '')}\n\nGenerated documentation.\n`
            case 'sql':
                return blueprint.entities.map(e =>
                    `CREATE TABLE ${e.table} (\n${e.fields.map(f =>
                        `  ${f.name} ${f.type.toUpperCase()}${f.primary_key ? ' PRIMARY KEY' : ''}${f.nullable === false ? ' NOT NULL' : ''}`
                    ).join(',\n')}\n);\n`
                ).join('\n\n')
            default:
                return `// ${fileName}\n// TODO: Implement\n`
        }
    }

    const handleFileClick = (node: TreeNode) => {
        setSelectedFile(node)
        setFileContent(generateFileContent(node.name))
    }

    return (
        <>
            <Card className="bg-card border-border h-full">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-foreground">
                        Folder Scaffolding
                    </CardTitle>

                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Eye className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <CardContent>
                    <div className="bg-secondary/30 rounded-lg p-2 h-[300px] overflow-auto">
                        <TreeItem node={folderStructure} onFileClick={handleFileClick} />
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
                <DialogContent className="max-w-3xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileCode className="h-5 w-5 text-primary" />
                            {selectedFile?.name}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="bg-secondary/30 rounded-lg p-4 max-h-[60vh] overflow-auto">
                        <pre className="text-xs font-mono">
                            <code className="text-foreground/90 whitespace-pre">{fileContent}</code>
                        </pre>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
