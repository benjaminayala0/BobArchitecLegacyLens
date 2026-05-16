/**
 * BobArchitecLegacyLens - Type Definitions
 * 
 * Single source of truth for all blueprint-related types.
 * This file consolidates type definitions to prevent duplication and ensure consistency.
 */

/**
 * Represents a field/column in a database entity
 */
export interface Field {
  name: string;
  type: string;
  primary_key?: boolean;
  foreign_key?: string;
  auto_increment?: boolean;
  nullable?: boolean;
  unique?: boolean;
}

/**
 * Represents a database entity/table
 */
export interface Entity {
  name: string;
  table: string;
  fields: Field[];
}

/**
 * Valid relationship types between entities
 */
export type RelationshipType = "one-to-one" | "one-to-many" | "many-to-one" | "many-to-many";

/**
 * Represents a relationship between two entities
 */
export interface Relationship {
  from: string;
  to: string;
  type: RelationshipType;
  description?: string;
}

/**
 * Represents a nested folder structure
 */
export interface FolderStructure {
  [key: string]: string[] | FolderStructure;
}

/**
 * API Contract endpoint definition
 */
export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  description: string;
}

/**
 * Complete blueprint structure returned by IBM watsonx.ai analysis
 */
export interface BobBlueprint {
  entities: Entity[];
  relationships: Relationship[];
  suggested_folder_structure: FolderStructure;
  original_code?: string;
  databaseSchema?: string;
  erDiagram?: string;
  folderStructure?: string;
  modernizedCode?: string;
  apiContracts?: ApiEndpoint[];
}

/**
 * Validates that a string is a safe SQL identifier
 * @param identifier - The identifier to validate
 * @returns true if valid, false otherwise
 */
export function isValidSqlIdentifier(identifier: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier);
}

/**
 * Sanitizes and validates a SQL identifier
 * @param identifier - The identifier to sanitize
 * @param context - Context for error message (e.g., "table name", "field name")
 * @returns The validated identifier
 * @throws {Error} If the identifier is invalid
 */
export function sanitizeSqlIdentifier(identifier: string, context: string = "identifier"): string {
  if (!identifier || typeof identifier !== 'string') {
    throw new Error(`Invalid ${context}: must be a non-empty string`);
  }

  const trimmed = identifier.trim();

  if (!isValidSqlIdentifier(trimmed)) {
    throw new Error(
      `Invalid ${context}: "${trimmed}". Must start with a letter or underscore, ` +
      `and contain only letters, numbers, and underscores.`
    );
  }

  return trimmed;
}

/**
 * Validates a complete blueprint structure
 * @param blueprint - The blueprint to validate
 * @throws {Error} If the blueprint is invalid
 */
export function validateBlueprint(blueprint: unknown): asserts blueprint is BobBlueprint {
  if (!blueprint || typeof blueprint !== 'object') {
    throw new Error('Invalid blueprint: must be an object');
  }

  const bp = blueprint as Partial<BobBlueprint>;

  if (!Array.isArray(bp.entities)) {
    throw new Error('Invalid blueprint: entities must be an array');
  }

  if (bp.entities.length === 0) {
    throw new Error('Invalid blueprint: entities array cannot be empty');
  }

  // Validate each entity
  bp.entities.forEach((entity, index) => {
    if (!entity.name || !entity.table || !Array.isArray(entity.fields)) {
      throw new Error(`Invalid entity at index ${index}: missing required properties`);
    }

    // Validate entity identifiers
    sanitizeSqlIdentifier(entity.name, `entity name at index ${index}`);
    sanitizeSqlIdentifier(entity.table, `table name for entity "${entity.name}"`);

    // Validate fields
    entity.fields.forEach((field, fieldIndex) => {
      if (!field.name || !field.type) {
        throw new Error(
          `Invalid field at index ${fieldIndex} in entity "${entity.name}": missing name or type`
        );
      }
      sanitizeSqlIdentifier(field.name, `field name in entity "${entity.name}"`);
    });
  });

  if (!Array.isArray(bp.relationships)) {
    throw new Error('Invalid blueprint: relationships must be an array');
  }
}

// Made with Bob