import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Register format transaction analysis prompt
 * @param server MCP server instance
 */
export function registerFormatTransactionAnalysisPrompt(server: McpServer) {
  server.prompt(
    "format-transaction-analysis",
    {
      coin: z.string(),
      txid: z.string()
    },
    ({ coin, txid }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Based on my analysis of the ${coin} transaction [${txid}], please organize the results into an attractive report with the following format:

# 🔎 ${coin} Transaction Analysis Report

## 📊 Transaction Basic Information
- **Transaction Hash**: \`${txid}\`
- **Blockchain**: [Blockchain name]
- **Transaction Status**: [Success/Failed/Pending]
- **Risk Score**: [Score]/100 [Risk level]

## 💸 Transaction Details
- **Transaction Amount**: [Amount] ${coin}
- **Sender**: [Address] [Label, if any]
- **Receiver**: [Address] [Label, if any]
- **Transaction Time**: [Date and time]
- **Block Height**: [Block height]
- **Transaction Fee**: [Fee] ${coin}

## ⚠️ Risk Assessment
- **Risk Factors**: [List risk factors, such as "Interaction with suspicious addresses"]
- **Related Security Incidents**: [List related security incidents if any]
- **Illicit Fund Detection Results**: [Whether illicit funds were detected]

## 🔄 Fund Source and Destination
- **Fund Source**: [Describe fund source]
- **Further Flow**: [Describe subsequent fund flow]

## 🔗 Related Links
- **Blockchain Explorer**: [URL link]
- **MistTrack Dashboard**: [URL link, if available]

## 📝 Summary Assessment
[Provide 2-3 short summary sentences, including transaction characteristics, risk situation, recommended actions, and other key information]

If the analysis results don't completely match the above template, please flexibly adjust the format, ensuring all important information is included and attractively presented. Use emojis and markdown formatting to enhance readability.`
        }
      }]
    })
  );
} 