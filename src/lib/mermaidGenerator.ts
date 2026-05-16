/**
 * Mermaid ER Diagram Generator
 * 
 * Transforms IBM Bob's blueprint into Mermaid.js ER diagram syntax.
 */

import { BobBlueprint, Entity, Field, Relationship, validateBlueprint } from '@/types/blueprint'

/**
 * Transforms the IBM Bob JSON Blueprint into a valid Mermaid.js ER Diagram string.
 * @param blueprint - The analyzed blueprint from IBM Bob
 * @returns Mermaid diagram syntax as a string
 * @throws {Error} If blueprint is invalid or missing required data
 */
export function generateMermaidERDiagram(blueprint: BobBlueprint): string {
  // Validate the blueprint structure
  validateBlueprint(blueprint)

  let mermaidStr = "erDiagram\n"

  // 1. Define Entities and Fields
  blueprint.entities.forEach((entity: Entity) => {
    mermaidStr += `    ${entity.name} {\n`
    entity.fields.forEach((field: Field) => {
      const type = field.type.replace(/\s+/g, "_") // Mermaid doesn't like spaces in types
      const pkMarker = field.primary_key ? " PK" : ""
      const fkMarker = field.foreign_key ? " FK" : ""
      mermaidStr += `        ${type} ${field.name}${pkMarker}${fkMarker}\n`
    })
    mermaidStr += `    }\n`
  })

  // 2. Define Relationships
  if (blueprint.relationships && blueprint.relationships.length > 0) {
    blueprint.relationships.forEach((rel: Relationship) => {
      let relationshipLine = ""
      
      // Determine Mermaid cardinality syntax based on relationship type
      switch (rel.type) {
        case "one-to-many":
          relationshipLine = "||--o{"
          break
        case "many-to-one":
          relationshipLine = "}o--||"
          break
        case "one-to-one":
          relationshipLine = "||--||"
          break
        case "many-to-many":
          relationshipLine = "}o--o{"
          break
        default:
          // TypeScript will catch this at compile time due to RelationshipType union
          relationshipLine = "--" // fallback for runtime safety
      }

      const label = rel.description ? ` : "${rel.description}"` : " : relates"
      mermaidStr += `    ${rel.from} ${relationshipLine} ${rel.to}${label}\n`
    })
  }

  return mermaidStr
}

// Made with Bob
