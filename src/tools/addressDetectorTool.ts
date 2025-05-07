import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * Register address detection tool to MCP server
 * Detect blockchain and possible tokens based on address format features
 * @param server MCP server instance
 */
export function registerAddressDetectorTool(server: McpServer): void {
  server.tool(
    'detect_address_chain',
    'Detect blockchain and possible tokens based on address format features',
    {
      address: z.string().describe('Address to detect'),
    },
    async ({ address }): Promise<CallToolResult> => {
      // Clean up any whitespace at the beginning or end of the address
      address = address.trim();
      
      let result: {
        success: boolean;
        address: string;
        detected_chains: string[];
        description: string;
        recommended_coins: string[];
      };
      
      // Check Ethereum series addresses (including ETH, BNB Smart Chain, AVAX C-Chain, MATIC and other EVM chains)
      if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
        result = {
          success: true,
          address: address,
          detected_chains: ["ETH", "BSC", "AVAX", "MATIC", "ARBITRUM", "OPTIMISM"],
          description: "This is an Ethereum format address, which may apply to multiple EVM-compatible chains, including Ethereum, Binance Smart Chain, Avalanche C-Chain, Polygon, etc.",
          recommended_coins: ["ETH", "BSC", "MATIC", "AVAX", "USDT-ERC20", "USDC-ERC20", "WETH-ERC20", "BNB-ERC20", "UNI-ERC20", "BUSD-ERC20", "DAI-ERC20"]
        };
      } 
      // Check Bitcoin addresses
      else if ((address.startsWith('1') || address.startsWith('3') || address.startsWith('bc1')) && address.length >= 26 && address.length <= 35) {
        result = {
          success: true,
          address: address,
          detected_chains: ["BTC"],
          description: "This is a Bitcoin format address.",
          recommended_coins: ["BTC"]
        };
      }
      // Check Tron addresses
      else if (/^T[a-zA-Z0-9]{33}$/.test(address)) {
        result = {
          success: true,
          address: address,
          detected_chains: ["TRX"],
          description: "This is a TRON format address.",
          recommended_coins: ["TRX", "USDT-TRC20"]
        };
      }
      // Check Ripple addresses
      else if (/^r[a-zA-Z0-9]{24,34}$/.test(address)) {
        result = {
          success: true,
          address: address,
          detected_chains: ["XRP"],
          description: "This is a Ripple format address.",
          recommended_coins: ["XRP"]
        };
      }
      // Check Solana addresses
      else if (address.length === 44 || address.length === 43) {
        // Solana addresses are typically 43-44 characters long, base58 encoded
        // Note: There's no direct base58 decoder in TypeScript, so we use a simple heuristic method
        if (/^[1-9A-HJ-NP-Za-km-z]{43,44}$/.test(address)) {
          result = {
            success: true,
            address: address,
            detected_chains: ["SOL"],
            description: "This may be a Solana format address.",
            recommended_coins: ["SOL"]
          };
        } else {
          result = {
            success: false,
            address: address,
            detected_chains: [],
            description: "Unable to recognize this address format. Please try to specify the coin type manually for querying.",
            recommended_coins: []
          };
        }
      }
      // If chain type cannot be determined
      else {
        result = {
          success: false,
          address: address,
          detected_chains: [],
          description: "Unable to recognize this address format. Please try to specify the coin type manually for querying.",
          recommended_coins: []
        };
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    }
  );
} 