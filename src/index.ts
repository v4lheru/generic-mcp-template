#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { TOOLS } from "./tools.js";
import { RESOURCES } from "./resources.js";

/**
 * Create an MCP server with capabilities for resources (to list/read data)
 * and tools (to execute code).
 */
const server = new Server(
  {
    name: "generic-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

/**
 * Handler for listing available resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: Object.values(RESOURCES).map((resource) => ({
      uri: resource.uri,
      mimeType: resource.mimeType,
      name: resource.name,
      description: resource.description,
    })),
  };
});

/**
 * Handler for reading the contents of a specific resource
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const resource = Object.values(RESOURCES).find(
    (r) => r.uri === request.params.uri
  );

  if (!resource) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `Resource not found: ${request.params.uri}`
    );
  }

  return resource.handler();
});

/**
 * Handler for listing available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.entries(TOOLS).map(([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: zodToJsonSchema(tool.inputSchema),
    })),
  };
});

/**
 * Handler for calling a tool
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const tool = TOOLS[toolName as keyof typeof TOOLS];

  if (!tool) {
    throw new McpError(
      ErrorCode.MethodNotFound,
      `Unknown tool: ${toolName}`
    );
  }

  try {
    const args = tool.inputSchema.parse(request.params.arguments);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await tool.handler(args as any);
  } catch (error) {
    if (error instanceof Error) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid arguments: ${error.message}`
      );
    }
    throw error;
  }
});

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Generic MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
