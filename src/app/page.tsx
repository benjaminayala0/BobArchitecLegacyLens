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

export default function BlueprintAI() {
  const [currentView, setCurrentView] = useState<"analyze" | "blueprint">("analyze")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)

  const handleUpload = (files: FileList) => {
    console.log("Files uploaded:", files)
    setIsAnalyzing(true)
    setAnalysisComplete(false)
  }

  const handleCodePaste = (code: string) => {
    console.log("Code pasted:", code.substring(0, 100))
    setIsAnalyzing(true)
    setAnalysisComplete(false)
  }

  const handleAnalysisComplete = () => {
    setAnalysisComplete(true)
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
          /* Smart Analysis Dashboard */
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                1. Smart Analysis Dashboard
              </h1>
              <Sparkles className="h-5 w-5 text-primary" />
            </div>

            <div className="max-w-3xl">
              <UploadZone onUpload={handleUpload} onCodePaste={handleCodePaste} />
            </div>

            {isAnalyzing && (
              <div className="max-w-3xl">
                <AnalysisPanel isAnalyzing={isAnalyzing} onComplete={handleAnalysisComplete} />
              </div>
            )}

            {analysisComplete && (
              <Button
                className="gap-2"
                onClick={() => setCurrentView("blueprint")}
              >
                View Blueprint
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
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

              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Download className="h-4 w-4" />
                Export Modernized Scaffolding ZIP
              </Button>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-12 gap-4">
              {/* Left Column - ER Diagram */}
              <div className="col-span-12 lg:col-span-5">
                <ERDiagram />
              </div>

              {/* Middle Column - Folder Scaffolding */}
              <div className="col-span-12 lg:col-span-4">
                <FolderScaffolding />
              </div>

              {/* Right Column - Database Schema */}
              <div className="col-span-12 lg:col-span-3">
                <DatabaseSchema />
              </div>

              {/* Bottom Left - Code Viewer */}
              <div className="col-span-12 lg:col-span-8">
                <CodeViewer />
              </div>

              {/* Bottom Right - API Contract */}
              <div className="col-span-12 lg:col-span-4">
                <ApiContract />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
