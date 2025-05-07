import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * Register dashboard URL generation tool to MCP server
 * @param server MCP server instance
 */
export function registerDashboardUrlTool(server: McpServer): void {
  server.tool(
    'get_dashboard_url',
    'Generate MistTrack dashboard URL based on coin type and address',
    {
      coin: z.string().describe('Coin code, e.g. "ETH", "BTC", "USDT-TRC20", etc.'),
      address: z.string().describe('Blockchain address'),
    },
    async ({ coin, address }): Promise<CallToolResult> => {
      try {
        // Import dashboard URL generation utility
        const { getDashboardUrl, normalizeCoinFormat } = await import('../utils/misttrackDashboard.js');
        
        // Normalize coin format
        const normalizedCoin = normalizeCoinFormat(coin, address);
        
        // Get dashboard URL
        const url = getDashboardUrl(normalizedCoin, address);
        
        const textResult = `Address: ${address}
Coin: ${normalizedCoin}
MistTrack Dashboard URL: ${url}`;
        
        return {
          content: [
            {
              type: 'text',
              text: textResult
            }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to generate dashboard URL: ${e.message}`
            }
          ]
        };
      }
    }
  );
} 