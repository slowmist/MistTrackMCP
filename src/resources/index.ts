import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {  } from '../MistTrackMCPServer.js';
import { registerSupportedCoinsResource } from './supportedCoinsResource.js';
import { registerApiDocResource } from './apiDocResource.js';
import { registerRiskLevelGuideResource } from './riskLevelGuideResource.js';
import { registerChainSupportResource } from './chainSupportResource.js';
import { registerRiskDescriptionsResource } from './riskDescriptionsResource.js';
import { registerUserProfileTemplateResource } from './userProfileTemplateResource.js';

/**
 * Register all MistTrack resources
 * @param server MCP server instance
 */
export function registerAllMisttrackResources(server: McpServer) {


  // Register various resource plugins
  registerSupportedCoinsResource(server);
  registerApiDocResource(server);
  registerRiskLevelGuideResource(server);
  registerChainSupportResource(server);
  registerRiskDescriptionsResource(server);
  registerUserProfileTemplateResource(server);

}

// Export all resource plugins, allowing selective registration
export {
  registerSupportedCoinsResource,
  registerApiDocResource,
  registerRiskLevelGuideResource,
  registerChainSupportResource,
  registerRiskDescriptionsResource,
  registerUserProfileTemplateResource
}; 