"use client"

import { useState, useRef } from "react"
import { Cloud, Upload, FileCode, FolderArchive, ClipboardPaste } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface UploadZoneProps {
    onUpload?: (files: FileList) => void
    onCodePaste?: (code: string) => void
}

export function UploadZone({ onUpload, onCodePaste }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [showPasteArea, setShowPasteArea] = useState(false)
    const [pastedCode, setPastedCode] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && onUpload) {
            onUpload(e.dataTransfer.files)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleFileSelect = () => {
        fileInputRef.current?.click()
    }

    const handlePasteSubmit = () => {
        if (pastedCode && onCodePaste) {
            onCodePaste(pastedCode)
        }
    }

    return (
        <Card className={`border-dashed border-2 transition-all duration-300 ${isDragging
            ? "border-primary bg-primary/10 scale-[1.02]"
            : "border-border bg-secondary/30 hover:border-primary/50"
            }`}>
            <CardContent className="p-0">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".zip,.java,.php,.sql,.py,.js,.ts"
                    multiple
                    onChange={(e) => e.target.files && onUpload?.(e.target.files)}
                />

                {!showPasteArea ? (
                    <div
                        className="flex flex-col items-center justify-center py-16 px-8 cursor-pointer rounded-lg"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={handleFileSelect}
                    >
                        <div className="relative mb-6">
                            {/* Animated glow effect */}
                            <div className={`absolute inset-0 bg-primary/30 blur-2xl rounded-full transition-all duration-500 ${isDragging ? "scale-150 opacity-100" : "scale-100 opacity-50"
                                }`} />
                            <div className="relative flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 border border-primary/30">
                                <Cloud className="h-10 w-10 text-primary" />
                                <Upload className="absolute -bottom-1 -right-1 h-6 w-6 text-primary bg-card rounded-full p-1" />
                            </div>
                        </div>

                        <p className="text-center text-foreground font-medium mb-2 text-lg">
                            Drag & Drop Legacy Repository (ZIP, Folder)
                        </p>

                        <p className="text-center text-muted-foreground text-sm mb-6">
                            or Paste Code Here
                        </p>

                        <div className="flex gap-3">
                            <Button variant="outline" size="sm" className="gap-2" onClick={(e) => {
                                e.stopPropagation()
                                handleFileSelect()
                            }}>
                                <FolderArchive className="h-4 w-4" />
                                Upload ZIP
                            </Button>

                            <Button variant="outline" size="sm" className="gap-2" onClick={(e) => {
                                e.stopPropagation()
                                setShowPasteArea(true)
                            }}>
                                <ClipboardPaste className="h-4 w-4" />
                                Paste Code
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 mt-6 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <FileCode className="h-3 w-3" />
                                .java
                            </span>

                            <span className="flex items-center gap-1">
                                <FileCode className="h-3 w-3" />
                                .php
                            </span>

                            <span className="flex items-center gap-1">
                                <FileCode className="h-3 w-3" />
                                .sql
                            </span>

                            <span className="flex items-center gap-1">
                                <FileCode className="h-3 w-3" />
                                .cobol
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-foreground font-medium">Paste your legacy code</p>

                            <Button variant="ghost" size="sm" onClick={() => setShowPasteArea(false)}>
                                Cancel
                            </Button>
                        </div>

                        <Textarea
                            placeholder="// Paste your legacy code here...
public class LegacyService {
    public void processOrder(int orderId) {
        // Legacy implementation
    }
}"
                            className="min-h-[200px] font-mono text-sm bg-secondary/50"
                            value={pastedCode}
                            onChange={(e) => setPastedCode(e.target.value)}
                        />

                        <Button className="w-full gap-2" onClick={handlePasteSubmit}>
                            <Upload className="h-4 w-4" />
                            Analyze Code
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
