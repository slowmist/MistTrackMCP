import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Get MistTrack API documentation content
 * @returns API documentation content (Markdown format)
 */
function getApiDocContent(): string {
  return `# MistTrack MCP Blockchain Security Analysis Tool

## 🔍 Overview
MistTrack MCP is a powerful blockchain security analysis tool designed for tracking crypto assets, identifying suspicious transactions, and evaluating address risks. It provides a comprehensive set of features to help security analysts, law enforcement agencies, and blockchain professionals conduct efficient on-chain investigations and risk assessments.

## ✨ Key Features
1. **Address Analysis** - Comprehensive analysis of blockchain address activities, risks, and associations
2. **Transaction Investigation** - In-depth examination of transaction details, fund flows, and risk scores
3. **Multi-Chain Support** - Analysis and tracking across multiple blockchain networks
4. **Risk Assessment** - Precise evaluation of address and transaction risk levels
5. **Threat Intelligence** - Information on associations with known security incidents and entities
6. **Fund Flow Tracking** - Recursive analysis of fund flows and transaction relationship graphs
7. **Tainted Fund Detection** - Identification of funds associated with malicious activities (e.g., "tainted USDT")

## 🛠 Available Tools

### Address Identification and Analysis
- **detect_address_chain** - Detect blockchain and possible tokens based on address format
- **get_address_labels** - Get the list of labels for the specified address
- **get_address_overview** - Get balance and statistics for the specified address
- **get_risk_score** - Get risk score for the specified address or transaction hash

### Transaction and Fund Analysis
- **get_address_action** - Get transaction action analysis results for the specified address
- **get_address_counterparty** - Get transaction counterparty analysis results for the specified address
- **analyze_transactions_recursive** - Recursively analyze transaction relationships and build transaction graphs
- **check_malicious_funds** - Check if the specified address contains malicious funds (e.g., tainted USDT)

### Threat Intelligence
- **get_address_trace** - Get configuration profile for the specified address, including interacted platforms and related threat intelligence data

### URLs and Links
- **get_dashboard_url** - Generate MistTrack dashboard URL based on coin type and address
- **get_chain_explorer_url** - Generate URL for corresponding blockchain explorer based on coin type and address
- **get_url_info** - Get comprehensive URL information for the specified address, including dashboard URL and blockchain explorer URL

## 🌐 Supported Blockchains
MistTrack MCP supports multiple mainstream blockchains, including:
- Ethereum (ETH) and its tokens (USDT-ERC20, USDC-ERC20, etc.)
- Bitcoin (BTC)
- TRON and its tokens (USDT-TRC20, etc.)
- Binance Smart Chain (BSC) and its tokens
- Polygon, Avalanche, Arbitrum, Optimism, Base, and other EVM-compatible chains
- Solana and its tokens
- Litecoin, Dogecoin, Bitcoin Cash, etc.

## 🚀 Usage
1. Use detect_address_chain to detect the blockchain associated with an address
2. Based on the detection results, use the appropriate analysis tools to obtain address information
3. Evaluate address risk and track fund flows
4. Generate analysis reports and visualized results
5. Further investigate through dashboard and explorer URLs

## 🔒 Risk Assessment
MistTrack provides risk scores from 0-100, divided into four levels:
- Severe: 91-100 - Prohibit withdrawals and transactions, report immediately
- High: 71-90 - Requires high-level monitoring and analysis
- Moderate: 31-70 - Requires moderate supervision
- Low: 0-30 - Requires minimal supervision

## 📊 Use Cases
- Fund security monitoring for exchanges and financial institutions
- Investigation of hacking attacks and crypto asset theft cases
- Anti-Money Laundering (AML) compliance checks
- Identification of addresses associated with sanctioned entities
- Tracking cross-chain fund flows
- Assessing the risk status of new counterparties`;
}

/**
 * Register API documentation resource
 * @param server MCP server instance
 */
export function registerApiDocResource(server: McpServer) {
  server.resource(
    "api-doc",
    "misttrack://api_doc",
    async (uri) => ({
      contents: [{
        uri: uri.href,
        text: getApiDocContent(),
        mime: "text/markdown"
      }]
    })
  );
} 