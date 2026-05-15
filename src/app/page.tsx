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
import { Download, ArrowRight, Sparkles } from "lucide-react"
import {
  generateMermaidERDiagram,
  generateSqlSchema,
  generateApiContract,
  downloadZip,
  adaptJsonToFolderNodes,
  type BobBlueprint,
  type ApiEndpoint
} from "@/lib"
import { toast } from "sonner"

export default function BlueprintAI() {
  const [currentView, setCurrentView] = useState<"analyze" | "blueprint">("analyze")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  
  // State for generated outputs
  const [mermaidDiagram, setMermaidDiagram] = useState<string>("")
  const [sqlSchema, setSqlSchema] = useState<string>("")
  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpoint[]>([])
  const [blueprint, setBlueprint] = useState<BobBlueprint | null>(null)

  const handleUpload = async (files: FileList) => {
    // For now, just read the first file
    const file = files[0]
    if (!file) return

    try {
      const code = await file.text()
      await analyzeCode(code)
    } catch (error) {
      console.error("Error reading file:", error)
      toast.error("Failed to read file")
    }
  }

  const handleCodePaste = async (code: string) => {
    await analyzeCode(code)
  }

  const analyzeCode = async (code: string) => {
    setIsAnalyzing(true)
    setAnalysisComplete(false)

    try {
      // Call the API
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const blueprintData: BobBlueprint = await response.json()
      
      // Store the blueprint
      setBlueprint(blueprintData)

      // Generate outputs using the utilities
      const mermaid = generateMermaidERDiagram(blueprintData)
      const sql = generateSqlSchema(blueprintData)
      const endpoints = generateApiContract(blueprintData)

      // Update state
      setMermaidDiagram(mermaid)
      setSqlSchema(sql)
      setApiEndpoints(endpoints)
      
      setAnalysisComplete(true)
      toast.success("Analysis complete!")
    } catch (error) {
      console.error("Analysis error:", error)
      toast.error("Failed to analyze code. Please try again.")
      setIsAnalyzing(false)
    }
  }

  const handleAnalysisComplete = () => {
    setAnalysisComplete(true)
  }

  const handleDownloadZip = async () => {
    if (!blueprint?.suggested_folder_structure) {
      toast.error("No folder structure available")
      return
    }

    try {
      const folderNodes = adaptJsonToFolderNodes(blueprint.suggested_folder_structure)
      await downloadZip(folderNodes)
      toast.success("ZIP file downloaded successfully!")
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Failed to download ZIP file")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="p-6">
        {/* View Toggle */}
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
            disabled={!analysisComplete && !isAnalyzing}
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

            <div className="flex gap-6 items-start">
              <div className="flex-1 min-w-0">
                <UploadZone onUpload={handleUpload} onCodePaste={handleCodePaste} />
              </div>

              {isAnalyzing && (
                <div className="flex-1 min-w-0 flex flex-col gap-4">
                  <AnalysisPanel isAnalyzing={isAnalyzing} onComplete={handleAnalysisComplete} />

                  {analysisComplete && (
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
          /* The Architect's Blueprint (Output) */
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
                onClick={handleDownloadZip}
                disabled={!blueprint}
              >
                <Download className="h-4 w-4" />
                Export Modernized Scaffolding ZIP
              </Button>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-12 gap-4">
              {/* Left Column - ER Diagram */}
              <div className="col-span-12 lg:col-span-5">
                <ERDiagram mermaidCode={mermaidDiagram} />
              </div>

              {/* Middle Column - Folder Scaffolding */}
              <div className="col-span-12 lg:col-span-4">
                <FolderScaffolding folderStructure={blueprint?.suggested_folder_structure} />
              </div>

              {/* Right Column - Database Schema */}
              <div className="col-span-12 lg:col-span-3">
                <DatabaseSchema sqlSchema={sqlSchema} />
              </div>

              {/* Bottom Left - Code Viewer */}
              <div className="col-span-12 lg:col-span-8">
                <CodeViewer />
              </div>

              {/* Bottom Right - API Contract */}
              <div className="col-span-12 lg:col-span-4">
                <ApiContract endpoints={apiEndpoints} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
