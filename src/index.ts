#!/usr/bin/env node

/**
 * Generic MCP Server Template
 * 
 * A modular, extensible Model Context Protocol server template.
 * This template provides a foundation for building MCP servers with:
 * 
 * - Modular architecture with clear separation of concerns
 * - Small, focused files for better maintainability
 * - Easy extension points for adding new tools and services
 * - Comprehensive error handling and logging
 * - Type safety throughout the codebase
 * 
 * The server is organized into:
 * - Services: Handle external API communication and data processing
 * - Tools: Define the MCP tools exposed to clients
 * - Types: Define the data structures used throughout the application
 * 
 * To extend this template:
 * 1. Create new service classes in the services/ directory
 * 2. Define new tool schemas in the tools/ directory
 * 3. Implement tool handlers that use your services
 * 4. Register your tools and handlers in this file
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    McpError,
    ErrorCode
} from "@modelcontextprotocol/sdk/types.js";

import config from "./config.js";
import { ExampleService } from "./services/example-service.js";
import { exampleTools } from "./tools/example-tools.js";
import { createExampleToolHandlers } from "./tools/example-tool-handlers.js";

/**
 * Main function that initializes and starts the MCP server
 */
async function main() {
    try {
        console.log("Initializing Generic MCP Server Template...");

        // Initialize services
        const exampleService = ExampleService.initialize(config.apiKey);

        // Create tool handlers
        const exampleToolHandlers = createExampleToolHandlers(exampleService);

        // Create MCP server
        const server = new Server(
            {
                name: "generic-mcp-template",
                version: "0.1.0",
            },
            {
                capabilities: {
                    tools: {},
                }
            }
        );

        // Set up error handling
        server.onerror = (error) => {
            console.error("[MCP Server Error]", error);
        };

        // Handle process termination
        process.on("SIGINT", async () => {
            console.log("Shutting down server...");
            await server.close();
            process.exit(0);
        });

        // Register tool list handler
        server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: exampleTools
            };
        });

        // Register tool call handler
        server.setRequestHandler(CallToolRequestSchema, async (request) => {
            try {
                const toolName = request.params.name;
                const handler = exampleToolHandlers[toolName];

                if (!handler) {
                    throw new McpError(
                        ErrorCode.MethodNotFound,
                        `Unknown tool: ${toolName}`
                    );
                }

                // Execute the tool handler with the provided arguments
                const result = await handler(request.params.arguments);

                // Return the result
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                };
            } catch (error) {
                console.error("Error handling tool call:", error);

                // If it's already an MCP error, rethrow it
                if (error instanceof McpError) {
                    throw error;
                }

                // Otherwise, wrap it in an MCP error
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error: ${error instanceof Error ? error.message : String(error)}`
                        }
                    ],
                    isError: true
                };
            }
        });

        // Connect to transport
        const transport = new StdioServerTransport();
        await server.connect(transport);

        console.log("Generic MCP Server Template running on stdio");
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

// Start the server
main().catch(console.error);
