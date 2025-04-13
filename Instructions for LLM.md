# Instructions for AI Assistants

This document provides guidance for AI assistants working with this MCP server template. It explains how to understand, modify, and extend the template to create custom MCP servers.

## Understanding the MCP Server Template

This template is designed to help create Model Context Protocol (MCP) servers that extend AI assistant capabilities by providing:

1. **Tools**: Functions that perform actions when invoked by an AI assistant
2. **Resources**: Data sources that provide information to AI assistants

The template follows a modular structure:

- `src/index.ts`: Main entry point and Express server setup
- `src/config.ts`: Configuration management
- `src/api-client.ts`: Generic API client for external services

## How to Modify This Template

### Step 1: Understand the Requirements

Before modifying the template, understand:

- What API or service will this MCP server connect to?
- What tools should it provide to AI assistants?
- What resources should it expose?
- What authentication is required?

### Step 2: Update Configuration

Modify `src/config.ts` to:

- Add necessary environment variables
- Update configuration structure for your specific needs
- Add validation for required configuration

### Step 3: Implement API Client

Adapt `src/api-client.ts` to:

- Connect to your specific API
- Implement authentication methods
- Create specific methods for API endpoints
- Handle rate limiting and caching appropriately

### Step 4: Define Tools and Resources

In `src/index.ts`, update the `/mcp-info` endpoint to:

- Define the tools your MCP server will provide
- Specify the parameters each tool accepts
- Document the resources your server exposes

### Step 5: Implement Tool Endpoints

For each tool:

1. Create a POST endpoint at `/tools/{tool_name}`
2. Validate incoming parameters
3. Call the appropriate API client methods
4. Format the response according to MCP specifications
5. Handle errors gracefully

### Step 6: Implement Resource Endpoints

For each resource:

1. Create a GET endpoint at `/resources/{resource_name}`
2. Fetch the necessary data
3. Format the response according to MCP specifications
4. Implement caching if appropriate

## Best Practices for AI Assistants

When working with this template:

1. **Maintain Type Safety**: Use TypeScript types for all parameters and responses
2. **Handle Errors Gracefully**: Provide clear error messages that help users understand issues
3. **Document Everything**: Add detailed comments explaining the purpose and behavior of each component
4. **Follow Security Best Practices**:
   - Never hardcode API keys or credentials
   - Validate all user inputs
   - Use HTTPS for production deployments
5. **Optimize Performance**:
   - Implement appropriate caching
   - Handle rate limiting
   - Minimize response sizes

## Testing Your MCP Server

Before deploying:

1. Test each tool with various inputs
2. Verify error handling works correctly
3. Check that resources return expected data
4. Ensure configuration validation works properly

## Extending the Template

To add advanced features:

1. **Authentication**: Add middleware for authenticating requests
2. **Logging**: Enhance logging for better debugging
3. **Metrics**: Add monitoring for API calls and performance
4. **Rate Limiting**: Implement more sophisticated rate limiting
5. **Streaming**: Add support for streaming responses

## Troubleshooting Common Issues

If you encounter problems:

1. **Connection Issues**: Check API keys and network connectivity
2. **Type Errors**: Ensure types match between client and server
3. **Missing Dependencies**: Verify all packages are installed
4. **Configuration Problems**: Check environment variables are set correctly

## MCP Protocol Compliance

To ensure your server is MCP-compliant:

1. The `/mcp-info` endpoint must return a valid schema
2. Tool endpoints must accept POST requests with JSON bodies
3. Resource endpoints must respond to GET requests
4. All responses should be valid JSON
5. Error responses should include clear error messages

## Example: Adding a New Tool

Here's how to add a new tool:

1. Add the tool definition to the `/mcp-info` endpoint
2. Create a new POST endpoint at `/tools/your_tool_name`
3. Implement the tool logic using the API client
4. Test the tool with various inputs
5. Document the tool in the README

Remember that AI assistants will rely on the information provided by your MCP server, so clarity, reliability, and error handling are crucial for a good user experience.
