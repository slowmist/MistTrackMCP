import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Register recursive transaction analysis prompt
 * @param server MCP server instance
 */
export function registerRecursiveTransactionAnalysisPrompt(server: McpServer) {
  server.prompt(
    "recursive-transaction-analysis",
    {
      coin: z.string(),
      address: z.string()
    },
    ({ coin, address }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please conduct deep recursive transaction analysis for the ${coin} address: ${address}

Please use the following tools for fund flow and transaction relationship analysis:
1. analyze_transactions_recursive - Recursively analyze transaction relationships, supports setting transaction type and depth
2. get_address_labels - Get label information for related addresses
3. get_risk_score - Get risk scores for related addresses
4. get_address_trace - Get threat intelligence information for related addresses
5. check_malicious_funds - Check if related addresses contain malicious funds
6. get_url_info - Get MistTrack dashboard and blockchain explorer links for related addresses

Analysis key points:
1. Analyze fund inflows (transaction_type="in") and outflows (transaction_type="out") separately
2. Gradually increase analysis depth (max_depth parameter) from shallow to deep, recommend starting from 1, then increase to 2 or 3 as needed
3. Focus on high-value transaction paths and suspicious fund flows
4. Conduct detailed analysis on key node addresses to determine their risk status and identity labels
5. Identify final fund flow destinations (such as exchanges, mixers, etc.)
6. Detect if there are dispersed transfers, circular transfers, or other money laundering techniques

Please provide a detailed transaction graph analysis report, including:
1. Main fund flow paths
2. Key node addresses and their risk status
3. Analysis of final fund destinations
4. Identification of suspicious transaction patterns
5. Risk assessment and security recommendations`
        }
      }]
    })
  );
} 