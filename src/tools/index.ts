import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAddressDetectorTool } from './addressDetectorTool.js';
import { registerAddressLabelsTool } from './addressLabelsTool.js';
import { registerAddressOverviewTool } from './addressOverviewTool.js';
import { registerAddressActionTool } from './addressActionTool.js';
import { registerAddressTraceTool } from './addressTraceTool.js';
import { registerAddressCounterpartyTool } from './addressCounterpartyTool.js';
import { registerMaliciousFundsCheckTool } from './maliciousFundsCheckTool.js';
import { registerDashboardUrlTool } from './dashboardUrlTool.js';
import { registerChainExplorerUrlTool } from './chainExplorerUrlTool.js';
import { registerUrlInfoTool } from './urlInfoTool.js';
import { registerRiskScoreTool } from './riskScoreTool.js';
import { registerAnalyzeTransactionsRecursiveTool } from './analyzeTransactionsRecursiveTool.js';

/**
 * Register all blockchain address analysis tools to MCP server
 * @param server MCP server instance
 */
export function registerAllMisttrackTools(server: McpServer): void {
  // Basic address tools
  registerAddressDetectorTool(server);
  registerAddressLabelsTool(server);
  registerAddressOverviewTool(server);
  
  // Transaction analysis tools
  registerAddressActionTool(server);
  registerAddressTraceTool(server);
  registerAddressCounterpartyTool(server);
  registerAnalyzeTransactionsRecursiveTool(server);
  
  // Security analysis tools
  registerMaliciousFundsCheckTool(server);
  registerRiskScoreTool(server);
  
  // URL generation tools
  registerDashboardUrlTool(server);
  registerChainExplorerUrlTool(server);
  registerUrlInfoTool(server);
}

// Export all tool functions individually, allowing selective registration
export {
  registerAddressDetectorTool,
  registerAddressLabelsTool,
  registerAddressOverviewTool,
  registerAddressActionTool,
  registerAddressTraceTool,
  registerAddressCounterpartyTool,
  registerMaliciousFundsCheckTool,
  registerDashboardUrlTool,
  registerChainExplorerUrlTool,
  registerUrlInfoTool,
  registerRiskScoreTool,
  registerAnalyzeTransactionsRecursiveTool
}; 