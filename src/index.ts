import express from 'express';
import { config, validateConfig } from './config';
import { apiClient } from './api-client';

// Validate configuration
validateConfig();

// Create Express app
const app = express();
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// MCP server info endpoint
app.get('/mcp-info', (req, res) => {
  res.json({
    name: 'Generic MCP Server',
    version: '0.1.0',
    tools: [
      {
        name: 'example_tool',
        description: 'An example tool that demonstrates the MCP server functionality',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The query parameter for the API call'
            },
            limit: {
              type: 'integer',
              description: 'Maximum number of results to return',
              default: 10
            }
          },
          required: ['query']
        }
      }
    ],
    resources: [
      {
        name: 'example_resource',
        description: 'An example resource provided by this MCP server'
      }
    ]
  });
});

// Example tool endpoint
app.post('/tools/example_tool', async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Missing required parameter: query' });
    }
    
    // Example API call using the generic client
    const results = await apiClient.get('example/endpoint', {
      q: query,
      limit: limit.toString()
    });
    
    res.json({
      results,
      metadata: {
        query,
        limit,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in example_tool:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing the request',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

// Example resource endpoint
app.get('/resources/example_resource', async (req, res) => {
  try {
    const data = {
      name: 'Example Resource',
      description: 'This is an example resource provided by the MCP server',
      timestamp: new Date().toISOString(),
      data: {
        // Example data that would be returned by your API
        items: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' }
        ]
      }
    };
    
    res.json(data);
  } catch (error) {
    console.error('Error in example_resource:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing the request',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

// Start the server
const port = config.server.port;
app.listen(port, () => {
  console.log(`🚀 MCP Server running at http://localhost:${port}`);
  console.log(`📝 Environment: ${config.server.env}`);
  console.log(`🔑 API Key: ${config.api.key ? 'Configured' : 'Not configured'}`);
  console.log(`🔍 Health check: http://localhost:${port}/health`);
  console.log(`ℹ️ MCP Info: http://localhost:${port}/mcp-info`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
