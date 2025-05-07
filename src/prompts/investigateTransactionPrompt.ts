import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Register transaction investigation prompt
 * @param server MCP server instance
 */
export function registerInvestigateTransactionPrompt(server: McpServer) {
  server.prompt(
    "investigate-transaction",
    {
      coin: z.string(),
      txid: z.string()
    },
    ({ coin, txid }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please help me investigate this ${coin} transaction: ${txid}

Please use the following tools to obtain detailed information:
1. get_risk_score - Get transaction risk score and security assessment
2. check_malicious_funds - Check if it involves malicious activities or suspicious funds
3. get_chain_explorer_url - Get the link to this transaction in the blockchain explorer

Based on the above information, please provide a transaction analysis report, focusing on:
1. The transaction's risk score and security status
2. The amount and impact involved in the transaction
3. The history and credibility of transaction participants
4. Whether there are associations with known malicious activities
5. Recommended follow-up actions (if needed)`
        }
      }]
    })
  );
} 