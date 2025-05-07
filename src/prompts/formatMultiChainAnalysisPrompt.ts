import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Register format multi-chain analysis prompt
 * @param server MCP server instance
 */
export function registerFormatMultiChainAnalysisPrompt(server: McpServer) {
  server.prompt(
    "format-multi-chain-analysis",
    {
      address: z.string()
    },
    ({ address }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Based on my cross-chain analysis of address [${address}], please organize the results into an attractive report with the following format:

# 🌐 Multi-Chain Address Analysis Report

## 📊 Address Basic Information
- **Address**: \`${address}\`
- **Detected Chains**: [List all detected blockchains]
- **Comprehensive Risk Score**: [Comprehensive risk score]/100 [Risk level]

## 💹 Activity Overview on Each Chain
### [Blockchain 1] Activity:
- **Supported Coins**: [List of coins]
- **Current Total Assets**: [Amount in USD]
- **Activity Level**: [High/Medium/Low]
- **Risk Score**: [Score]/100 [Risk level]
- **Main Interactions**: [Main interacting entities]

### [Blockchain 2] Activity:
- **Supported Coins**: [List of coins]
- **Current Total Assets**: [Amount in USD]
- **Activity Level**: [High/Medium/Low]
- **Risk Score**: [Score]/100 [Risk level]
- **Main Interactions**: [Main interacting entities]

## ⚠️ Risk Factor Analysis
- **Cross-Chain Activity Characteristics**: [Describe cross-chain activity features]
- **Main Risk Factors**: [List risk factors]
- **Abnormal Behavior Patterns**: [Describe abnormal behaviors, such as fund dispersion, etc.]

## 🔄 Cross-Chain Fund Flow
- **Main Cross-Chain Paths**: [Describe main cross-chain fund transfer paths]
- **Cross-Chain Transfer Amounts**: [Describe cross-chain amount characteristics]
- **Cross-Chain Timing Patterns**: [Describe cross-chain timing patterns]

## 👥 Identity Association Analysis
- **Possible Entity Type**: [Such as individual user/exchange/project team, etc.]
- **Associated Addresses**: [Other addresses associated with this one]
- **Cross-Chain Identity Evidence**: [Evidence supporting identity associations]

## 🔗 Related Links
- **Blockchain Explorer Links**: [List blockchain explorer URLs for each chain]
- **MistTrack Dashboard**: [URL link]

## 📝 Comprehensive Assessment
[Provide a 3-5 sentence comprehensive assessment, including cross-chain activity characteristics, risk assessment, possible identity and purpose, and other key information]

If the analysis results don't completely match the above template, please flexibly adjust the format, ensuring all important information is included and attractively presented. Use emojis and markdown formatting to enhance readability.`
        }
      }]
    })
  );
} 