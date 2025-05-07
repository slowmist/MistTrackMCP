import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * Register address labels tool to MCP server
 * @param server MCP server instance
 */
export function registerAddressLabelsTool(server: McpServer): void {
  server.tool(
    'get_address_labels',
    'Get the list of labels for the specified address',
    {
      coin: z.string().describe('Coin type to check, such as ETH, BTC, etc.'),
      address: z.string().describe('Address to check'),
    },
    async ({ coin, address }): Promise<CallToolResult> => {
      // Get client instance from MistTrackClientManager
      const { MistTrackClientManager } = await import('../utils/misttrackClientManager.js');
      const client = MistTrackClientManager.getClient();
      
      try {
        const result = await client.getAddressLabels(coin, address);
        
        if (result.success) {
          const data = result.data || {};
          const labelList = data.label_list || [];
          const labelType = data.label_type || '';
          
          // Format label list display
          const formattedLabels = labelList.length > 0 ? labelList.join(', ') : 'None';
          
          const textResult = `Address: ${address}
Label list: ${formattedLabels}
Address label type: ${labelType}`;
          
          return {
            content: [
              {
                type: 'text',
                text: textResult
              }
            ]
          };
        } else {
          const errorMsg = result.msg || 'Unknown error';
          return {
            content: [
              {
                type: 'text',
                text: `Failed to get address labels: ${errorMsg}`
              }
            ]
          };
        }
      } catch (e: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to get address labels: ${e.message}`
            }
          ]
        };
      }
    }
  );
} 