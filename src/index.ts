#!/usr/bin/env node

// Command-line entry point for MistTrack MCP server
import { program } from 'commander';
import { main, updateMistTrackConfig, ServerMode, MistTrackConfig } from './MistTrackMCPServer.js';

// Define version and description
program
  .name('misttrack')
  .description('MistTrack MCP Server - Connect Claude with MistTrack API')
  .version('1.0.7');

// Define command-line options
program
  .option('-k, --key <key>', 'MistTrack API Key')
  .option('-u, --base-url <url>', 'MistTrack API Base URL', 'https://openapi.misttrack.io')
  .option('-r, --rate-limit <limit>', 'API rate limit (requests per second)', '1.0')
  .option('-m, --max-retries <retries>', 'Maximum retry count', '3')
  .option('-d, --retry-delay <delay>', 'Retry delay (seconds)', '1.0')
  .option('-b, --retry-backoff <backoff>', 'Retry backoff multiplier', '2.0');

// Parse command-line arguments
program.parse();
const options = program.opts();

// Set API key in environment variables
if (options.key) {
  process.env.MISTTRACK_API_KEY = options.key;
}

// Configure MistTrack API
const config: MistTrackConfig = {
  API_KEY: options.key || process.env.MISTTRACK_API_KEY || '',
  BASE_URL: options.baseUrl,
  RATE_LIMIT: parseFloat(options.rateLimit),
  MAX_RETRIES: parseInt(options.maxRetries),
  RETRY_DELAY: parseFloat(options.retryDelay),
  RETRY_BACKOFF: parseFloat(options.retryBackoff)
};

// Update configuration
updateMistTrackConfig(config);

// Set environment variables
process.env.MCP_TRANSPORT = 'stdio';



// Start server
main(ServerMode.STUDIO).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// If this file is executed directly as the module entry point
if (require.main === module) {
  // main function has already been executed by the code above
} 