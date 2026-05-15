/**
 * BobArchitecLegacyLens - Utility Library
 * 
 * This barrel file exports all utility functions for transforming IBM Bob's analysis results.
 * 
 * ## Usage Guide for Frontend Developers
 * 
 * ### 1. Mermaid ER Diagram Generator
 * ```typescript
 * import { generateMermaidERDiagram, type BobBlueprint } from '@/lib';
 * 
 * const blueprint: BobBlueprint = await fetch('/api/analyze', {
 *   method: 'POST',
 *   body: JSON.stringify({ code: legacyCode })
 * }).then(r => r.json());
 * 
 * const mermaidDiagram = generateMermaidERDiagram(blueprint);
 * // Use with mermaid.js library to render the diagram
 * ```
 * 
 * ### 2. SQL Schema Generator
 * ```typescript
 * import { generateSqlSchema, type BobBlueprint } from '@/lib';
 * 
 * const sqlScript = generateSqlSchema(blueprint);
 * // Download or display the PostgreSQL CREATE TABLE statements
 * ```
 * 
 * ### 3. API Contract Generator
 * ```typescript
 * import { generateApiContract, type BobBlueprint } from '@/lib';
 * 
 * const apiMarkdown = generateApiContract(blueprint);
 * // Display the RESTful API documentation in markdown format
 * ```
 * 
 * ### 4. ZIP Downloader
 * ```typescript
 * import { downloadZip, adaptJsonToFolderNodes } from '@/lib';
 *
 * // Create folder nodes from a simple object structure
 * const files = adaptJsonToFolderNodes({
 *   'schema.sql': sqlScript,
 *   'diagram.mmd': mermaidDiagram,
 *   'API.md': apiMarkdown
 * });
 *
 * // Download as ZIP (browser-only)
 * await downloadZip(files, 'bob-analysis-output.zip');
 * ```
 * 
 * ### Complete Workflow Example
 * ```typescript
 * import { 
 *   generateMermaidERDiagram, 
 *   generateSqlSchema, 
 *   generateApiContract,
 *   downloadZip,
 *   adaptJsonToFolderNodes,
 *   type BobBlueprint 
 * } from '@/lib';
 * 
 * async function analyzeAndDownload(legacyCode: string) {
 *   // 1. Get analysis from Bob
 *   const blueprint: BobBlueprint = await fetch('/api/analyze', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ code: legacyCode })
 *   }).then(r => r.json());
 *
 *   // 2. Generate all outputs
 *   const mermaid = generateMermaidERDiagram(blueprint);
 *   const sql = generateSqlSchema(blueprint);
 *   const api = generateApiContract(blueprint);
 *
 *   // 3. Create folder structure with content
 *   const files = adaptJsonToFolderNodes({
 *     'er-diagram.mmd': mermaid,
 *     'database-schema.sql': sql,
 *     'api-contract.md': api
 *   });
 *
 *   // 4. Download as ZIP
 *   await downloadZip(files, 'modernization-package.zip');
 * }
 * ```
 */

// Export all types from the centralized types file
export type { 
  Field, 
  Entity, 
  Relationship, 
  RelationshipType,
  FolderStructure,
  BobBlueprint 
} from '@/types/blueprint';

// Export validation utilities
export { 
  validateBlueprint, 
  sanitizeSqlIdentifier, 
  isValidSqlIdentifier 
} from '@/types/blueprint';

// Export Mermaid diagram generator
export { generateMermaidERDiagram } from './mermaidGenerator';

// Export SQL schema generator
export { generateSqlSchema } from './sqlGenerator';

// Export API contract generator
export { generateApiContract } from './apiContractGenerator';

// Export ZIP downloader utilities
export type { FolderNode } from './zipDownloader';
export { downloadZip, adaptJsonToFolderNodes } from './zipDownloader';

// Made with Bob
