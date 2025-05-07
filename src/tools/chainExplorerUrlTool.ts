import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * Register blockchain explorer URL generation tool to MCP server
 * @param server MCP server instance
 */
export function registerChainExplorerUrlTool(server: McpServer): void {
  server.tool(
    'get_chain_explorer_url',
    'Generate URL for corresponding blockchain explorer based on coin type and address',
    {
      coin: z.string().describe('Coin code, e.g. "ETH", "BTC", "USDT-TRC20", etc.'),
      address: z.string().describe('Blockchain address'),
    },
    async ({ coin, address }): Promise<CallToolResult> => {
      try {
        // Import blockchain explorer URL generation utility
        const { getChainExplorerUrl, normalizeCoinFormat } = await import('../utils/misttrackDashboard.js');
        
        // Normalize coin format
        const normalizedCoin = normalizeCoinFormat(coin, address);
        
        // Get blockchain explorer URL
        const url = getChainExplorerUrl(normalizedCoin, address);
        
        const textResult = `Address: ${address}
Coin: ${normalizedCoin}
Blockchain Explorer URL: ${url}`;
        
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
              text: `Failed to generate blockchain explorer URL: ${e.message}`
            }
          ]
        };
      }
    }
  );
} 