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

const fallbackAfterCode = `// Modern TypeScript - OrderService.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@typeorm/core';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findByUserId(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items', 'customer'],
    });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(order);
  }
}`

export function CodeViewer({ blueprint }: CodeViewerProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    // Tu lógica original intacta
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

    // Lado legacy (rojo)
    const renderBeforeSide = (maxHeight: string = "max-h-[280px]") => (
        <div className="rounded-lg overflow-hidden border border-destructive/30 flex-1">
            <div className="bg-destructive/10 px-3 py-1.5 border-b border-destructive/30 flex items-center justify-between">
                <span className="text-xs font-medium text-destructive">Legacy Code</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-orange-500/15 text-orange-400 text-xs font-semibold">
                    {detectedLang}
                </span>
            </div>
            {/* ← Un solo contenedor con overflow-auto, quitamos el div intermedio */}
            <div className={`flex text-xs ${maxHeight} overflow-auto bg-secondary/30`}>
                <div className="flex flex-col bg-destructive/5 text-muted-foreground/50 font-mono py-2 px-2 border-r border-border select-none sticky left-0 shrink-0">
                    {beforeLines.map((_, i) => (
                        <span key={i} className="leading-5 text-right min-w-[2.5rem]">{i + 1}</span>
                    ))}
                </div>
                <pre className="py-2 px-3 text-muted-foreground flex-1">
                    <code className="text-xs leading-5 font-mono">
                        {beforeLines.map((line, i) => (
                            <div
                                key={i}
                                className={`leading-5 ${line.includes("mysql_") || line.includes("password") ||
                                        line.includes("cursor.execute") || line.includes("f\"") ||
                                        line.includes("$userId")
                                        ? "bg-destructive/20 text-destructive -mx-3 px-3"
                                        : ""
                                    }`}
                            >
                                {line || " "}
                            </div>
                        ))}
                    </code>
                </pre>
            </div>
        </div>
    )

    return (
        <>
            <Card className="bg-card border-border">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-bold text-foreground">
                        Before and After Code Viewer
                    </CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsExpanded(true)}>
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                        {renderBeforeSide()}
                    </div>
                </CardContent>
            </Card>

            {/* Modal pantalla completa */}
            {isExpanded && (
                <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-8">
                    <div className="h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold text-foreground">Before and After Code Viewer</h2>
                            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                            {renderBeforeSide("max-h-full")}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}