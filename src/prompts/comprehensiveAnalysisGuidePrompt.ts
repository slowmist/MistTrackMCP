import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Register comprehensive analysis guide prompt
 * @param server MCP server instance
 */
export function registerComprehensiveAnalysisGuidePrompt(server: McpServer) {
  server.prompt(
    "comprehensive-analysis-guide",
    {
      coin: z.string(),
      address: z.string()
    },
    ({ coin, address }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please analyze this ${coin} address: ${address}

Please use the following tools to obtain detailed information:
1. get_address_labels - Get address labels and type information
2. get_risk_score - Get risk score and risk analysis
3. get_address_overview - Get balance and statistical information
4. get_address_action - Get transaction operation analysis results
5. check_malicious_funds - Check if there are malicious funds (such as tainted USDT)
6. get_address_counterparty - Get counterparty analysis results
7. get_address_trace - Get platform usage and threat intelligence
8. analyze_transactions_recursive - Analyze transaction graph and fund flows
9. get_url_info - Get MistTrack dashboard and blockchain explorer URLs

Based on the analysis results from the above tools, please provide a complete analysis report, including:
1. Address basic information and labels
2. Risk assessment and security level
3. Transaction behavior analysis and patterns
4. Fund flow and source analysis
5. Suspicious activities and malicious indicators
6. Associations with high-risk entities
7. Platform usage (exchanges, DEX, mixers, etc.)
8. Recommended monitoring measures and precautions
9. Related links and further analysis paths`
        }
      }]
    })
  );
} 