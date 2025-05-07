import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import dotenv from 'dotenv';
import { MistTrackClientManager } from './utils/misttrackClientManager.js';

// Load environment variables
dotenv.config();

// Server mode enum
export enum ServerMode {
  STUDIO = 'studio'
}

// MistTrack API configuration
export interface MistTrackConfig {
  API_KEY: string;
  BASE_URL: string;
  RATE_LIMIT: number;
  MAX_RETRIES: number;
  RETRY_DELAY: number;
  RETRY_BACKOFF: number;
}

let MISTTRACK_CONFIG: MistTrackConfig = {
  API_KEY: process.env.MISTTRACK_API_KEY || '',
  BASE_URL: 'https://openapi.misttrack.io',
  RATE_LIMIT: 1.0, // Set API rate limit
  MAX_RETRIES: 3,
  RETRY_DELAY: 1.0,
  RETRY_BACKOFF: 2.0
};

/**
 * Update MistTrack configuration
 * @param newConfig New configuration parameters
 */
const updateMistTrackConfig = (newConfig: Partial<MistTrackConfig>) => {
  // Update configuration
  MISTTRACK_CONFIG = {
    ...MISTTRACK_CONFIG,
    ...newConfig
  };
  

  // Reinitialize MistTrackClientManager
  MistTrackClientManager.initialize(MISTTRACK_CONFIG);
};

/**
 * Initialize MCP server
 * @returns MCP server instance
 */
const getServer = () => {
  const server = new McpServer({
    name: 'misttrack-mcp-server',
    version: '1.0.1',
  }, { capabilities: { logging: {} } });

  // Register all tools
  registerAllMisttrackTools(server);
  
  // Register all resources
  registerAllMisttrackResources(server);
  
  // Register all prompts
  registerAllMisttrackPrompts(server);
  
  return server;
};

/**
 * Main function - Initialize and start MistTrack MCP server
 * @param mode Server running mode
 */
export async function main(mode: ServerMode = ServerMode.STUDIO) {
  // Log environment variable information, to help with debugging
  if (process.env.MISTTRACK_API_KEY) {
    // Only print first few characters and last few characters, avoid exposing full key
    const key = process.env.MISTTRACK_API_KEY;
    const maskedKey = key.length > 8 ? 
      `${key.substring(0, 4)}...${key.substring(key.length - 4)}` : 
      '***set but not shown***';
  }

  // Initialize MistTrackClientManager
  MistTrackClientManager.initialize(MISTTRACK_CONFIG);

  // Start server with stdio transport
  const server = getServer();
  const transport = new StdioServerTransport();
  
  // Set close handler
  process.on('beforeExit', () => {});
  
  await server.connect(transport);
  return;
}

// Application entry point, execute main function
if (require.main === module) {
  
  // Set global error handling
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise rejection:', reason);
  });
  
  // Call main function to start server
  main(ServerMode.STUDIO).catch(error => {
    console.error('Error starting server:', error);
    process.exit(1);
  });
}

// Import tool registration function
import { registerAllMisttrackTools } from './tools/index.js';
// Import resource registration function
import { registerAllMisttrackResources } from './resources/index.js';
// Import prompt registration function
import { registerAllMisttrackPrompts } from './prompts/index.js';

// Export related configurations and functions for use by other modules
export { MISTTRACK_CONFIG, updateMistTrackConfig };