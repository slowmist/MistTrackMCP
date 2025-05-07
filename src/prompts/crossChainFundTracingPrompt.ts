import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Register cross-chain fund flow analysis prompt
 * @param server MCP server instance
 */
export function registerCrossChainFundTracingPrompt(server: McpServer) {
  server.prompt(
    "cross-chain-fund-tracing",
    {
      address: z.string()
    },
    ({ address }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please conduct cross-chain fund flow tracing analysis for the blockchain address: ${address}

Analysis steps:
1. Use the detect_address_chain tool to detect all blockchains potentially supported by the address
2. For each detected chain, use the following tools for analysis:
   - get_address_overview - Get balance and transaction statistics
   - get_address_action - Get transaction behavior analysis
   - get_address_trace - Get threat intelligence and platform usage information
   - get_address_counterparty - Get main transaction counterparties
   - analyze_transactions_recursive - Analyze fund flows
   - check_malicious_funds - Check malicious fund risks

3. For EVM-compatible chains (such as ETH, BSC, AVAX, MATIC, etc.), pay special attention to:
   - Comparison of activities of the same address on different chains
   - Cross-chain bridge transactions and asset transfer patterns
   - Similarities and differences in counterparties across chains

4. Key analysis points:
   - Timeline and amount patterns of cross-chain fund transfers
   - Whether cross-chain transfers are used to evade tracking
   - Differences in risk scores across chains
   - Final destination of funds and possible aggregation addresses

Please provide a comprehensive cross-chain fund flow analysis report, including:
1. Overview of address activity on each chain
2. Analysis of cross-chain fund transfer patterns
3. Comparison of risk assessments across chains
4. Possible identity associations and entity identification
5. Key paths for cross-chain fund tracking
6. Comprehensive risk assessment and security recommendations`
        }
      }]
    })
  );
} 