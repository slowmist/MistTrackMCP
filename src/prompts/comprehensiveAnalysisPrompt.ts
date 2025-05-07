import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Register comprehensive address analysis prompt
 * @param server MCP server instance
 */
export function registerComprehensiveAnalysisPrompt(server: McpServer) {
  server.prompt(
    "comprehensive-analysis",
    {
      coin: z.string(),
      address: z.string()
    },
    ({ coin, address }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please help me analyze this ${coin} address: ${address}

Please use the following tools to obtain detailed information:
1. get_address_labels - Get address labels and types
2. get_risk_score - Get risk score and explanation
3. get_address_overview - Get balance information and statistics
4. get_address_action - Get transaction patterns and behavior analysis
5. check_malicious_funds - Check for suspicious activities or malicious fund risks
6. get_address_counterparty - Analyze transaction counterparties
7. get_address_trace - Get threat intelligence data and platform usage
8. get_url_info - Get MistTrack dashboard and blockchain explorer URL links

Based on the above information, please provide a comprehensive analysis report, focusing on:
1. Address labels and risk score
2. Transaction activity patterns and suspicious behaviors
3. Associations with known high-risk entities
4. Fund flows and potential risks
5. If needed, provide MistTrack dashboard and blockchain explorer links for further investigation`
        }
      }]
    })
  );
} 