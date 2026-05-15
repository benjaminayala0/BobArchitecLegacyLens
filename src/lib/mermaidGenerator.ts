export interface Field {
  name: string;
  type: string;
  primary_key?: boolean;
  foreign_key?: string;
}

export interface Entity {
  name: string;
  table: string;
  fields: Field[];
}

export interface Relationship {
  from: string;
  to: string;
  type: string; // "one-to-one", "one-to-many", "many-to-one", "many-to-many"
  description?: string;
}

export interface BobBlueprint {
  entities: Entity[];
  relationships: Relationship[];
  suggested_folder_structure?: unknown;
}

/**
 * Transforms the IBM Bob JSON Blueprint into a valid Mermaid.js ER Diagram string.
 */
export function generateMermaidERDiagram(blueprint: BobBlueprint): string {
  if (!blueprint || !blueprint.entities) return "";

  let mermaidStr = "erDiagram\n";

  // 1. Define Entities and Fields
  blueprint.entities.forEach((entity) => {
    mermaidStr += `    ${entity.name} {\n`;
    entity.fields.forEach((field) => {
      const type = field.type.replace(/\s+/g, "_"); // Mermaid doesn't like spaces in types
      const pkMarker = field.primary_key ? " PK" : "";
      const fkMarker = field.foreign_key ? " FK" : "";
      mermaidStr += `        ${type} ${field.name}${pkMarker}${fkMarker}\n`;
    });
    mermaidStr += `    }\n`;
  });

  // 2. Define Relationships
  if (blueprint.relationships) {
    blueprint.relationships.forEach((rel) => {
      let relationshipLine = "";
      
      // Determine Mermaid cardinality syntax
      switch (rel.type) {
        case "one-to-many":
          relationshipLine = "||--o{";
          break;
        case "many-to-one":
          relationshipLine = "}o--||";
          break;
        case "one-to-one":
          relationshipLine = "||--||";
          break;
        case "many-to-many":
          relationshipLine = "}o--o{";
          break;
        default:
          relationshipLine = "--"; // fallback
      }

      const label = rel.description ? ` : "${rel.description}"` : " : relates";
      mermaidStr += `    ${rel.from} ${relationshipLine} ${rel.to}${label}\n`;
    });
  }

  return mermaidStr;
}
