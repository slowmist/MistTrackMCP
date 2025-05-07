import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Register black USDT detection prompt
 * @param server MCP server instance
 */
export function registerBlackUsdtDetectionPrompt(server: McpServer) {
  server.prompt(
    "black-usdt-detection",
    {
      address: z.string()
    },
    ({ address }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please conduct black USDT detection and analysis for the address: ${address}

First use the detect_address_chain tool to determine the chains and token types supported by the address, focusing on whether it supports USDT.

For addresses that support USDT, please use the following tools for illicit fund detection:
1. check_malicious_funds - Check if the address contains malicious funds (select the correct USDT format based on chain type, such as USDT-ERC20, USDT-TRC20, etc.)
2. get_risk_score - Get the address risk score

Detection focus:
1. Check if the address is related to known hacking attacks, scams, ransomware, or other security incidents
2. Analyze if there is a history of interaction with mixers
3. Check if it's associated with known high-risk exchanges or services
4. Track the source and flow of suspicious funds
5. Evaluate the risk level and degree of suspicion for the address

Please provide a detailed illicit fund detection report, including:
1. Risk assessment results (whether there is a risk of illicit funds)
   - Risk score explanation (0-100 points)
   - Risk level (Critical/High/Medium/Low)
2. Suspicious signs and evidence found
   - Number of phishing incidents
   - Number of ransomware incidents
   - Number of theft incidents
3. Fund source and flow analysis
   - Interactions with high-risk addresses
   - Fund flow visualization suggestions
4. Related malicious event associations
   - Associations with known security incidents
   - Associations with sanctioned entities
5. Security recommendations and follow-up solutions
   - Handling suggestions based on risk level
   - Monitoring and reporting processes`
        }
      }]
    })
  );
} 