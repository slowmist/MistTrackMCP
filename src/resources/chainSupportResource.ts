import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Get MistTrack supported blockchains and tokens information
 * @returns Blockchain and token information
 */
function getChainSupportContent(): string {
  return `Blockchains and tokens supported by MistTrack, the following values must be passed in the coin parameter of all functions, otherwise an error will be reported:
Ethereum:
ETH, USDT-ERC20, USDC-ERC20, WETH-ERC20, BNB-ERC20, UNI-ERC20, BUSD-ERC20, DAI-ERC20, etc.

Bitcoin:
BTC

TRON:
TRX, USDT-TRC20, USDC-TRC20

Binance Smart Chain (BSC):
BNB, BUSD-BEP20, USDT-BEP20, WBNB-BEP20, etc.

IoTeX:
IOTX

Polygon:
MATIC-Polygon, WMATIC-Polygon, WETH-Polygon, etc.

Avalanche:
AVAX-Avalanche, WAVAX-Avalanche, etc.

Arbitrum One:
ETH-Arbitrum, USDT-Arbitrum, etc.

OP Mainnet:
ETH-Optimism, USDT-Optimism, etc.

Base:
ETH-Base, USDC-Base, etc.

zkSync Era:
ETH-zkSync, ZK-zkSync

Merlin Chain:
BTC-Merlin

Toncoin:
TON, USDT-TON

Solana:
SOL, USDT-Solana, USDC-Solana, etc.

Litecoin:
LTC

Dogecoin:
DOGE

Bitcoin Cash:
BCH`;
}

/**
 * Register multi-chain support resource
 * @param server MCP server instance
 */
export function registerChainSupportResource(server: McpServer) {
  server.resource(
    "chain-support",
    "misttrack://chain_support",
    async (uri) => ({
      contents: [{
        uri: uri.href,
        text: getChainSupportContent(),
        mime: "text/plain"
      }]
    })
  );
} 