# Generic MCP Server Template

A flexible template for creating Model Context Protocol (MCP) servers that provide tools and resources for AI assistants.

## What is MCP?

The Model Context Protocol (MCP) enables communication between AI assistants and locally running servers that provide additional tools and resources to extend the AI's capabilities. MCP servers can:

- Provide **tools** that AI assistants can use to perform actions
- Expose **resources** that AI assistants can access for information
- Connect AI assistants to external APIs, databases, and services
- Enable AI assistants to interact with local systems and files

## Features

This template provides:

- A complete TypeScript project structure for building MCP servers
- Configuration management with environment variables
- A generic API client with caching and error handling
- Express server setup with MCP-compatible endpoints
- Example tool and resource implementations
- TypeScript type definitions for better development experience

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone this repository or use it as a template:
   ```bash
   git clone https://github.com/yourusername/generic-mcp-server.git your-mcp-server
   cd your-mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file to add your API keys and configuration.

### Development

Start the development server with hot reloading:

```bash
npm run dev
```

### Building

Build the project for production:

```bash
npm run build
```

### Running in Production

Start the server in production mode:

```bash
npm run start
```

## Customizing the Template

### 1. Update Package Information

Edit `package.json` to update the name, version, description, and other metadata.

### 2. Configure Your API

Update `src/config.ts` to include the configuration options needed for your specific API.

### 3. Implement Your API Client

Modify `src/api-client.ts` to implement the specific API calls needed for your service.

### 4. Define Your Tools and Resources

In `src/index.ts`, update the `/mcp-info` endpoint to define the tools and resources your MCP server will provide.

### 5. Implement Tool Endpoints

Create endpoints for each tool in the format `/tools/{tool_name}` that accept POST requests with the tool parameters.

### 6. Implement Resource Endpoints

Create endpoints for each resource in the format `/resources/{resource_name}` that return the resource data.

## Adding to AI Assistants

### Claude Desktop

1. Open Claude Desktop settings
2. Navigate to the MCP Servers section
3. Add a new server with the following configuration:
   - Name: Your MCP Server Name
   - Type: command
   - Command: node
   - Arguments: /path/to/your-mcp-server/dist/index.js
   - Environment Variables: Add any required environment variables

### Cursor

1. In Cursor, go to Settings > MCP Servers
2. Click "Add Server"
3. Configure the server with:
   - Name: Your MCP Server Name
   - Type: command
   - Command: node
   - Arguments: /path/to/your-mcp-server/dist/index.js
   - Environment Variables: Add any required environment variables

## MCP Protocol Details

The MCP protocol defines how AI assistants interact with MCP servers:

- Servers expose an HTTP API with specific endpoints
- Tools are invoked via POST requests to `/tools/{tool_name}`
- Resources are accessed via GET requests to `/resources/{resource_name}`
- Server metadata is available at `/mcp-info`

For more details on the MCP protocol, see the [official documentation](https://github.com/anthropics/anthropic-cookbook/tree/main/model_context_protocol).

## License

MIT
