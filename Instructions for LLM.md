# Instructions for AI Assistants

This document explains how to extend this MCP server template.

## Project Structure

- `src/index.ts`: Main entry point, sets up the MCP server and request handlers.
- `src/tools.ts`: Definitions for executable tools.
- `src/resources.ts`: Definitions for read-only resources.
- `src/config.ts`: Configuration management.

## Adding a New Tool

1. Open `src/tools.ts`.
2. Add a new entry to the `TOOLS` object.
3. Define the `inputSchema` using Zod.
4. Implement the `handler` function.

Example:
```typescript
"my-new-tool": {
  description: "Description of what the tool does",
  inputSchema: z.object({
    param: z.string(),
  }),
  handler: async ({ param }) => {
    // Tool logic here
    return {
      content: [{ type: "text", text: `Result: ${param}` }],
    };
  },
},
```

## Adding a New Resource

1. Open `src/resources.ts`.
2. Add a new entry to the `RESOURCES` object.
3. Define the `uri`, `mimeType`, and `name`.
4. Implement the `handler` function to return the resource content.

Example:
```typescript
"my-resource": {
  uri: "custom://resource",
  mimeType: "text/plain",
  name: "My Resource",
  description: "A custom resource",
  handler: async () => {
    return {
      contents: [{
        uri: "custom://resource",
        mimeType: "text/plain",
        text: "Resource content",
      }],
    };
  },
},
```

## Verification

After making changes, always run `npm run build` to ensure type safety.
