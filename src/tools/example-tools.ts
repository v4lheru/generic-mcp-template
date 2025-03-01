/**
 * Example Tools
 * 
 * Defines the tools that will be exposed through the MCP server.
 * Each tool includes a name, description, and input schema.
 * This modular approach allows easy addition of new tools.
 */

/**
 * Defines the tools related to example resources
 * Each tool has a name, description, and input schema following JSON Schema format
 */
export const exampleTools = [
    {
        name: "get_resources",
        description: "Retrieve a list of resources with optional filtering. Use this tool to get an overview of available resources or to search for specific ones using filters.",
        inputSchema: {
            type: "object",
            properties: {
                status: {
                    type: "string",
                    enum: ["active", "inactive", "pending", "archived"],
                    description: "Filter resources by status"
                },
                limit: {
                    type: "number",
                    description: "Maximum number of resources to return (default: 20, max: 100)"
                },
                offset: {
                    type: "number",
                    description: "Number of resources to skip for pagination"
                }
            }
        }
    },
    {
        name: "get_resource",
        description: "Retrieve detailed information about a specific resource by ID. Use this when you need comprehensive details about a particular resource.",
        inputSchema: {
            type: "object",
            properties: {
                resourceId: {
                    type: "string",
                    description: "ID of the resource to retrieve"
                }
            },
            required: ["resourceId"]
        }
    },
    {
        name: "create_resource",
        description: "Create a new resource with the specified properties. Use this tool when you need to add a new resource to the system.",
        inputSchema: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "Name of the resource"
                },
                description: {
                    type: "string",
                    description: "Detailed description of the resource"
                },
                status: {
                    type: "string",
                    enum: ["active", "inactive", "pending", "archived"],
                    description: "Initial status of the resource (defaults to 'pending')"
                },
                priority: {
                    type: "number",
                    enum: [1, 2, 3, 4],
                    description: "Priority level (1-4, where 1 is highest)"
                },
                tags: {
                    type: "array",
                    items: { type: "string" },
                    description: "Tags to associate with the resource"
                },
                metadata: {
                    type: "object",
                    description: "Custom metadata for the resource"
                }
            },
            required: ["name"]
        }
    },
    {
        name: "update_resource",
        description: "Update an existing resource with new properties. Use this tool to modify resource details, status, or metadata.",
        inputSchema: {
            type: "object",
            properties: {
                resourceId: {
                    type: "string",
                    description: "ID of the resource to update"
                },
                name: {
                    type: "string",
                    description: "New name for the resource"
                },
                description: {
                    type: "string",
                    description: "New description for the resource"
                },
                status: {
                    type: "string",
                    enum: ["active", "inactive", "pending", "archived"],
                    description: "New status for the resource"
                },
                priority: {
                    type: ["number", "null"],
                    enum: [1, 2, 3, 4, null],
                    description: "New priority level (1-4, where 1 is highest, or null to clear)"
                },
                tags: {
                    type: "array",
                    items: { type: "string" },
                    description: "New tags for the resource (replaces existing tags)"
                },
                metadata: {
                    type: "object",
                    description: "New metadata for the resource (merged with existing metadata)"
                }
            },
            required: ["resourceId"]
        }
    },
    {
        name: "delete_resource",
        description: "Permanently remove a resource. Use this tool with caution as deletion cannot be undone.",
        inputSchema: {
            type: "object",
            properties: {
                resourceId: {
                    type: "string",
                    description: "ID of the resource to delete"
                },
                confirm: {
                    type: "boolean",
                    description: "Confirmation flag to prevent accidental deletion"
                }
            },
            required: ["resourceId", "confirm"]
        }
    },
    {
        name: "search_resources",
        description: "Search for resources by name or other criteria. Use this tool when you need to find specific resources based on search terms.",
        inputSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Search query (matches against resource names and descriptions)"
                },
                tags: {
                    type: "array",
                    items: { type: "string" },
                    description: "Filter by tags (resources must have at least one matching tag)"
                },
                status: {
                    type: "string",
                    enum: ["active", "inactive", "pending", "archived"],
                    description: "Filter by status"
                }
            },
            required: ["query"]
        }
    }
];

/**
 * Handler function type for tool execution
 */
export type ToolHandler = (args: any) => Promise<any>;

/**
 * Maps tool names to their handler functions
 * This allows for easy lookup of the appropriate handler when a tool is called
 */
export interface ToolHandlers {
    [toolName: string]: ToolHandler;
}
