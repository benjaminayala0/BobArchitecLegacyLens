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
import { downloadZip, adaptJsonToFolderNodes, type BobBlueprint } from "@/lib"

export default function BlueprintAI() {
  const [currentView, setCurrentView] = useState<"analyze" | "blueprint">("analyze")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [blueprintData, setBlueprintData] = useState<BobBlueprint | null>(null)
  const [originalCode, setOriginalCode] = useState<string>("")

  const handleUpload = async (files: FileList) => {
    console.log("Files uploaded:", files)
    setIsAnalyzing(true)
    setAnalysisComplete(false)

    // Read the first file
    const file = files[0]
    const code = await file.text()
    await analyzeCode(code)
  }

  const handleCodePaste = async (code: string) => {
    console.log("Code pasted:", code.substring(0, 100))
    setIsAnalyzing(true)
    setAnalysisComplete(false)
    await analyzeCode(code)
  }

  const analyzeCode = async (code: string) => {
    try {
      // Store the original code
      setOriginalCode(code)
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data: BobBlueprint = await response.json()
      // Add original code to blueprint data
      setBlueprintData({ ...data, original_code: code })
      setAnalysisComplete(true)
    } catch (error) {
      console.error('Error analyzing code:', error)
      setIsAnalyzing(false)
    }
  }

  const handleExportZip = async () => {
    if (!blueprintData) return

    try {
      const files = adaptJsonToFolderNodes(blueprintData.suggested_folder_structure)
      await downloadZip(files, 'modernized-scaffolding.zip')
    } catch (error) {
      console.error('Error exporting ZIP:', error)
    }
  }

  const handleAnalysisComplete = () => {
    setAnalysisComplete(true)
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
              <div className="col-span-12 lg:col-span-5">
                <ERDiagram blueprint={blueprintData} />
              </div>

              <div className="col-span-12 lg:col-span-4">
                <FolderScaffolding blueprint={blueprintData} />
              </div>

              <div className="col-span-12 lg:col-span-3">
                <DatabaseSchema blueprint={blueprintData} />
              </div>

              <div className="col-span-12 lg:col-span-8">
                <CodeViewer blueprint={blueprintData} />
              </div>

              <div className="col-span-12 lg:col-span-4">
                <ApiContract blueprint={blueprintData} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
