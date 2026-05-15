import { NextRequest, NextResponse } from "next/server";
import { BobBlueprint } from "@/lib/mermaidGenerator";

// Mock IBM Bob response for development
const mockBlueprintResponse: BobBlueprint = {
  entities: [
    {
      name: "User",
      table: "users",
      fields: [
        { name: "id", type: "uuid", primary_key: true },
        { name: "email", type: "varchar" },
        { name: "username", type: "varchar" },
        { name: "created_at", type: "timestamp" },
      ],
    },
    {
      name: "Order",
      table: "orders",
      fields: [
        { name: "id", type: "uuid", primary_key: true },
        { name: "user_id", type: "uuid", foreign_key: "users.id" },
        { name: "status", type: "varchar" },
        { name: "total", type: "decimal" },
        { name: "created_at", type: "timestamp" },
      ],
    },
    {
      name: "Product",
      table: "products",
      fields: [
        { name: "id", type: "uuid", primary_key: true },
        { name: "name", type: "varchar" },
        { name: "price", type: "decimal" },
        { name: "stock", type: "integer" },
      ],
    },
    {
      name: "OrderItem",
      table: "order_items",
      fields: [
        { name: "id", type: "uuid", primary_key: true },
        { name: "order_id", type: "uuid", foreign_key: "orders.id" },
        { name: "product_id", type: "uuid", foreign_key: "products.id" },
        { name: "quantity", type: "integer" },
        { name: "unit_price", type: "decimal" },
      ],
    },
  ],
  relationships: [
    {
      from: "User",
      to: "Order",
      type: "one-to-many",
      description: "places",
    },
    {
      from: "Order",
      to: "OrderItem",
      type: "one-to-many",
      description: "contains",
    },
    {
      from: "Product",
      to: "OrderItem",
      type: "one-to-many",
      description: "included in",
    },
  ],
  suggested_folder_structure: {
    name: "modernized-project",
    type: "folder",
    children: [
      {
        name: "src",
        type: "folder",
        children: [
          {
            name: "entities",
            type: "folder",
            children: [
              { name: "User.ts", type: "file", content: "// User entity" },
              { name: "Order.ts", type: "file", content: "// Order entity" },
              { name: "Product.ts", type: "file", content: "// Product entity" },
              { name: "OrderItem.ts", type: "file", content: "// OrderItem entity" },
            ],
          },
          {
            name: "services",
            type: "folder",
            children: [
              { name: "UserService.ts", type: "file", content: "// User service" },
              { name: "OrderService.ts", type: "file", content: "// Order service" },
            ],
          },
          {
            name: "controllers",
            type: "folder",
            children: [
              { name: "UserController.ts", type: "file", content: "// User controller" },
              { name: "OrderController.ts", type: "file", content: "// Order controller" },
            ],
          },
        ],
      },
      { name: "package.json", type: "file", content: '{\n  "name": "modernized-project"\n}' },
      { name: "README.md", type: "file", content: "# Modernized Project" },
    ],
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Invalid request: 'code' field is required" },
        { status: 400 }
      );
    }

    // Simulate IBM Bob analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In production, this would call IBM Bob API
    // const response = await fetch('IBM_BOB_API_URL', { ... });
    // const blueprint = await response.json();

    // Return mock blueprint for now
    return NextResponse.json(mockBlueprintResponse);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze code" },
      { status: 500 }
    );
  }
}

// Made with Bob
