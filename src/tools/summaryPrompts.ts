import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * Register address-related entity analysis tools to the MCP server
 * @param server MCP server instance
 */

const summaryPrompts = `Here is a summary of all prompt contents:

### 1. Address Analysis Prompt (addressAnalysisPrompt.ts)

Please analyze the following coin blockchain address: address

First use detect_address_chain to confirm the address type, then use get_address_overview to view address overview information, and finally use get_address_labels to see if the address has relevant labels. If the address has risk, please use get_risk_score to check the risk score.

Please provide the following information:
1. Address type and balance
2. Address labels (if any)
3. Risk score (if applicable)
4. MistTrack dashboard URL and blockchain explorer URL for this address

Use get_url_info to obtain relevant links.


### 2. Black USDT Detection Prompt (blackUsdtDetectionPrompt.ts)

Please conduct black USDT detection and analysis for the address: address

First use the detect_address_chain tool to determine the chains and token types supported by the address, focusing on whether it supports USDT.

For addresses that support USDT, please use the following tools for illicit fund detection:
1. check_malicious_funds - Check if the address contains malicious funds (select the correct USDT format based on chain type, such as USDT-ERC20, USDT-TRC20, etc.)
2. get_risk_score - Get the address risk score

Detection focus:
1. Check if the address is related to known hacking attacks, scams, ransomware, or other security incidents
2. Analyze if there is a history of interaction with mixers
3. Check if it's associated with known high-risk exchanges or services
4. Track the source and flow of suspicious funds
5. Evaluate the risk level and degree of suspicion for the address

Please provide a detailed illicit fund detection report, including:
1. Risk assessment results (whether there is a risk of illicit funds)
   - Risk score explanation (0-100 points)
   - Risk level (Critical/High/Medium/Low)
2. Suspicious signs and evidence found
   - Number of phishing incidents
   - Number of ransomware incidents
   - Number of theft incidents
3. Fund source and flow analysis
   - Interactions with high-risk addresses
   - Fund flow visualization suggestions
4. Related malicious event associations
   - Associations with known security incidents
   - Associations with sanctioned entities
5. Security recommendations and follow-up solutions
   - Handling suggestions based on risk level
   - Monitoring and reporting processes


### 3. Chain Analysis Guide Prompt (chainAnalysisGuidePrompt.ts)

The following is a guide for analyzing suspicious activities on the coin blockchain:

Please use the following tools for analysis:
1. get_address_labels - Check address labels and types
2. get_risk_score - Get risk scores and risk details
3. get_address_overview - Get balance and statistical information
4. get_address_action - Analyze transaction history and behavior patterns
5. check_malicious_funds - Check if there are malicious fund risks
6. get_address_counterparty - Identify associations with known high-risk entities
7. get_address_trace - Evaluate platform usage and threat intelligence
8. analyze_transactions_recursive - Analyze transaction relationships and fund flows
9. get_dashboard_url - Get MistTrack dashboard URL for in-depth analysis
10. get_chain_explorer_url - Get blockchain explorer URL to verify on-chain data

Analysis tips:
- Focus on interactions with mixers, high-risk exchanges, and known blacklisted addresses
- Look for abnormally large transactions, frequent small transfers, and dispersed transfer patterns
- Check the source and final destination of funds, especially paths leading to exchanges or mixers
- Identify addresses related to known security incidents (such as hacking attacks, scams)
- Analyze address labels and associated entities to reveal possible identity information
- When evaluating risk, comprehensively consider behavioral patterns, associations, and history

Please provide a detailed risk analysis report based on the results of the above tools.


### 4. Comprehensive Analysis Prompt (comprehensiveAnalysisPrompt.ts)

Please help me analyze this coin address: address

Please use the following tools to obtain detailed information:
1. get_address_labels - Get address labels and types
2. get_risk_score - Get risk score and explanation
3. get_address_overview - Get balance information and statistics
4. get_address_action - Get transaction patterns and behavior analysis
5. check_malicious_funds - Check for suspicious activities or malicious fund risks
6. get_address_counterparty - Analyze transaction counterparties
7. get_address_trace - Get threat intelligence data and platform usage
8. get_url_info - Get MistTrack dashboard and blockchain explorer URL links

Based on the above information, please provide a comprehensive analysis report, focusing on:
1. Address labels and risk score
2. Transaction activity patterns and suspicious behaviors
3. Associations with known high-risk entities
4. Fund flows and potential risks
5. If needed, provide MistTrack dashboard and blockchain explorer links for further investigation


### 5. Comprehensive Analysis Guide Prompt (comprehensiveAnalysisGuidePrompt.ts)

Please analyze this coin address: address

Please use the following tools to obtain detailed information:
1. get_address_labels - Get address labels and type information
2. get_risk_score - Get risk score and risk analysis
3. get_address_overview - Get balance and statistical information
4. get_address_action - Get transaction operation analysis results
5. check_malicious_funds - Check if there are malicious funds (such as tainted USDT)
6. get_address_counterparty - Get counterparty analysis results
7. get_address_trace - Get platform usage and threat intelligence
8. analyze_transactions_recursive - Analyze transaction graph and fund flows
9. get_url_info - Get MistTrack dashboard and blockchain explorer URLs

Based on the analysis results from the above tools, please provide a complete analysis report, including:
1. Address basic information and labels
2. Risk assessment and security level
3. Transaction behavior analysis and patterns
4. Fund flow and source analysis
5. Suspicious activities and malicious indicators
6. Associations with high-risk entities
7. Platform usage (exchanges, DEX, mixers, etc.)
8. Recommended monitoring measures and precautions
9. Related links and further analysis paths


### 6. Multi-Coin Comprehensive Analysis Prompt (comprehensiveAnalysisMultiCoinPrompt.ts)

Please analyze this blockchain address: address

Please follow these steps for a comprehensive analysis:
1. First use detect_address_chain to detect the blockchain the address belongs to and potential supported tokens
2. Once possible blockchains and tokens are determined, use the following tools to analyze each possible coin type:
   - get_address_labels - Get address labels and type information
   - get_risk_score - Get risk score and risk analysis
   - get_address_overview - Get balance and statistical information
   - get_address_action - Get transaction operation analysis results
   - check_malicious_funds - Check if there are malicious funds
   - get_address_counterparty - Get counterparty analysis results
   - get_address_trace - Get platform usage and threat intelligence
   - analyze_transactions_recursive - Analyze transaction relationships and fund flows
   - get_url_info - Get MistTrack dashboard and blockchain explorer URLs

3. If the address is active on multiple blockchains, please analyze each blockchain separately and compare activity differences across different chains

Based on the information collected above, please provide a comprehensive cross-chain analysis report, including:
1. Overview of address activity on each chain
2. Cross-chain fund flows and transfer patterns
3. Comprehensive risk assessment and suspicious behavior analysis
4. Cross-chain associations and identity correlation analysis
5. Whether there is money laundering, fund dispersion, or other illegal activities
6. Recommended monitoring and investigation measures
7. Detailed analysis results on each chain


### 7. Cross-Chain Fund Tracing Prompt (crossChainFundTracingPrompt.ts)

Please conduct cross-chain fund flow tracing analysis for the blockchain address: address

Analysis steps:
1. Use the detect_address_chain tool to detect all blockchains potentially supported by the address
2. For each detected chain, use the following tools for analysis:
   - get_address_overview - Get balance and transaction statistics
   - get_address_action - Get transaction behavior analysis
   - get_address_trace - Get threat intelligence and platform usage information
   - get_address_counterparty - Get main transaction counterparties
   - analyze_transactions_recursive - Analyze fund flows
   - check_malicious_funds - Check malicious fund risks

3. For EVM-compatible chains (such as ETH, BSC, AVAX, MATIC, etc.), pay special attention to:
   - Comparison of activities of the same address on different chains
   - Cross-chain bridge transactions and asset transfer patterns
   - Similarities and differences in counterparties across chains

4. Key analysis points:
   - Timeline and amount patterns of cross-chain fund transfers
   - Whether cross-chain transfers are used to evade tracking
   - Differences in risk scores across chains
   - Final destination of funds and possible aggregation addresses

Please provide a comprehensive cross-chain fund flow analysis report, including:
1. Overview of address activity on each chain
2. Analysis of cross-chain fund transfer patterns
3. Comparison of risk assessments across chains
4. Possible identity associations and entity identification
5. Key paths for cross-chain fund tracking
6. Comprehensive risk assessment and security recommendations


### 8. Chain Detection Analysis Prompt (detectChainStartAnalysisPrompt.ts)

Please analyze this blockchain address: address

First, I need to determine which blockchain this address belongs to and the tokens it might support.
Please use the detect_address_chain tool for preliminary analysis, which will return:
1. Blockchains the address might belong to (detected_chains)
2. Recommended coins for analysis (recommended_coins)
3. Address format analysis description

Based on the detect_address_chain analysis results:
1. If the address format is clearly identified (such as Bitcoin, TRON, etc.), please directly use the corresponding coin for the next step of analysis
2. If the address might belong to multiple chains (such as EVM-compatible chains), please ask the user which chain's activity they wish to analyze
3. If the address format cannot be identified, please indicate that it cannot be determined and suggest possible directions to try

For the determined chain and token, use the following tools for further analysis:
- get_address_labels - Get address labels
- get_risk_score - Get risk score
- get_address_overview - Get balance information
- Other relevant tools

Please provide analysis results and next-step recommendations.


### 9. Transaction Investigation Prompt (investigateTransactionPrompt.ts)

Please help me investigate this coin transaction: txid

Please use the following tools to obtain detailed information:
1. get_risk_score - Get transaction risk score and security assessment
2. check_malicious_funds - Check if it involves malicious activities or suspicious funds
3. get_chain_explorer_url - Get the link to this transaction in the blockchain explorer

Based on the above information, please provide a transaction analysis report, focusing on:
1. The transaction's risk score and security status
2. The amount and impact involved in the transaction
3. The history and credibility of transaction participants
4. Whether there are associations with known malicious activities
5. Recommended follow-up actions (if needed)

### 10. Recursive Transaction Analysis Prompt (recursiveTransactionAnalysisPrompt.ts)

Please conduct deep recursive transaction analysis for the coin address: address

Please use the following tools for fund flow and transaction relationship analysis:
1. analyze_transactions_recursive - Recursively analyze transaction relationships, supports setting transaction type and depth
2. get_address_labels - Get label information for related addresses
3. get_risk_score - Get risk scores for related addresses
4. get_address_trace - Get threat intelligence information for related addresses
5. check_malicious_funds - Check if related addresses contain malicious funds
6. get_url_info - Get MistTrack dashboard and blockchain explorer links for related addresses

Analysis key points:
1. Analyze fund inflows (transaction_type="in") and outflows (transaction_type="out") separately
2. Gradually increase analysis depth (max_depth parameter) from shallow to deep, recommend starting from 1, then increase to 2 or 3 as needed
3. Focus on high-value transaction paths and suspicious fund flows
4. Conduct detailed analysis on key node addresses to determine their risk status and identity labels
5. Identify final fund flow destinations (such as exchanges, mixers, etc.)
6. Detect if there are dispersed transfers, circular transfers, or other money laundering techniques

Please provide a detailed transaction graph analysis report, including:
1. Main fund flow paths
2. Key node addresses and their risk status
3. Analysis of final fund destinations
4. Identification of suspicious transaction patterns
5. Risk assessment and security recommendations

### 11. Risk Assessment Prompt (riskAssessmentPrompt.ts)

Please conduct a risk assessment for the following coin blockchain address: address

Please use the following tools to collect information:
1. Use get_risk_score to get the risk score
2. Use get_address_labels to view address labels
3. Use check_malicious_funds to check for malicious funds
4. Use get_address_trace to get address-related intelligence

Please comprehensively analyze the above information and provide a risk assessment report.


### 12. Format Analysis Results Prompt (formatAnalysisResultsPrompt.ts)

Based on my analysis of the coin address [address], please organize the results into an attractive report with the following format:

# 🔍 coin Address Analysis Report

## 📊 Basic Information
- **Address**: address
- **Blockchain**: [Blockchain name, e.g., TRON]
- **Supported Coins**: [List supported coins]
- **Address Labels**: [List labels if any, otherwise mark as "No clear labels"]
- **Risk Score**: [Score]/100 [Risk level]

## 💰 Fund Activities
### coin Fund Activities:
- **Current Balance**: [Balance] coin
- **Total Transactions**: [Number of transactions]
- **Total Received**: [Total received] coin
- **Total Spent**: [Total spent] coin
- **Net Inflow**: [Net inflow] coin
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


### 13. Format Multi-Chain Analysis Prompt (formatMultiChainAnalysisPrompt.ts)

Based on my cross-chain analysis of address [address], please organize the results into an attractive report with the following format:

# 🌐 Multi-Chain Address Analysis Report

## 📊 Address Basic Information
- **Address**: address
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


### 14. Format Transaction Analysis Prompt (formatTransactionAnalysisPrompt.ts)

Based on my analysis of the coin transaction [txid], please organize the results into an attractive report with the following format:

# 🔎 coin Transaction Analysis Report

## 📊 Transaction Basic Information
- **Transaction Hash**: txid
- **Blockchain**: [Blockchain name]
- **Transaction Status**: [Success/Failed/Pending]
- **Risk Score**: [Score]/100 [Risk level]

## 💸 Transaction Details
- **Transaction Amount**: [Amount] coin
- **Sender**: [Address] [Label, if any]
- **Receiver**: [Address] [Label, if any]
- **Transaction Time**: [Date and time]
- **Block Height**: [Block height]
- **Transaction Fee**: [Fee] coin

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
`

export function registerAddressEntityAnalysisTool(server: McpServer): void {
  server.tool(
    'analyze_address_entity',
    summaryPrompts,
    {},
    async (): Promise<CallToolResult> => {
      // This is a tool with no actual functionality, used only for prompt suggestions
      
      // Construct response text
      const textResult = ``;
      
      return {
        content: [
          {
            type: 'text',
            text: textResult
          }
        ]
      };
    }
  );
}