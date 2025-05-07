# MistTrack MCP Server

This project provides a MCP server for Claude AI to connect to the MistTrack blockchain analysis API. Through this server, Claude can directly access and analyze blockchain data, helping users with blockchain asset tracking, risk assessment, and transaction analysis.

## Installation

### Global Installation

```bash
npm install -g misttrack
```

## Configuration in Claude

To use this MCP server in the Claude desktop application, add the following to Claude's configuration file:

```json
{
  "mcpServers": {
    "misttrack": {
      "command": "npx",
      "args": [
        "-y",
        "misttrack@latest",
        "--key",
        "YOUR_MISTTRACK_API_KEY"
      ]
    }
  }
}
```

## Command Line Options

| Option | Description | Default Value |
|------|------|--------|
| `-k, --key <key>` | MistTrack API Key | - |
| `-u, --base-url <url>` | MistTrack API Base URL | https://openapi.misttrack.io |
| `-r, --rate-limit <limit>` | API rate limit (requests per second) | 1.0 |
| `-m, --max-retries <retries>` | Maximum retry count | 3 |
| `-d, --retry-delay <delay>` | Retry delay (seconds) | 1.0 |
| `-b, --retry-backoff <backoff>` | Retry backoff multiplier | 2.0 |



## Supported MistTrack Tools

This MCP server provides the following MistTrack tools:

- `mcp_misttrack_detect_address_chain` - Detect the blockchain and possible tokens supported by the address
- `mcp_misttrack_get_address_labels` - Get label list for specified address
- `mcp_misttrack_get_address_overview` - Get balance and statistics for specified address
- `mcp_misttrack_get_address_action` - Get transaction operation analysis results for specified address
- `mcp_misttrack_get_address_trace` - Get profile for specified address, including platform interaction list and related threat intelligence data
- `mcp_misttrack_get_address_counterparty` - Get transaction counterparty analysis results for specified address
- `mcp_misttrack_check_malicious_funds` - Check if specified address has malicious funds (like blacklisted USDT)
- `mcp_misttrack_get_risk_score` - Get risk score for specified address or transaction hash
- `mcp_misttrack_get_dashboard_url` - Generate MistTrack dashboard URL based on coin and address
- `mcp_misttrack_get_chain_explorer_url` - Generate blockchain explorer URL based on coin and address
- `mcp_misttrack_get_url_info` - Get comprehensive URL information for specified address, including dashboard URL and blockchain explorer URL
- `analyze_transactions_recursive` - Recursively analyze transaction relationships and build transaction graph for multiple-layer funds tracing

## Advanced Tools

### Transaction Recursive Analysis

The `analyze_transactions_recursive` tool provides advanced multi-layer transaction analysis capabilities:

```typescript
{
  coin: string;              // Cryptocurrency type (ETH, BTC, etc.)
  address: string;           // Address to analyze
  max_depth: number;         // Maximum analysis depth (1-3, default: 1)
  start_timestamp?: number;  // Optional start timestamp
  end_timestamp?: number;    // Optional end timestamp
  transaction_type?: 'in' | 'out' | 'all';  // Optional transaction type filter
}
```

This tool recursively analyzes blockchain transactions to:

- Build a comprehensive transaction graph showing fund flows
- Identify important addresses (exchanges, mixers, suspicious services, etc.)
- Create visualizable fund flow paths
- Generate detailed statistics on transaction relationships

Example usage in Claude:

```
I need to analyze potential fund flows for this Bitcoin address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
Can you analyze it to a depth of 2 layers?
```

Claude will automatically use the tool to provide detailed multi-layer analysis of the address.

## License

ISC 