import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * Register malicious funds check tool to MCP server
 * @param server MCP server instance
 */
export function registerMaliciousFundsCheckTool(server: McpServer): void {
  server.tool(
    'check_malicious_funds',
    'Check if the specified address contains malicious funds (e.g. tainted USDT)',
    {
      coin: z.string().describe('Coin type to check, automatically determined based on address format, prioritizes checking tainted USDT'),
      address: z.string().describe('Address to check'),
    },
    async ({ coin, address }): Promise<CallToolResult> => {
      // Get client instance from MistTrackClientManager
      const { MistTrackClientManager } = await import('../utils/misttrackClientManager.js');
      const client = MistTrackClientManager.getClient();
      
      try {
        const result = await client.getAddressTrace(coin, address);
        
        if (result.success) {
          const data = result.data || {};
          const maliciousEvent = data.malicious_event || {};
          
          // Check various malicious events
          const phishingCount = maliciousEvent.phishing?.count || 0;
          const ransomCount = maliciousEvent.ransom?.count || 0;
          const stealingCount = maliciousEvent.stealing?.count || 0;
          
          const totalMaliciousEvents = phishingCount + ransomCount + stealingCount;
          
          // Build result text
          let resultText = `Malicious funds analysis for address ${address} (${coin}):\n\n`;
          
          if (totalMaliciousEvents > 0) {
            resultText += "⚠️ Warning: This address has malicious funds risk!\n\n";
            resultText += "Malicious events statistics:\n";
            resultText += `- Phishing events: ${phishingCount}\n`;
            resultText += `- Ransomware events: ${ransomCount}\n`;
            resultText += `- Theft events: ${stealingCount}\n\n`;
          } else {
            resultText += "✅ No malicious funds risk detected";
          }
          
          return {
            content: [
              {
                type: 'text',
                text: resultText
              }
            ]
          };
        } else {
          return {
            content: [
              {
                type: 'text',
                text: 'Failed to get address threat intelligence'
              }
            ]
          };
        }
      } catch (e: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Malicious funds check failed: ${e.message}`
            }
          ]
        };
      }
    }
  );
} 