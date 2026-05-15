import { BobBlueprint } from "./mermaidGenerator";

export interface ApiEndpoint {
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    description: string;
}

/**
 * Generates REST API contract from IBM Bob Blueprint
 */
export function generateApiContract(blueprint: BobBlueprint): ApiEndpoint[] {
    if (!blueprint || !blueprint.entities) return [];

    const endpoints: ApiEndpoint[] = [];

    blueprint.entities.forEach((entity) => {
        const resourceName = entity.name.toLowerCase();
        const singularName = entity.name;

        // List all resources
        endpoints.push({
            endpoint: `/api/v1/${resourceName}`,
            method: "GET",
            description: `List all ${resourceName} with pagination`,
        });

        // Get single resource
        endpoints.push({
            endpoint: `/api/v1/${resourceName}/:id`,
            method: "GET",
            description: `Get ${singularName} by ID`,
        });

        // Create resource
        endpoints.push({
            endpoint: `/api/v1/${resourceName}`,
            method: "POST",
            description: `Create new ${singularName}`,
        });

        // Update resource
        endpoints.push({
            endpoint: `/api/v1/${resourceName}/:id`,
            method: "PUT",
            description: `Update ${singularName}`,
        });

        // Partial update
        endpoints.push({
            endpoint: `/api/v1/${resourceName}/:id`,
            method: "PATCH",
            description: `Partially update ${singularName}`,
        });

        // Delete resource
        endpoints.push({
            endpoint: `/api/v1/${resourceName}/:id`,
            method: "DELETE",
            description: `Delete ${singularName}`,
        });
    });

    return endpoints;
}

// Made with Bob
