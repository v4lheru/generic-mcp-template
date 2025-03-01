/**
 * Example Tool Handlers
 * 
 * Implements the handlers for the example tools.
 * Each handler processes the tool arguments and calls the appropriate service methods.
 * This separation of tool definitions and handlers improves maintainability.
 */

import { ExampleService } from '../services/example-service.js';
import { ToolHandlers } from './example-tools.js';
import { CreateResourceData, UpdateResourceData } from '../types/example-types.js';

/**
 * Creates and returns the handlers for all example tools
 * @param exampleService - The initialized ExampleService instance
 * @returns Object mapping tool names to their handler functions
 */
export function createExampleToolHandlers(exampleService: ExampleService): ToolHandlers {
    return {
        /**
         * Handler for the get_resources tool
         * Retrieves a list of resources with optional filtering
         */
        get_resources: async (args: { status?: string; limit?: number; offset?: number }) => {
            try {
                const resources = await exampleService.getResources(args);
                return {
                    resources,
                    count: resources.length,
                    filters: args
                };
            } catch (error) {
                console.error('Error in get_resources:', error);
                throw new Error(`Failed to get resources: ${error instanceof Error ? error.message : String(error)}`);
            }
        },

        /**
         * Handler for the get_resource tool
         * Retrieves a specific resource by ID
         */
        get_resource: async (args: { resourceId: string }) => {
            try {
                if (!args.resourceId) {
                    throw new Error('resourceId is required');
                }

                const resource = await exampleService.getResource(args.resourceId);
                return resource;
            } catch (error) {
                console.error(`Error in get_resource for ID ${args.resourceId}:`, error);
                throw new Error(`Failed to get resource: ${error instanceof Error ? error.message : String(error)}`);
            }
        },

        /**
         * Handler for the create_resource tool
         * Creates a new resource with the provided data
         */
        create_resource: async (args: CreateResourceData) => {
            try {
                if (!args.name) {
                    throw new Error('name is required');
                }

                const resource = await exampleService.createResource(args);
                return {
                    message: `Resource created successfully with ID: ${resource.id}`,
                    resource
                };
            } catch (error) {
                console.error('Error in create_resource:', error);
                throw new Error(`Failed to create resource: ${error instanceof Error ? error.message : String(error)}`);
            }
        },

        /**
         * Handler for the update_resource tool
         * Updates an existing resource with new data
         */
        update_resource: async (args: UpdateResourceData & { resourceId: string }) => {
            try {
                if (!args.resourceId) {
                    throw new Error('resourceId is required');
                }

                // Extract resourceId from args and pass the rest as update data
                const { resourceId, ...updateData } = args;

                const resource = await exampleService.updateResource(resourceId, updateData);
                return {
                    message: `Resource ${resourceId} updated successfully`,
                    resource
                };
            } catch (error) {
                console.error(`Error in update_resource for ID ${args.resourceId}:`, error);
                throw new Error(`Failed to update resource: ${error instanceof Error ? error.message : String(error)}`);
            }
        },

        /**
         * Handler for the delete_resource tool
         * Deletes a resource after confirmation
         */
        delete_resource: async (args: { resourceId: string; confirm: boolean }) => {
            try {
                if (!args.resourceId) {
                    throw new Error('resourceId is required');
                }

                if (!args.confirm) {
                    throw new Error('Deletion must be confirmed by setting confirm=true');
                }

                await exampleService.deleteResource(args.resourceId);
                return {
                    message: `Resource ${args.resourceId} deleted successfully`
                };
            } catch (error) {
                console.error(`Error in delete_resource for ID ${args.resourceId}:`, error);
                throw new Error(`Failed to delete resource: ${error instanceof Error ? error.message : String(error)}`);
            }
        },

        /**
         * Handler for the search_resources tool
         * Searches for resources by name or other criteria
         */
        search_resources: async (args: { query: string; tags?: string[]; status?: string }) => {
            try {
                if (!args.query) {
                    throw new Error('query is required');
                }

                // For simplicity, we're just using the name search here
                // In a real implementation, you might have a more sophisticated search
                const resources = await exampleService.searchResourcesByName(args.query);

                // Apply additional filters if provided
                let filteredResources = resources;

                if (args.status) {
                    filteredResources = filteredResources.filter(r => r.status === args.status);
                }

                if (args.tags && args.tags.length > 0) {
                    filteredResources = filteredResources.filter(r =>
                        r.tags.some(tag => args.tags!.includes(tag))
                    );
                }

                return {
                    resources: filteredResources,
                    count: filteredResources.length,
                    query: args.query,
                    filters: {
                        tags: args.tags,
                        status: args.status
                    }
                };
            } catch (error) {
                console.error(`Error in search_resources for query "${args.query}":`, error);
                throw new Error(`Failed to search resources: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
    };
}
