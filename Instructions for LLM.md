# Instructions for Creating an MCP Server

This document provides comprehensive guidance for Language Models (LLMs) on how to create a Model Context Protocol (MCP) server. These instructions emphasize modularity, organization, and maintainability as core requirements.

## Core Requirements

When creating an MCP server, you **MUST** adhere to these fundamental principles:

1. **Modularity**: Break down functionality into logical, self-contained modules with clear responsibilities.
2. **Smaller Files**: Keep individual files focused and concise (ideally under 300 lines) to reduce cognitive load and make them easier to ingest.
3. **Clear Organization**: Follow a consistent directory structure that separates concerns.
4. **Type Safety**: Use TypeScript with proper type definitions throughout the codebase.
5. **Comprehensive Documentation**: Document all components, interfaces, and extension points.

## Project Structure

Organize your MCP server using this structure:

```
mcp-server/
├── src/
│   ├── services/       # Service classes for API interactions
│   │   ├── base-service.ts        # Abstract base service with common functionality
│   │   └── specific-service.ts    # Concrete service implementations
│   ├── tools/          # MCP tool definitions and handlers
│   │   ├── tool-definitions.ts    # Tool schemas (name, description, inputSchema)
│   │   └── tool-handlers.ts       # Tool implementation logic
│   ├── types/          # TypeScript type definitions
│   │   └── domain-types.ts        # Domain-specific type definitions
│   ├── config.ts       # Configuration management
│   └── index.ts        # Main entry point
├── .env.example        # Example environment variables
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Step-by-Step Implementation Guide

### 1. Set Up Project Structure

Begin by creating the directory structure and configuration files:

```bash
mkdir -p src/{services,tools,types}
touch src/config.ts src/index.ts
```

### 2. Define Configuration Management

Create a centralized configuration system in `config.ts` that:
- Loads environment variables
- Provides type-safe access to configuration
- Validates required settings
- Handles command-line arguments

Example:
```typescript
// src/config.ts
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface Config {
    apiKey: string;
    serviceUrl: string;
    // Add other configuration properties
}

// Create and validate configuration
const config: Config = {
    apiKey: process.env.API_KEY || '',
    serviceUrl: process.env.SERVICE_URL || 'https://api.example.com',
    // Add other properties
};

// Validate required fields
const missingEnvVars = Object.entries(config)
    .filter(([key, value]) => {
        // Check required fields
        if (key === 'apiKey') return !value;
        return false;
    })
    .map(([key]) => key);

if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export default config;
```

### 3. Create Base Service Class

Implement a base service class that handles common functionality:
- HTTP requests with axios
- Error handling
- Rate limiting
- Logging

Example:
```typescript
// src/services/base-service.ts
import axios, { AxiosInstance } from 'axios';

export abstract class BaseService {
    protected client: AxiosInstance;
    
    constructor(baseURL: string, headers: Record<string, string>) {
        this.client = axios.create({
            baseURL,
            headers
        });
        
        // Add interceptors for error handling, rate limiting, etc.
    }
    
    // Common methods for API requests, error handling, etc.
}
```

### 4. Implement Domain-Specific Services

Create service classes that extend the base service and implement domain-specific functionality:

```typescript
// src/services/specific-service.ts
import { BaseService } from './base-service.js';
import config from '../config.js';
import { ResourceType } from '../types/domain-types.js';

export class SpecificService extends BaseService {
    // Implement singleton pattern if needed
    private static instance: SpecificService;
    
    private constructor() {
        super(config.serviceUrl, {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
        });
    }
    
    public static getInstance(): SpecificService {
        if (!SpecificService.instance) {
            SpecificService.instance = new SpecificService();
        }
        return SpecificService.instance;
    }
    
    // Implement domain-specific methods
    async getResources(): Promise<ResourceType[]> {
        // Implementation
    }
    
    // Other methods...
}
```

### 5. Define Type Definitions

Create clear type definitions for your domain objects:

```typescript
// src/types/domain-types.ts
export interface ResourceType {
    id: string;
    name: string;
    // Other properties
}

export interface CreateResourceData {
    name: string;
    // Other properties
}

// Other type definitions...
```

### 6. Define MCP Tools

Define the tools that your MCP server will expose:

```typescript
// src/tools/tool-definitions.ts
export const tools = [
    {
        name: "get_resources",
        description: "Retrieve a list of resources",
        inputSchema: {
            type: "object",
            properties: {
                // Define input properties
            }
        }
    },
    // Other tool definitions...
];

// Define handler function type
export type ToolHandler = (args: any) => Promise<any>;

