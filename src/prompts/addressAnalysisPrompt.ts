import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Register address analysis prompt
 * @param server MCP server instance
 */
export function registerAddressAnalysisPrompt(server: McpServer) {
  server.prompt(
    "analyze-address",
    {
      coin: z.string(),
      address: z.string()
    },
    ({ coin, address }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please analyze the following ${coin} blockchain address: ${address}

First use detect_address_chain to confirm the address type, then use get_address_overview to view address overview information, and finally use get_address_labels to see if the address has relevant labels. If the address has risk, please use get_risk_score to check the risk score.

Please provide the following information:
1. Address type and balance
2. Address labels (if any)
3. Risk score (if applicable)
4. MistTrack dashboard URL and blockchain explorer URL for this address

Use get_url_info to obtain relevant links.`
        }
      }]
    })
  );
} 