import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Register format analysis results prompt
 * @param server MCP server instance
 */
export function registerFormatAnalysisResultsPrompt(server: McpServer) {
  server.prompt(
    "format-analysis-results",
    {
      coin: z.string(),
      address: z.string()
    },
    ({ coin, address }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Based on my analysis of the ${coin} address [${address}], please organize the results into an attractive report with the following format:

# 🔍 ${coin} Address Analysis Report

## 📊 Basic Information
- **Address**: \`${address}\`
- **Blockchain**: [Blockchain name, e.g., TRON]
- **Supported Coins**: [List supported coins]
- **Address Labels**: [List labels if any, otherwise mark as "No clear labels"]
- **Risk Score**: [Score]/100 [Risk level]

## 💰 Fund Activities
### ${coin} Fund Activities:
- **Current Balance**: [Balance] ${coin}
- **Total Transactions**: [Number of transactions]
- **Total Received**: [Total received] ${coin}
- **Total Spent**: [Total spent] ${coin}
- **Net Inflow**: [Net inflow] ${coin}
- **Active Period**: [Start date] to [End date] ([Duration])

### [Second Coin Type] Fund Activities (if applicable):
- **Current Balance**: [Balance] [Coin]
- **Total Transactions**: [Number of transactions]
- **Total Received**: [Total received] [Coin]
- **Total Spent**: [Total spent] [Coin]
- **Net Inflow**: [Net inflow] [Coin]
- **Active Period**: [Start date] to [End date] ([Duration])

## ⚠️ Risk Factors
- [List main risk factors, e.g., "Interactions with suspicious malicious addresses"]
- **Main Risk Types**: [List risk types, such as Theft, Phishing, etc.]

## 🔄 Counterparty Analysis
- [List main counterparties, such as "Huobi", "OKX", etc.]
- **Number of Main Counterparties**: [Number]

## 🔗 Link Information
- **MistTrack Dashboard**: [URL link]
- **Blockchain Explorer**: [URL link]

## 📝 Summary Assessment
[Provide 2-3 short summary sentences, including key information about address type, risk level, fund flow characteristics, etc.]

If the analysis results don't completely match the above template, please flexibly adjust the format, ensuring all important information is included and attractively presented. Use emojis and markdown formatting to enhance readability.`
        }
      }]
    })
  );
} 