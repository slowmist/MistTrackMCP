import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Register multi-coin comprehensive analysis prompt
 * @param server MCP server instance
 */
export function registerComprehensiveAnalysisMultiCoinPrompt(server: McpServer) {
  server.prompt(
    "comprehensive-analysis-multi-coin",
    {
      address: z.string()
    },
    ({ address }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please analyze this blockchain address: ${address}

Please follow these steps for a comprehensive analysis:
1. First use detect_address_chain to detect the blockchain the address belongs to and potential supported tokens
2. Once possible blockchains and tokens are determined, use the following tools to analyze each possible coin type:
   - get_address_labels - Get address labels and type information
   - get_risk_score - Get risk score and risk analysis
   - get_address_overview - Get balance and statistical information
   - get_address_action - Get transaction operation analysis results
   - check_malicious_funds - Check if there are malicious funds
   - get_address_counterparty - Get counterparty analysis results
   - get_address_trace - Get platform usage and threat intelligence
   - analyze_transactions_recursive - Analyze transaction relationships and fund flows
   - get_url_info - Get MistTrack dashboard and blockchain explorer URLs

3. If the address is active on multiple blockchains, please analyze each blockchain separately and compare activity differences across different chains

Based on the information collected above, please provide a comprehensive cross-chain analysis report, including:
1. Overview of address activity on each chain
2. Cross-chain fund flows and transfer patterns
3. Comprehensive risk assessment and suspicious behavior analysis
4. Cross-chain associations and identity correlation analysis
5. Whether there is money laundering, fund dispersion, or other illegal activities
6. Recommended monitoring and investigation measures
7. Detailed analysis results on each chain`
        }
      }]
    })
  );
} 