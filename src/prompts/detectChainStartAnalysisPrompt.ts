import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Register chain detection analysis starting prompt
 * @param server MCP server instance
 */
export function registerDetectChainStartAnalysisPrompt(server: McpServer) {
  server.prompt(
    "detect-chain-start-analysis",
    {
      address: z.string()
    },
    ({ address }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please analyze this blockchain address: ${address}

First, I need to determine which blockchain this address belongs to and the tokens it might support.
Please use the detect_address_chain tool for preliminary analysis, which will return:
1. Blockchains the address might belong to (detected_chains)
2. Recommended coins for analysis (recommended_coins)
3. Address format analysis description

Based on the detect_address_chain analysis results:
1. If the address format is clearly identified (such as Bitcoin, TRON, etc.), please directly use the corresponding coin for the next step of analysis
2. If the address might belong to multiple chains (such as EVM-compatible chains), please ask the user which chain's activity they wish to analyze
3. If the address format cannot be identified, please indicate that it cannot be determined and suggest possible directions to try

For the determined chain and token, use the following tools for further analysis:
- get_address_labels - Get address labels
- get_risk_score - Get risk score
- get_address_overview - Get balance information
- Other relevant tools

Please provide analysis results and next-step recommendations.`
        }
      }]
    })
  );
} 