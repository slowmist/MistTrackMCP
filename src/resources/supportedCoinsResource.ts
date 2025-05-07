import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Register supported coins resource
 * @param server MCP server instance
 */
export function registerSupportedCoinsResource(server: McpServer) {
  server.resource(
    "supported-coins",
    "coins://list",
    async (uri) => ({
      contents: [{
        uri: uri.href,
        text: JSON.stringify({
          coins: [
            "ETH", "BTC", "USDT-ERC20", "USDT-TRC20", "USDC", "BNB", "TRX",
            "SOL", "XRP", "ADA", "AVAX", "MATIC", "DOT", "TON"
          ]
        })
      }]
    })
  );
} 