"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type BobBlueprint } from "@/lib"

interface CodeViewerProps {
    blueprint: BobBlueprint | null
}

const fallbackBeforeCode = `<?php
// Legacy PHP code - OrderController.php
class OrderController {
  
  private $db;
  
  public function __construct() {
    $this->db = mysql_connect(
      'localhost',
      'root',
      'password123'
    );
    mysql_select_db('orders');
  }
  
  public function getOrders($userId) {
    $query = "SELECT * FROM orders 
              WHERE user_id = " . $userId;
    $result = mysql_query($query);
    
    $orders = array();
    while($row = mysql_fetch_assoc($result)) {
      $orders[] = $row;
    }
    return $orders;
  }
  
  public function createOrder($data) {
    // Direct SQL insertion
    $sql = "INSERT INTO orders 
            VALUES ('" . $data['id'] . "')";
    mysql_query($sql);
  }
}`

export function CodeViewer({ blueprint }: CodeViewerProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const beforeCode = blueprint?.original_code || fallbackBeforeCode

    const detectLanguage = (code: string): string => {
        if (code.includes('import sqlite3') || code.includes('def ') || code.includes('cursor.execute')) return 'Python'
        if (code.includes('<?php') || code.includes('mysql_')) return 'PHP'
        if (code.includes('public class') || code.includes('System.out')) return 'Java'
        if (code.includes('IDENTIFICATION DIVISION') || code.includes('PERFORM')) return 'COBOL'
        return 'Legacy Code'
    }

    const detectedLang = detectLanguage(beforeCode)
    const beforeLines = beforeCode.split("\n")

    const renderCodeSide = (
        lines: string[],
        textSize: string = "text-xs",
        lineSpacing: string = "leading-5"
    ) => {
        const gutterBg = 'bg-destructive/5'

        return (
            <div className={`flex ${textSize} overflow-auto flex-1`}>
                <div className={`flex flex-col ${gutterBg} text-muted-foreground/50 font-mono py-2 px-2 border-r border-border select-none sticky left-0 shrink-0`}>
                    {lines.map((_, i) => (
                        <span key={i} className={`${lineSpacing} text-right min-w-[2.5rem]`}>
                            {i + 1}
                        </span>
                    ))}
                </div>

                <pre className="py-2 px-3 overflow-x-auto flex-1">
                    <code className={`${textSize} ${lineSpacing} font-mono whitespace-pre`}>
                        {lines.map((line, i) => (
                            <div
                                key={i}
                                className={`${lineSpacing} ${line.includes("mysql_") || line.includes("password") || line.includes("cursor.execute") || line.includes("f\"")
                                        ? "bg-destructive/20 text-destructive -mx-3 px-3"
                                        : "text-muted-foreground"
                                    }`}
                            >
                                {line || " "}
                            </div>
                        ))}
                    </code>
                </pre>
            </div>
        )
    }

    return (
        <>
            <Card className="bg-card border-border">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-foreground">
                        Original Legacy Code
                    </CardTitle>

                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsExpanded(true)}>
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center gap-3 px-4 py-2 border border-border rounded-t-lg bg-primary/5 border-b-0 shrink-0 flex-wrap">
                        <span className="text-xs font-medium text-muted-foreground mr-1">Detected Source:</span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-orange-500/15 text-orange-400 text-xs font-semibold">
                            {detectedLang}
                        </span>
                    </div>

                    <div className="border border-border rounded-b-lg overflow-hidden flex flex-col">
                        <div className="bg-secondary/30 h-[280px] flex flex-col overflow-hidden">
                            {renderCodeSide(beforeLines)}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isExpanded && (
                <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-8">
                    <div className="h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold text-foreground">Original Legacy Code</h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-3 px-4 py-2 border border-border rounded-t-lg bg-primary/5 border-b-0 shrink-0 flex-wrap mt-2">
                            <span className="text-xs font-medium text-muted-foreground mr-1">Detected Source:</span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-orange-500/15 text-orange-400 text-xs font-semibold">
                                {detectedLang}
                            </span>
                        </div>

                        <div className="flex-1 border border-border rounded-b-lg overflow-hidden flex flex-col">
                            <div className="bg-secondary/30 flex-1 flex flex-col overflow-hidden">
                                {renderCodeSide(beforeLines, 'text-sm', 'leading-6')}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
