# Generic MCP Server Template

A modular, extensible Model Context Protocol (MCP) server template designed for easy customization and extension.

## Features

- **Modular Architecture**: Clear separation of concerns with a well-defined structure
- **Small, Focused Files**: Better maintainability and easier for AI to ingest
- **Easy Extension Points**: Simple patterns for adding new tools and services
- **Comprehensive Error Handling**: Robust error management throughout the codebase
- **Type Safety**: Full TypeScript support with proper typing

## Project Structure

```
generic-mcp-template/
├── src/
│   ├── services/       # Service classes for API interactions
│   │   ├── base-service.ts        # Abstract base service with common functionality
│   │   └── example-service.ts     # Example service implementation
│   ├── tools/          # MCP tool definitions and handlers
│   │   ├── example-tools.ts       # Tool definitions (name, description, schema)
│   │   └── example-tool-handlers.ts # Tool handler implementations
│   ├── types/          # TypeScript type definitions
│   │   └── example-types.ts       # Example type definitions
│   ├── config.ts       # Configuration management
│   └── index.ts        # Main entry point
├── .env.example        # Example environment variables
├── package.json        # Project dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/v4lheru/generic-mcp-template.git
   cd generic-mcp-template
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file with your API keys and configuration.

### Building and Running

1. Build the project:
   ```bash
   npm run build
   ```

2. Run the server:
   ```bash
   npm start
   ```

## Extending the Template

### Adding a New Service

1. Create a new service file in `src/services/`:
   ```typescript
   // src/services/my-service.ts
   import { BaseService } from './base-service.js';
   import config from '../config.js';

   export class MyService extends BaseService {
       // Implement your service...
   }
   ```

2. Add any necessary types in `src/types/`.

### Adding New Tools

1. Define your tools in a new file or extend the existing one in `src/tools/`:
   ```typescript
   // src/tools/my-tools.ts
   export const myTools = [
       {
           name: "my_tool",
           description: "Description of my tool",
           inputSchema: {
               // JSON Schema for the tool's input
           }
       }
   ];
   ```

2. Implement handlers for your tools:
   ```typescript
   // src/tools/my-tool-handlers.ts
   import { MyService } from '../services/my-service.js';
   
   export function createMyToolHandlers(myService: MyService) {
       return {
           my_tool: async (args: any) => {
               // Implement your tool handler
           }
       };
   }
   ```

3. Register your tools and handlers in `src/index.ts`.

## Configuration

The template uses a centralized configuration system in `src/config.ts`. Configuration can be provided through:

- Environment variables
- Command line arguments (with `--env KEY=VALUE`)
- Default values in the code

## Error Handling

The template includes comprehensive error handling:

- Service-level error handling with rate limiting support
- Tool-level error handling with proper error messages
- MCP protocol error handling

## License

MIT
