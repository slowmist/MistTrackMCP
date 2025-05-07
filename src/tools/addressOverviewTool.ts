import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * Register address overview tool to MCP server
 * @param server MCP server instance
 */
export function registerAddressOverviewTool(server: McpServer): void {
  server.tool(
    'get_address_overview',
    'Get balance and statistics for the specified address',
    {
      coin: z.string().describe('Coin type to check, such as ETH, BTC, etc.'),
      address: z.string().describe('Address to check'),
    },
    async ({ coin, address }): Promise<CallToolResult> => {
      // Import analysis client
      const { AnalysisClient } = await import('../utils/analysis.js');
      const client = new AnalysisClient();
      
      try {
        // Get formatted address overview text
        const result = await client.getAddressOverviewAsText(coin, address);
        
        // Check if it's an API Key error message
        if (typeof result === 'string' && (result.includes('API Key') || result.includes('[ERROR]'))) {
          return {
            content: [
              {
                type: 'text',
                text: result
              }
            ]
          };
        }
        
        return {
          content: [
            {
              type: 'text',
              text: result
            }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to get address overview: ${e.message}`
            }
          ]
        };
      }
    }
  );
} 