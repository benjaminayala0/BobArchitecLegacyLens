"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Maximize2 } from "lucide-react"
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

  async findOne(id: string): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id },
    });
  }
}`

export function CodeViewer({ blueprint }: CodeViewerProps) {
    // For now, we'll use the fallback code since we don't have original code in the blueprint
    // In a real implementation, you might want to store the original code and generate modernized code
    const beforeCode = fallbackBeforeCode
    const afterCode = fallbackAfterCode

    return (
        <Card className="bg-card border-border">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-foreground">
                    Before and After Code Viewer
                </CardTitle>

                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Maximize2 className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-2 gap-3">
                    {/* Before Code - Legacy */}
                    <div className="rounded-lg overflow-hidden border border-destructive/30">
                        <div className="bg-destructive/10 px-3 py-1.5 border-b border-destructive/30">
                            <span className="text-xs font-medium text-destructive">Legacy Code</span>
                        </div>

                        <div className="bg-secondary/30 overflow-hidden">
                            <div className="flex text-xs max-h-[280px] overflow-auto">
                                <div className="flex flex-col bg-destructive/5 text-muted-foreground/50 font-mono py-2 px-2 border-r border-border select-none">
                                    {beforeCode.split("\n").map((_, i) => (
                                        <span key={i} className="leading-5 text-right">
                                            {i + 1}
                                        </span>
                                    ))}
                                </div>

                                <pre className="py-2 px-3 text-muted-foreground overflow-x-auto flex-1">
                                    <code className="text-xs leading-5 font-mono">
                                        {beforeCode.split("\n").map((line, i) => (
                                            <div
                                                key={i}
                                                className={`leading-5 ${line.includes("mysql_") || line.includes("password") || line.includes("$userId")
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
                    </div>

                    {/* After Code - Modern */}
                    <div className="rounded-lg overflow-hidden border border-primary/30">
                        <div className="bg-primary/10 px-3 py-1.5 border-b border-primary/30">
                            <span className="text-xs font-medium text-primary">Modernized Code</span>
                        </div>

                        <div className="bg-secondary/30 overflow-hidden">
                            <div className="flex text-xs max-h-[280px] overflow-auto">
                                <div className="flex flex-col bg-primary/5 text-muted-foreground/50 font-mono py-2 px-2 border-r border-border select-none">
                                    {afterCode.split("\n").map((_, i) => (
                                        <span key={i} className="leading-5 text-right">
                                            {i + 1}
                                        </span>
                                    ))}
                                </div>

                                <pre className="py-2 px-3 overflow-x-auto flex-1">
                                    <code className="text-xs leading-5 font-mono">
                                        {afterCode.split("\n").map((line, i) => (
                                            <div
                                                key={i}
                                                className={`leading-5 ${line.includes("@Injectable") || line.includes("@InjectRepository") || line.includes("async")
                                                    ? "text-primary"
                                                    : line.includes("import")
                                                        ? "text-chart-2"
                                                        : "text-foreground/80"
                                                    }`}
                                            >
                                                {line || " "}
                                            </div>
                                        ))}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
