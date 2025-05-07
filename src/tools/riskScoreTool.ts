import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * Register risk score tool to MCP server
 * @param server MCP server instance
 */
export function registerRiskScoreTool(server: McpServer): void {
  server.tool(
    'get_risk_score',
    'Get risk score for the specified address or transaction hash',
    {
      coin: z.string().describe('Coin type to check, such as ETH, BTC, etc.'),
      address: z.string().optional().describe('Address to check (either address or txid must be provided)'),
      txid: z.string().optional().describe('Transaction hash to check (either address or txid must be provided)'),
    },
    async ({ coin, address, txid }): Promise<CallToolResult> => {
      // Handle null values, convert to undefined
      const addressParam = address || undefined;
      const txidParam = txid || undefined;
      
      if (!addressParam && !txidParam) {
        return {
          content: [
            {
              type: 'text',
              text: 'Either address or txid parameter must be provided'
            }
          ]
        };
      }
      
      // Currently only supports address analysis
      if (txidParam) {
        return {
          content: [
            {
              type: 'text',
              text: 'Transaction hash analysis is not supported yet'
            }
          ]
        };
      }
      
      try {
        // Import analysis client
        const { MistTrackClientManager } = await import('../utils/misttrackClientManager.js');
        const client = MistTrackClientManager.getClient();
        
        // Get risk score
        const result = await client.getRiskScore(coin, addressParam);
        
        if (result.success) {
          const data = result.data || {};
          const score = data.score || 0;
          const level = data.level || 'Unknown';
          
          let riskLevel = 'Unknown';
          if (level === 'low') riskLevel = 'Low Risk';
          else if (level === 'medium') riskLevel = 'Medium Risk';
          else if (level === 'high') riskLevel = 'High Risk';
          
          const textResult = `Address: ${addressParam}
Coin: ${coin}
Risk Score: ${score}
Risk Level: ${riskLevel}`;
          
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
                text: `Failed to get risk score: ${result.msg || 'Unknown error'}`
              }
            ]
          };
        }
      } catch (e: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to get risk score: ${e.message}`
            }
          ]
        };
      }
    }
  );
}