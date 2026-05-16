/**
 * API Route - DeepSeek Analysis Endpoint
 * 
 * Analyzes legacy code using DeepSeek v4 Flash through OpenRouter.
 * Returns a blueprint with entities, relationships, and folder structure.
 */

import { NextResponse } from 'next/server'
import { OpenRouter } from '@openrouter/sdk'
import type { BobBlueprint } from '@/types/blueprint'

// Initialize OpenRouter client
const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || ''
})

/**
 * System prompt that ensures DeepSeek returns valid JSON matching BobBlueprint interface
 */
const SYSTEM_PROMPT = `You are Bob, an expert software architect specializing in analyzing legacy code and designing modern database schemas.

Your task is to analyze the provided legacy code and return ONLY a valid JSON object (no markdown, no code blocks, no explanations) that matches this exact structure:

{
  "entities": [
    {
      "name": "EntityName",
      "table": "table_name",
      "fields": [
        {
          "name": "field_name",
          "type": "string|integer|decimal|boolean|date|timestamp|text",
          "primary_key": true|false (optional),
          "foreign_key": "referenced_table.field" (optional),
          "auto_increment": true|false (optional),
          "nullable": true|false (optional),
          "unique": true|false (optional)
        }
      ]
    }
  ],
  "relationships": [
    {
      "from": "EntityName1",
      "to": "EntityName2",
      "type": "one-to-one|one-to-many|many-to-one|many-to-many",
      "description": "relationship description" (optional)
    }
  ],
  "suggested_folder_structure": {
    "src": {
      "models": ["Model1.ts", "Model2.ts"],
      "controllers": ["Controller1.ts"],
      "services": ["Service1.ts"],
      "repositories": ["Repository1.ts"],
      "routes": ["routes1.ts"],
      "middleware": ["middleware1.ts"],
      "utils": ["util1.ts"],
      "config": ["config1.ts"]
    },
    "tests": {
      "unit": ["test1.test.ts"],
      "integration": ["integration1.test.ts"]
    },
    "docs": ["API.md", "DATABASE_SCHEMA.md"]
  }
}

CRITICAL RULES:
1. Return ONLY the JSON object - no markdown formatting, no code blocks, no explanations
2. All entity names must be PascalCase (e.g., "Guest", "RoomType")
3. All table names must be snake_case (e.g., "guests", "room_types")
4. All field names must be snake_case (e.g., "guest_id", "first_name")
5. Every entity must have at least one primary key field
6. Foreign keys must reference existing tables in format "table_name.field_name"
7. Include common fields like created_at, updated_at where appropriate
8. Relationship types must be exactly: "one-to-one", "one-to-many", "many-to-one", or "many-to-many"
9. The suggested_folder_structure must follow a logical MVC or layered architecture pattern
10. Include appropriate TypeScript file extensions (.ts) in the folder structure

Analyze the code carefully and identify:
- All data entities and their attributes
- Relationships between entities
- A modern, scalable folder structure for the application

Return ONLY the JSON object.`

/**
 * API route that analyzes legacy code using DeepSeek
 */
export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const body = await req.json()
    const { code } = body

    // Validate input
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: code field is required and must be a string' },
        { status: 400 }
      )
    }

    // Validate API key
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not configured')
      return NextResponse.json(
        { error: 'API configuration error: OpenRouter API key is missing' },
        { status: 500 }
      )
    }

    // Call DeepSeek through OpenRouter
    const stream = await openrouter.chat.send({
      chatRequest: {
        model: 'deepseek/deepseek-r1-distill-llama-70b',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: `Analyze this legacy code and return a JSON blueprint:\n\n${code}`
          }
        ],
        stream: true
      }
    })

    // Collect the streamed response
    let response = ''

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        response += content
      }
    }

    // Clean up the response - remove markdown code blocks if present
    let cleanedResponse = response.trim()
    
    // Remove markdown code blocks (```json ... ``` or ``` ... ```)
    if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
    }

    // Parse the JSON response
    let analysis: BobBlueprint
    try {
      analysis = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('Failed to parse DeepSeek response:', parseError)
      console.error('Raw response:', response)
      return NextResponse.json(
        { 
          error: 'Failed to parse AI response as JSON',
          details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
        },
        { status: 500 }
      )
    }

    // Validate the structure
    if (!analysis.entities || !Array.isArray(analysis.entities)) {
      return NextResponse.json(
        { error: 'Invalid response structure: missing or invalid entities array' },
        { status: 500 }
      )
    }

    if (!analysis.relationships || !Array.isArray(analysis.relationships)) {
      return NextResponse.json(
        { error: 'Invalid response structure: missing or invalid relationships array' },
        { status: 500 }
      )
    }

    if (!analysis.suggested_folder_structure || typeof analysis.suggested_folder_structure !== 'object') {
      return NextResponse.json(
        { error: 'Invalid response structure: missing or invalid suggested_folder_structure' },
        { status: 500 }
      )
    }

    // Return the analysis
    return NextResponse.json(analysis, { status: 200 })

  } catch (error) {
    console.error('Error in /api/analyze:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Internal server error during analysis',
          details: error.message
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error during analysis' },
      { status: 500 }
    )
  }
}

// Made with Bob
