/**
 * API Route - IBM watsonx.ai Analysis Endpoint
 * 
 * Analyzes legacy code using IBM watsonx.ai (Granite 3.3 8B Instruct).
 * Returns a blueprint with entities, relationships, folder structure, and modernized code.
 */

import { NextResponse } from 'next/server'
import type { BobBlueprint } from '@/types/blueprint'

/**
 * Authenticate with IBM Cloud IAM to get a Bearer token
 */
async function getIAMToken(apiKey: string): Promise<string> {
  const response = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
      apikey: apiKey,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`IAM authentication failed: ${error}`)
  }

  const data = await response.json()
  return data.access_token
}

/**
 * Extract code files from a base64-encoded ZIP
 */
async function extractZipFiles(zipBase64: string): Promise<string> {
  try {
    // Dynamic import of JSZip
    const JSZip = (await import('jszip')).default

    // Decode base64 to binary
    const binaryString = atob(zipBase64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // Load ZIP
    const zip = await JSZip.loadAsync(bytes)

    // Extract code files
    let concatenatedCode = ''
    const codeExtensions = ['.java', '.php', '.py', '.js', '.ts', '.tsx', '.jsx', '.sql', '.cobol', '.cob', '.c', '.cpp', '.h', '.cs', '.rb', '.go']
    const skipDirs = ['node_modules', '.git', 'dist', 'build', 'target', '.next', 'out']

    for (const [filename, file] of Object.entries(zip.files)) {
      // Skip directories
      if (file.dir) continue

      // Skip binary files and excluded directories
      const isInSkipDir = skipDirs.some(dir => filename.includes(`${dir}/`) || filename.startsWith(`${dir}/`))
      if (isInSkipDir) continue

      // Check if it's a code file
      const hasCodeExtension = codeExtensions.some(ext => filename.toLowerCase().endsWith(ext))
      if (!hasCodeExtension) continue

      // Extract text content
      const content = await file.async('text')
      concatenatedCode += `\n\n// ========== FILE: ${filename} ==========\n\n${content}`
    }

    return concatenatedCode || 'No code files found in ZIP'
  } catch (error) {
    console.error('Error extracting ZIP:', error)
    throw new Error('Failed to extract ZIP file')
  }
}

/**
 * System prompt for IBM watsonx.ai
 */
const SYSTEM_PROMPT = `You are a software architect. Analyze the legacy code and return ONLY this JSON, no markdown, no explanations:

{
  "entities": [{"name": "Name", "table": "table", "fields": [{"name": "id", "type": "integer", "primary_key": true}]}],
  "relationships": [{"from": "Entity1", "to": "Entity2", "type": "one-to-many", "description": "desc"}],
  "suggested_folder_structure": {"src": {"controllers": ["Controller.ts"], "services": ["Service.ts"], "models": ["Model.ts"]}},
  "databaseSchema": "CREATE TABLE example (id SERIAL PRIMARY KEY);",
  "erDiagram": "erDiagram\n  Entity1 {\n    int id PK\n  }",
  "folderStructure": "src/\n  controllers/\n  services/\n  models/",
  "modernizedCode": "// TypeScript modernized version\nexport class Service {}",
  "apiContracts": [{"method": "GET", "endpoint": "/api/resource", "description": "Get resources"}]
}

RULES:
- Return ONLY valid JSON, nothing else
- Maximum 5 entities
- Maximum 3 relationships  
- modernizedCode: max 20 lines
- databaseSchema: max 3 tables
- The JSON must be 100% complete and valid`

/**
 * API route handler
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { code, zipBase64 } = body

    let codeToAnalyze: string
    if (zipBase64) {
      codeToAnalyze = await extractZipFiles(zipBase64)
    } else if (code) {
      codeToAnalyze = code
    } else {
      return NextResponse.json(
        { success: false, error: 'Either code or zipBase64 must be provided' },
        { status: 400 }
      )
    }

    const apiKey = process.env.WATSONX_API_KEY
    const projectId = process.env.WATSONX_PROJECT_ID
    const watsonxUrl = process.env.WATSONX_URL

    if (!apiKey || !projectId || !watsonxUrl) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const accessToken = await getIAMToken(apiKey)

    // Helper to call watsonx
    const callWatsonx = async (systemPrompt: string, userMessage: string) => {
      const response = await fetch(
        `${watsonxUrl}/ml/v1/text/chat?version=2024-05-31`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            model_id: 'ibm/granite-4-h-small',
            project_id: projectId,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage },
            ],
            parameters: { max_tokens: 5000, temperature: 0.1 },
          }),
        }
      )
      if (!response.ok) {
        const err = await response.text()
        throw new Error(`watsonx error: ${err}`)
      }
      const data = await response.json()
      return data.choices?.[0]?.message?.content ?? ''
    }

    const parseJSON = (text: string) => {
      let cleaned = text.trim()
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim()
      const first = cleaned.indexOf('{')
      const last = cleaned.lastIndexOf('}')
      if (first !== -1 && last !== -1) cleaned = cleaned.substring(first, last + 1)

      // Fix unescaped control characters inside JSON strings
      let result = ''
      let inString = false
      let escaped = false

      for (let i = 0; i < cleaned.length; i++) {
        const char = cleaned[i]

        if (escaped) {
          result += char
          escaped = false
          continue
        }

        if (char === '\\') {
          escaped = true
          result += char
          continue
        }

        if (char === '"') {
          inString = !inString
          result += char
          continue
        }

        if (inString) {
          if (char === '\n') { result += '\\n'; continue }
          if (char === '\r') { result += '\\r'; continue }
          if (char === '\t') { result += '\\t'; continue }
        }

        result += char
      }

      cleaned = result

      // Remove trailing commas in arrays and objects (common LLM mistake)
      cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']')

      try {
        return JSON.parse(cleaned)
      } catch {
        try {
          // Close unterminated string
          let inStr = false
          let esc = false
          for (let i = 0; i < cleaned.length; i++) {
            const c = cleaned[i]
            if (esc) { esc = false; continue }
            if (c === '\\') { esc = true; continue }
            if (c === '"') inStr = !inStr
          }
          if (inStr) cleaned += '"'

          cleaned = cleaned.replace(/,\s*$/, '')

          const openBrackets = (cleaned.match(/\[/g) || []).length
          const closeBrackets = (cleaned.match(/\]/g) || []).length
          const openBraces = (cleaned.match(/{/g) || []).length
          const closeBraces = (cleaned.match(/}/g) || []).length

          cleaned += ']'.repeat(Math.max(0, openBrackets - closeBrackets))
          cleaned += '}'.repeat(Math.max(0, openBraces - closeBraces))

          return JSON.parse(cleaned)
        } catch (e) {
          console.error("Critical JSON parse failure after recovery attempts:", e);
          throw new Error("Invalid JSON format from AI model");
        }
      }
    }

    // Call 1: entities, relationships, folder structure
    const structurePrompt = `You are a software architect. Return ONLY minified JSON (no spaces, no newlines between fields). Analyze the actual code provided.

Example format (minified):
{"entities":[{"name":"User","table":"users","fields":[{"name":"id","type":"integer","primary_key":true},{"name":"name","type":"text"}]}],"relationships":[{"from":"User","to":"Order","type":"one-to-many","description":"user has orders"}],"suggested_folder_structure":{"src":{"controllers":["UserController.ts"],"services":["UserService.ts"],"models":["User.ts"]}},"folderStructure":"src/\n  controllers/\n    UserController.ts\n  services/\n    UserService.ts\n  models/\n    User.ts"}

RULES:
- Output MINIFIED JSON only - no pretty printing
- Analyze the ACTUAL code, use real entity names from it
- Max 6 entities, max 5 relationships
- Max 3 files per folder
- Return ONLY complete valid minified JSON`

    const codePrompt = `You are a software architect. Analyze the provided legacy code (any language).

Return ONLY minified valid JSON, no markdown:

{"databaseSchema":"CREATE TABLE real_table (id SERIAL PRIMARY KEY, field VARCHAR(255) NOT NULL);","erDiagram":"erDiagram\n  EntityA {\n    int id PK\n    string field\n  }\n  EntityA ||--o{ EntityB : has","apiContracts":[{"method":"POST","endpoint":"/api/resource","description":"based on actual function"}]}

RULES:
- databaseSchema: PostgreSQL ONLY (SERIAL, VARCHAR, DECIMAL, TIMESTAMP, BOOLEAN), based on ACTUAL tables found
- erDiagram: valid Mermaid.js with entity attributes inside {} AND relationships
- apiContracts: based on ACTUAL functions found, max 6 endpoints
- NO modernizedCode field
- Return ONLY complete valid minified JSON`

    const modernPrompt = `You are a software architect. Analyze the legacy code and return a modernized TypeScript version.

Return ONLY minified valid JSON:
{"modernizedCode":"// Modernized TypeScript\\nclass Service {\\n  async method(): Promise<void> {}\\n}"}

CRITICAL RULES:
- Maximum 15 lines
- NO template literals with backtick characters - use single or double quotes only
- NO string interpolation with backticks
- Escape ALL newlines as \\n in the JSON string
- Focus only on the most critical fix (SQL injection OR separation of concerns)
- Return ONLY complete valid minified JSON`


    const [structureText, codeText, modernText] = await Promise.all([
      callWatsonx(structurePrompt, `Legacy code:\n\n${codeToAnalyze}`),
      callWatsonx(codePrompt, `Legacy code:\n\n${codeToAnalyze}`),
      callWatsonx(modernPrompt, `Legacy code:\n\n${codeToAnalyze}`),
    ])

    let structureData: any
    let codeData: any
    let modernData: any

    try { structureData = parseJSON(structureText) }
    catch (e) {
      console.error('Structure parse error:', e)
      console.error('Structure raw text:', structureText)
      structureData = {
        entities: [],
        relationships: [],
        suggested_folder_structure: {}
      }
    }

    try { codeData = parseJSON(codeText) }
    catch (e) {
      console.error('Code parse error:', e)
      codeData = { databaseSchema: "", erDiagram: "", apiContracts: [] }
    }

    try { modernData = parseJSON(modernText) }
    catch (e) {
      console.error('Modern parse error:', e)
      modernData = { modernizedCode: '// Could not generate modernized code' }
    }

    const analysis: BobBlueprint = {
      ...structureData,
      ...codeData,
      ...modernData,
      original_code: codeToAnalyze,
    }

    if (!analysis.entities || !Array.isArray(analysis.entities)) {
      throw new Error('Invalid response: missing entities')
    }

    return NextResponse.json(analysis, { status: 200 })

  } catch (error) {
    console.error('Error in /api/analyze:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
// Made with Bob
