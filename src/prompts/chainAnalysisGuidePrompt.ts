import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Register chain analysis guide prompt
 * @param server MCP server instance
 */
export function registerChainAnalysisGuidePrompt(server: McpServer) {
  server.prompt(
    "chain-analysis-guide",
    {
      coin: z.string()
    },
    ({ coin }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `The following is a guide for analyzing suspicious activities on the ${coin} blockchain:

Please use the following tools for analysis:
1. get_address_labels - Check address labels and types
2. get_risk_score - Get risk scores and risk details
3. get_address_overview - Get balance and statistical information
4. get_address_action - Analyze transaction history and behavior patterns
5. check_malicious_funds - Check if there are malicious fund risks
6. get_address_counterparty - Identify associations with known high-risk entities
7. get_address_trace - Evaluate platform usage and threat intelligence
8. analyze_transactions_recursive - Analyze transaction relationships and fund flows
9. get_dashboard_url - Get MistTrack dashboard URL for in-depth analysis
10. get_chain_explorer_url - Get blockchain explorer URL to verify on-chain data

Analysis tips:
- Focus on interactions with mixers, high-risk exchanges, and known blacklisted addresses
- Look for abnormally large transactions, frequent small transfers, and dispersed transfer patterns
- Check the source and final destination of funds, especially paths leading to exchanges or mixers
- Identify addresses related to known security incidents (such as hacking attacks, scams)
- Analyze address labels and associated entities to reveal possible identity information
- When evaluating risk, comprehensively consider behavioral patterns, associations, and history

Please provide a detailed risk analysis report based on the results of the above tools.`
        }
      }]
    })
  );
} 