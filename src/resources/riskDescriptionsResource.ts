import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Get risk description glossary content
 * @returns Risk description glossary content
 */
function getRiskDescriptionsContent(): string {
  return `Risk Description Glossary:
- Malicious Address: Addresses directly involved in malicious events, such as: DeFi protocol attackers, centralized exchange hackers, sanctioned addresses, etc.
- Suspected Malicious Address: Addresses associated with malicious events
- High-Risk Tagged Address: High-risk entity addresses, such as: mixers, some nested exchanges, etc.
- Medium-Risk Tagged Address: Medium-risk entity addresses, such as: gambling, exchanges without KYC requirements, etc.
- Mixer: Mixing service entity addresses, such as: Tornado Cash, etc.
- Sanctioned Entity: Sanctioned entity addresses, such as: Garantex, etc.
- Risky Exchange: Exchanges without KYC requirements
- Gambling: Gambling entity addresses
- Involved in Theft Activity: Addresses involved in theft events
- Involved in Ransomware Activity: Addresses involved in ransomware events
- Involved in Phishing Activity: Addresses involved in phishing events
- Interacted with Malicious Address: Has interactions with malicious addresses
- Interacted with Suspected Malicious Address: Has interactions with suspected malicious addresses
- Interacted with High-Risk Tagged Address: Has interactions with high-risk addresses
- Interacted with Medium-Risk Tagged Address: Has interactions with medium-risk addresses`;
}

/**
 * Register risk description glossary resource
 * @param server MCP server instance
 */
export function registerRiskDescriptionsResource(server: McpServer) {
  server.resource(
    "risk-descriptions",
    "misttrack://risk_descriptions",
    async (uri) => ({
      contents: [{
        uri: uri.href,
        text: getRiskDescriptionsContent(),
        mime: "text/plain"
      }]
    })
  );
} 