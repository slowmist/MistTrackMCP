import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * Register address URL information tool to MCP server
 * @param server MCP server instance
 */
export function registerUrlInfoTool(server: McpServer): void {
  server.tool(
    'get_url_info',
    'Get comprehensive URL information for the specified address, including dashboard URL and blockchain explorer URL',
    {
      coin: z.string().describe('Coin code, e.g. "ETH", "BTC", "USDT-TRC20", etc.'),
      address: z.string().describe('Blockchain address'),
    },
    async ({ coin, address }): Promise<CallToolResult> => {
      try {
        // Import URL generation utilities
        const { 
          getDashboardUrl, 
          getChainExplorerUrl, 
          normalizeCoinFormat 
        } = await import('../utils/misttrackDashboard.js');
        
        // Normalize coin format
        const normalizedCoin = normalizeCoinFormat(coin, address);
        
        // Get dashboard URL
        const dashboardUrl = getDashboardUrl(normalizedCoin, address);
        
        // Get blockchain explorer URL
        const explorerUrl = getChainExplorerUrl(normalizedCoin, address);
        
        const textResult = `Address: ${address}
Coin: ${normalizedCoin}
MistTrack Dashboard URL: ${dashboardUrl}
Blockchain Explorer URL: ${explorerUrl}`;
        
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
              text: `Failed to get URL information: ${e.message}`
            }
          ]
        };
      }
    }
  );
} 