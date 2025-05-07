import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * Register address transaction action analysis tool to MCP server
 * @param server MCP server instance
 */
export function registerAddressActionTool(server: McpServer): void {
  server.tool(
    'get_address_action',
    'Get transaction action analysis results for the specified address',
    {
      coin: z.string().describe('Coin type to check, such as ETH, BTC, etc.'),
      address: z.string().describe('Address to check'),
    },
    async ({ coin, address }): Promise<CallToolResult> => {
      // Get client instance from MistTrackClientManager
      const { MistTrackClientManager } = await import('../utils/misttrackClientManager.js');
      const client = MistTrackClientManager.getClient();
      
      try {
        const result = await client.getAddressAction(coin, address);
        
        if (result.success) {
          const actionDic = result.action_dic || {};
          const receivedTxs = actionDic.received_txs || [];
          const spentTxs = actionDic.spent_txs || [];
          
          // Format action list into readable text
          const formatActionList = (actions: any[]): string => {
            if (!actions || actions.length === 0) {
              return '    No data';
            }
            return actions.map(action => 
              `    ${action.action}: ${action.count} transactions (${action.proportion}%)`
            ).join('\n');
          };
          
          const textResult = `Address: ${address} Coin: ${coin}
          
Received transaction action analysis:
${formatActionList(receivedTxs)}

Spent transaction action analysis:
${formatActionList(spentTxs)}`;
          
          return {
            content: [
              {
                type: 'text',
                text: textResult
              }
            ]
          };
        } else {
          return {
            content: [
              {
                type: 'text',
                text: 'Failed to get address action analysis'
              }
            ]
          };
        }
      } catch (e: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to get address action analysis: ${e.message}`
            }
          ]
        };
      }
    }
  );
} 