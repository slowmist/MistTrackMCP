import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * Register address threat intelligence tool to MCP server
 * @param server MCP server instance
 */
export function registerAddressTraceTool(server: McpServer): void {
  server.tool(
    'get_address_trace',
    'Get configuration profile for the specified address, including interacted platforms and related threat intelligence data',
    {
      coin: z.string().describe('Coin type to check, such as ETH, BTC, etc.'),
      address: z.string().describe('Address to check'),
    },
    async ({ coin, address }): Promise<CallToolResult> => {
      try {
        // Use MistTrackClient to get address trace data
        const { MistTrackClientManager } = await import('../utils/misttrackClientManager.js');
        const client = MistTrackClientManager.getClient();
        
        const result = await client.getAddressTrace(coin, address);
        
        if (result.success) {
          const data = result.data || {};
          const usePlatform = data.use_platform || {};
          const maliciousEvent = data.malicious_event || {};
          const relationInfo = data.relation_info || {};
          
          // Format result text
          const textResult = `Address: ${address} Coin: ${coin}

Used platforms:
- Exchanges: ${usePlatform.exchange?.count || 0}
  ${formatList(usePlatform.exchange?.exchange_list || [])}
- DEX: ${usePlatform.dex?.count || 0}
  ${formatList(usePlatform.dex?.dex_list || [])}
- Mixers: ${usePlatform.mixer?.count || 0}
  ${formatList(usePlatform.mixer?.mixer_list || [])}
- NFT platforms: ${usePlatform.nft?.count || 0}
  ${formatList(usePlatform.nft?.nft_list || [])}

Malicious events:
- Phishing: ${maliciousEvent.phishing?.count || 0}
  ${formatList(maliciousEvent.phishing?.phishing_list || [])}
- Ransomware: ${maliciousEvent.ransom?.count || 0}
  ${formatList(maliciousEvent.ransom?.ransom_list || [])}
- Theft: ${maliciousEvent.stealing?.count || 0}
  ${formatList(maliciousEvent.stealing?.stealing_list || [])}

Related information:
- Wallets: ${relationInfo.wallet?.count || 0}
  ${formatList(relationInfo.wallet?.wallet_list || [])}
- ENS domains: ${relationInfo.ens?.count || 0}
  ${formatList(relationInfo.ens?.ens_list || [])}
- Twitter accounts: ${relationInfo.twitter?.count || 0}
  ${formatList(relationInfo.twitter?.twitter_list || [])}`;
          
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
                text: `Failed to get address trace: ${result.msg || 'Unknown error'}`
              }
            ]
          };
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to get address trace: ${error instanceof Error ? error.message : String(error)}`
            }
          ]
        };
      }
    }
  );
}

/**
 * Format list as readable text
 * @param items List to format
 * @returns Formatted text
 */
function formatList(items: string[]): string {
  if (!items || items.length === 0) {
    return 'None';
  }
  return '\n  ' + items.join('\n  ');
}
  