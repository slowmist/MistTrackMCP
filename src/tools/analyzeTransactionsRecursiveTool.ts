import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { TransactionsAnalyzer } from '../utils/transactionsAnalyzer.js';

/**
 * Register transaction recursive analysis tool to MCP server
 * @param server MCP server instance
 */
export function registerAnalyzeTransactionsRecursiveTool(server: McpServer): void {
  server.tool(
    'analyze_transactions_recursive',
    'Recursively analyze transaction relationships and build transaction graph',
    {
      coin: z.string().describe('Cryptocurrency type, such as ETH, BTC, etc.'),
      address: z.string().describe('Address to analyze'),
      max_depth: z.number().min(1).max(3).default(1).describe('Maximum analysis depth (default is 1 layer)'),
      start_timestamp: z.number().optional().describe('Start timestamp (optional)'),
      end_timestamp: z.number().optional().describe('End timestamp (optional)'),
      transaction_type: z.enum(['in', 'out', 'all']).optional().describe('Transaction type, can be "in", "out", or "all" (optional)'),
    },
    async ({ coin, address, max_depth, start_timestamp, end_timestamp, transaction_type }): Promise<CallToolResult> => {
      try {
        // Create transaction analyzer instance
        const analyzer = new TransactionsAnalyzer();
        
        // Execute analysis
        const report = await analyzer.analyzeAndFormat(
          coin,
          address,
          start_timestamp,
          end_timestamp,
          transaction_type,
          max_depth
        );
        
        // Format analysis report as text
        const textReport = analyzer.formatAnalysisReportAsText(report);
        
        return {
          content: [
            {
              type: 'text',
              text: textReport
            }
          ]
        };
      } catch (e: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to analyze transactions: ${e.message || 'Unknown error'}`
            }
          ]
        };
      }
    }
  );
} 