// Map tool names to handlers
export interface ToolHandlers {
    [toolName: string]: ToolHandler;
}
```

### 7. Implement Tool Handlers

Create handlers for each tool that process arguments and call service methods:

```typescript
// src/tools/tool-handlers.ts
import { SpecificService } from '../services/specific-service.js';
import { ToolHandlers } from './tool-definitions.js';

export function createToolHandlers(service: SpecificService): ToolHandlers {
    return {
        get_resources: async (args: any) => {
            try {
                const resources = await service.getResources();
                return { resources };
            } catch (error) {
                console.error('Error in get_resources:', error);
                throw new Error(`Failed to get resources: ${error instanceof Error ? error.message : String(error)}`);
            }
        },
        // Other handlers...
    };
}
```

### 8. Create Main Entry Point

Implement the main entry point that initializes services, registers tools, and starts the server:

```typescript
// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    McpError,
    ErrorCode
} from "@modelcontextprotocol/sdk/types.js";

import { SpecificService } from "./services/specific-service.js";
import { tools } from "./tools/tool-definitions.js";
import { createToolHandlers } from "./tools/tool-handlers.js";

async function main() {
    try {
        // Initialize services
        const service = SpecificService.getInstance();
        
        // Create tool handlers
        const toolHandlers = createToolHandlers(service);
        
        // Create MCP server
        const server = new Server(
            {
                name: "your-mcp-server",
                version: "0.1.0",
            },
            {
                capabilities: {
                    tools: {},
                }
            }
        );
        
        // Register tool list handler
        server.setRequestHandler(ListToolsRequestSchema, async () => {
            return { tools };
        });
        
        // Register tool call handler
        server.setRequestHandler(CallToolRequestSchema, async (request) => {
            try {
                const toolName = request.params.name;
                const handler = toolHandlers[toolName];
                
                if (!handler) {
                    throw new McpError(
                        ErrorCode.MethodNotFound,
                        `Unknown tool: ${toolName}`
                    );
                }
                
                const result = await handler(request.params.arguments);
                
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                };
            } catch (error) {
                // Error handling
            }
        });
        
        // Connect to transport
        const transport = new StdioServerTransport();
        await server.connect(transport);
        
        console.log("MCP Server running on stdio");
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

main().catch(console.error);
```

## Best Practices for MCP Server Development

### Modularity Guidelines

1. **Single Responsibility Principle**: Each file should have a single, well-defined purpose.
2. **Interface Segregation**: Define clear interfaces between components.
3. **Dependency Injection**: Pass dependencies to components rather than creating them internally.
4. **Separation of Concerns**: Keep tool definitions separate from their implementations.

### File Size and Organization

1. **Keep Files Small**: Aim for files under 300 lines of code.
2. **Logical Grouping**: Group related functionality in the same directory.
3. **Consistent Naming**: Use a consistent naming convention for files and directories.
4. **Export Patterns**: Be explicit about what each module exports.

### Error Handling

1. **Comprehensive Error Handling**: Handle errors at all levels (service, tool, server).
2. **Informative Error Messages**: Provide clear error messages that help diagnose issues.
3. **Error Propagation**: Properly propagate errors up the call stack.
4. **Logging**: Log errors with appropriate context for debugging.

### Documentation

1. **JSDoc Comments**: Document all classes, methods, and interfaces.
2. **README**: Provide comprehensive documentation on how to use and extend the server.
3. **Code Examples**: Include examples of how to add new tools and services.
4. **Architecture Overview**: Document the overall architecture and design decisions.

## Extension Patterns

When extending the MCP server with new functionality, follow these patterns:

### Adding a New Service

1. Create a new service class in `src/services/`.
2. Extend the base service class.
3. Implement domain-specific methods.
4. Add any necessary type definitions in `src/types/`.

### Adding New Tools

1. Define new tools in `src/tools/tool-definitions.ts`.
2. Implement handlers in `src/tools/tool-handlers.ts`.
3. Register the tools and handlers in `src/index.ts`.

## Testing Your MCP Server

To test your MCP server:

1. Build the project: `npm run build`
2. Run the server: `npm start`
3. Test with an MCP client or using the MCP CLI tool.

## Common Pitfalls to Avoid

1. **Monolithic Files**: Avoid putting too much functionality in a single file.
2. **Tight Coupling**: Avoid tight coupling between components.
3. **Inconsistent Error Handling**: Ensure consistent error handling throughout the codebase.
4. **Missing Documentation**: Document all components and extension points.
5. **Hardcoded Configuration**: Use the configuration system instead of hardcoding values.

By following these guidelines, you will create an MCP server that is modular, maintainable, and easy to extend.
