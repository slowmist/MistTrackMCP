import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Get risk level guide content
 * @returns Risk level guide content
 */
function getRiskLevelGuideContent(): string {
  return `Risk Level Guide:
Severe: 91 ~ 100 - Prohibit withdrawals and transactions, report address immediately
High: 71 ~ 90 - Maintain high-level monitoring, analyze transactions through MistTrack AML platform or OpenAPI
Moderate: 31 ~ 70 - Requires moderate supervision
Low: 0 ~ 30 - Requires minimal supervision`;
}

/**
 * Register risk level guide resource
 * @param server MCP server instance
 */
export function registerRiskLevelGuideResource(server: McpServer) {
  server.resource(
    "risk-level-guide",
    "misttrack://risk_level_guide",
    async (uri) => ({
      contents: [{
        uri: uri.href,
        text: getRiskLevelGuideContent(),
        mime: "text/plain"
      }]
    })
  );
} 