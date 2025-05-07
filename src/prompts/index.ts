import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAddressAnalysisPrompt } from './addressAnalysisPrompt.js';
import { registerRiskAssessmentPrompt } from './riskAssessmentPrompt.js';
import { registerComprehensiveAnalysisPrompt } from './comprehensiveAnalysisPrompt.js';
import { registerBlackUsdtDetectionPrompt } from './blackUsdtDetectionPrompt.js';
import { registerChainAnalysisGuidePrompt } from './chainAnalysisGuidePrompt.js';
import { registerComprehensiveAnalysisGuidePrompt } from './comprehensiveAnalysisGuidePrompt.js';
import { registerComprehensiveAnalysisMultiCoinPrompt } from './comprehensiveAnalysisMultiCoinPrompt.js';
import { registerCrossChainFundTracingPrompt } from './crossChainFundTracingPrompt.js';
import { registerDetectChainStartAnalysisPrompt } from './detectChainStartAnalysisPrompt.js';
import { registerFormatAnalysisResultsPrompt } from './formatAnalysisResultsPrompt.js';
import { registerFormatMultiChainAnalysisPrompt } from './formatMultiChainAnalysisPrompt.js';
import { registerFormatTransactionAnalysisPrompt } from './formatTransactionAnalysisPrompt.js';
import { registerInvestigateTransactionPrompt } from './investigateTransactionPrompt.js';
import { registerRecursiveTransactionAnalysisPrompt } from './recursiveTransactionAnalysisPrompt.js';

/**
 * Register all MistTrack prompts
 * @param server MCP server instance
 */
export function registerAllMisttrackPrompts(server: McpServer) {

  // Register various prompt plugins
  registerAddressAnalysisPrompt(server);
  registerRiskAssessmentPrompt(server);
  registerComprehensiveAnalysisPrompt(server);
  registerBlackUsdtDetectionPrompt(server);
  registerChainAnalysisGuidePrompt(server);
  registerComprehensiveAnalysisGuidePrompt(server);
  registerComprehensiveAnalysisMultiCoinPrompt(server);
  registerCrossChainFundTracingPrompt(server);
  registerDetectChainStartAnalysisPrompt(server);
  registerFormatAnalysisResultsPrompt(server);
  registerFormatMultiChainAnalysisPrompt(server);
  registerFormatTransactionAnalysisPrompt(server);
  registerInvestigateTransactionPrompt(server);
  registerRecursiveTransactionAnalysisPrompt(server);

}

// Export all prompt plugins, allowing selective registration
export {
  registerAddressAnalysisPrompt,
  registerRiskAssessmentPrompt,
  registerComprehensiveAnalysisPrompt,
  registerBlackUsdtDetectionPrompt,
  registerChainAnalysisGuidePrompt,
  registerComprehensiveAnalysisGuidePrompt,
  registerComprehensiveAnalysisMultiCoinPrompt,
  registerCrossChainFundTracingPrompt,
  registerDetectChainStartAnalysisPrompt,
  registerFormatAnalysisResultsPrompt,
  registerFormatMultiChainAnalysisPrompt,
  registerFormatTransactionAnalysisPrompt,
  registerInvestigateTransactionPrompt,
  registerRecursiveTransactionAnalysisPrompt
}; 