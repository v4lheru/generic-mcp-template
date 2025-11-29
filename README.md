# Generic MCP Server Template

A flexible template for creating Model Context Protocol (MCP) servers using the official TypeScript SDK.

## What is MCP?

The Model Context Protocol (MCP) enables communication between AI assistants and locally running servers that provide additional tools and resources.

## Features

- **Official SDK**: Built with `@modelcontextprotocol/sdk`
- **Type Safety**: Full TypeScript support with Zod validation
- **Stdio Transport**: Standard transport for local agent integration
- **Modular Design**: Easy to add new tools and resources

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/v4lheru/generic-mcp-template.git
   cd generic-mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

### Usage

To run the server locally (for testing or development):
```bash
npm run start
```

Note: This server uses `stdio` transport, so it expects to communicate via standard input/output. It will not start an HTTP server.

### Adding to Claude Desktop

1. Open Claude Desktop config (e.g. `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS).
2. Add your server:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/path/to/generic-mcp-server/dist/index.js"]
    }
  }
}
```

## Customization

- **Tools**: Add new tools in `src/tools.ts`.
- **Resources**: Add new resources in `src/resources.ts`.
- **Config**: Update `src/config.ts` for environment variables.

## License

MIT
