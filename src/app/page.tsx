"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { UploadZone } from "@/components/upload-zone"
import { AnalysisPanel } from "@/components/analysis-panel"
import { ERDiagram } from "@/components/er-diagram"
import { FolderScaffolding } from "@/components/folder-scaffolding"
import { CodeViewer } from "@/components/code-viewer"
import { DatabaseSchema } from "@/components/database-schema"
import { ApiContract } from "@/components/api-contract"
import { Button } from "@/components/ui/button"
import { Download, ArrowRight, Sparkles, AlertCircle } from "lucide-react"
import { downloadZip, adaptJsonToFolderNodes, type BobBlueprint } from "@/lib"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BlueprintAI() {
  const [currentView, setCurrentView] = useState<"analyze" | "blueprint">("analyze")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [blueprintData, setBlueprintData] = useState<BobBlueprint | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (files: FileList) => {
    console.log("Files uploaded:", files)
    setIsAnalyzing(true)
    setAnalysisComplete(false)
    setError(null)
    setBlueprintData(null)

    try {
      const file = files[0]
      
      // Check if it's a ZIP file
      if (file.name.endsWith('.zip')) {
        const code = await extractCodeFromZip(file)
        await analyzeCode(code)
      } else {
        // Single file
        const code = await file.text()
        await analyzeCode(code)
      }
    } catch (error) {
      console.error('Error reading file:', error)
      setError('Failed to read file. Please try again.')
      setIsAnalyzing(false)
    }
  }

  const extractCodeFromZip = async (zipFile: File): Promise<string> => {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    
    try {
      const contents = await zip.loadAsync(zipFile)
      let combinedCode = ''
      
      // Extract code from common file types
      const codeExtensions = ['.java', '.php', '.py', '.js', '.ts', '.sql', '.c', '.cpp', '.cs', '.rb', '.go']
      
      for (const [filename, file] of Object.entries(contents.files)) {
        if (!file.dir && codeExtensions.some(ext => filename.toLowerCase().endsWith(ext))) {
          const content = await file.async('text')
          combinedCode += `\n\n// ========== ${filename} ==========\n\n${content}`
        }
      }
      
      if (!combinedCode) {
        throw new Error('No code files found in ZIP')
      }
      
      return combinedCode
    } catch (error) {
      console.error('Error extracting ZIP:', error)
      throw new Error('Failed to extract ZIP file')
    }
  }

  const handleCodePaste = async (code: string) => {
    console.log("Code pasted:", code.substring(0, 100))
    setIsAnalyzing(true)
    setAnalysisComplete(false)
    setError(null)
    setBlueprintData(null)
    await analyzeCode(code)
  }

  const analyzeCode = async (code: string) => {
    try {
      console.log('Sending code to API for analysis...')
      console.log('Code length:', code.length)
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      console.log('API Response status:', response.status)

      if (!response.ok) {
        let errorMessage = 'Analysis failed'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.details || errorMessage
          console.error('API Error:', errorData)
        } catch (e) {
          console.error('Failed to parse error response:', e)
          errorMessage = `Server error (${response.status}): ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const data: BobBlueprint = await response.json()
      console.log('Analysis successful, entities found:', data.entities?.length || 0)
      
      setBlueprintData({ ...data, original_code: code })
      setAnalysisComplete(true)
      
      setTimeout(() => {
        setIsAnalyzing(false)
        setCurrentView("blueprint")
      }, 1500)
      
    } catch (error) {
      console.error('Error analyzing code:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during analysis'
      setError(errorMessage)
      setIsAnalyzing(false)
      setAnalysisComplete(false)
    }
  }

  const handleExportZip = async () => {
    if (!blueprintData) return

    try {
      // Convert blueprint structure to FolderNode format with real content
      const rootNode = convertBlueprintToFolderNodes(blueprintData)
      await downloadZip(rootNode, 'modernized-scaffolding.zip')
    } catch (error) {
      console.error('Error exporting ZIP:', error)
      setError('Failed to export ZIP file')
    }
  }

  const convertBlueprintToFolderNodes = (blueprint: BobBlueprint): any => {
    const structure = blueprint.suggested_folder_structure
    
    const convertNode = (name: string, value: any): any => {
      if (Array.isArray(value)) {
        // It's a folder with files
        return {
          name,
          type: 'folder',
          children: value.map(fileName => ({
            name: fileName,
            type: 'file',
            content: generateFileContent(fileName, blueprint)
          }))
        }
      } else if (typeof value === 'object' && value !== null) {
        // It's a nested folder structure
        return {
          name,
          type: 'folder',
          children: Object.entries(value).map(([key, val]) => convertNode(key, val))
        }
      }
      return null
    }

    return {
      name: 'modernized-project',
      type: 'folder',
      children: Object.entries(structure).map(([key, value]) => convertNode(key, value)).filter(Boolean)
    }
  }

  const generateFileContent = (fileName: string, blueprint: BobBlueprint): string => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    
    // Generate entity files
    if (fileName.includes('Entity') || fileName.includes('Model')) {
      const entityName = fileName.replace(/\.(ts|js)$/, '').replace(/Entity|Model/, '')
      const entity = blueprint.entities.find(e => e.name.toLowerCase() === entityName.toLowerCase())
      
      if (entity) {
        return `import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('${entity.table}')
export class ${entity.name} {
${entity.fields.map(f => `  @${f.primary_key ? 'PrimaryGeneratedColumn' : 'Column'}()
  ${f.name}: ${f.type === 'integer' ? 'number' : f.type === 'boolean' ? 'boolean' : 'string'};`).join('\n\n')}
}
`
      }
    }
    
    // Generate service files
    if (fileName.includes('Service')) {
      const serviceName = fileName.replace(/\.(ts|js)$/, '')
      const entityName = serviceName.replace('Service', '')
      
      return `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${entityName} } from './entities/${entityName.toLowerCase()}.entity';

@Injectable()
export class ${serviceName} {
  constructor(
    @InjectRepository(${entityName})
    private repository: Repository<${entityName}>,
  ) {}

  async findAll(): Promise<${entityName}[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<${entityName}> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<${entityName}>): Promise<${entityName}> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<${entityName}>): Promise<${entityName}> {
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="p-6">
        <div className="flex gap-3 mb-6">
          <Button
            variant={currentView === "analyze" ? "default" : "outline"}
            onClick={() => setCurrentView("analyze")}
            className="gap-2"
          >
            <span className="h-5 w-5 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs font-bold">1</span>
            Analysis Dashboard
          </Button>

          <Button
            variant={currentView === "blueprint" ? "default" : "outline"}
            onClick={() => setCurrentView("blueprint")}
            className="gap-2"
            disabled={!analysisComplete}
          >
            <span className="h-5 w-5 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xs font-bold">2</span>
            Blueprint Output
          </Button>
        </div>

        {currentView === "analyze" ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                1. Smart Analysis Dashboard
              </h1>

              <Sparkles className="h-5 w-5 text-primary" />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-6 items-start">
              <div className="flex-1 min-w-0">
                <UploadZone onUpload={handleUpload} onCodePaste={handleCodePaste} />
              </div>

              {isAnalyzing && (
                <div className="flex-1 min-w-0 flex flex-col gap-4">
                  <AnalysisPanel isAnalyzing={true} />

                  {analysisComplete && blueprintData && (
                    <Button
                      className="gap-2 self-end"
                      onClick={() => setCurrentView("blueprint")}
                    >
                      View Blueprint
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">
                  2. The Architect&apos;s Blueprint (Output)
                </h1>

                <Sparkles className="h-5 w-5 text-primary" />
              </div>

              <Button
                className="gap-2 bg-primary hover:bg-primary/90"
                onClick={handleExportZip}
                disabled={!blueprintData}
              >
                <Download className="h-4 w-4" />
                Export Modernized Scaffolding ZIP
              </Button>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-5 h-[400px]">
                <ERDiagram blueprint={blueprintData} />
              </div>

              <div className="col-span-12 lg:col-span-4 h-[400px]">
                <FolderScaffolding blueprint={blueprintData} />
              </div>

              <div className="col-span-12 lg:col-span-3 h-[400px]">
                <DatabaseSchema blueprint={blueprintData} />
              </div>

              <div className="col-span-12 lg:col-span-8 h-[400px]">
                <CodeViewer blueprint={blueprintData} />
              </div>

              <div className="col-span-12 lg:col-span-4 h-[400px]">
                <ApiContract blueprint={blueprintData} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
