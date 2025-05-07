import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * Register address counterparty analysis tool to MCP server
 * @param server MCP server instance
 */
export function registerAddressCounterpartyTool(server: McpServer): void {
  server.tool(
    'get_address_counterparty',
    'Get transaction counterparty analysis results for the specified address',
    {
      coin: z.string().describe('Coin type to check, such as ETH, BTC, etc.'),
      address: z.string().describe('Address to check'),
    },
    async ({ coin, address }): Promise<CallToolResult> => {
      // Get client instance from MistTrackClientManager
      const { MistTrackClientManager } = await import('../utils/misttrackClientManager.js');
      const client = MistTrackClientManager.getClient();
      
      try {
        const result = await client.getAddressCounterparty(coin, address);
        
        if (result.success) {
          const counterpartyList = result.address_counterparty_list || [];
          
          // Format counterparty list into readable text
          const formatCounterpartyList = (counterparties: any[]): string => {
            if (!counterparties || counterparties.length === 0) {
              return "    No data";
            }
            
            return counterparties.map(cp => {
              // Decide decimal places based on amount size
              const amount = cp.amount;
              let amountStr;
              
              if (amount >= 1) {
                amountStr = amount.toLocaleString(undefined, {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3
                });
              } else {
                amountStr = amount.toLocaleString(undefined, {
                  minimumFractionDigits: 6,
                  maximumFractionDigits: 6
                });
              }
              
              return `    ${cp.name}: ${amountStr} (${cp.percent}%)`;
            }).join('\n');
          };
          
          const textResult = `Address: ${address} Coin: ${coin}

Counterparty analysis:
${formatCounterpartyList(counterpartyList)}

Total number of counterparties: ${counterpartyList.length}`;
          
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
                text: 'Failed to get counterparty analysis'
              }
            ]
          };
        }
      } catch (e: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to get counterparty analysis: ${e.message}`
            }
          ]
        };
      }
    }
  );
} 