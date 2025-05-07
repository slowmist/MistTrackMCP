import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Register risk assessment prompt
 * @param server MCP server instance
 */
export function registerRiskAssessmentPrompt(server: McpServer) {
  server.prompt(
    "risk-assessment",
    {
      coin: z.string(),
      address: z.string()
    },
    ({ coin, address }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please conduct a risk assessment for the following ${coin} blockchain address: ${address}

Please use the following tools to collect information:
1. Use get_risk_score to get the risk score
2. Use get_address_labels to view address labels
3. Use check_malicious_funds to check for malicious funds
4. Use get_address_trace to get address-related intelligence

Please comprehensively analyze the above information and provide a risk assessment report.`
        }
      }]
    })
  );
} 