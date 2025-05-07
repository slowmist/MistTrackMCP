import { MistTrackClient } from './misttrackClient';
import { MistTrackClientManager } from './misttrackClientManager';

/**
 * Transaction information interface
 */
interface TransactionInfo {
  address: string;
  amount: number;
  label: string;
  tx_hashes: string[];
}

/**
 * Address information interface
 */
interface AddressInfo {
  depth: number;
  parent_address: string | null;
  parent_tx_hash: string | null;
  inflow: TransactionInfo[];
  outflow: TransactionInfo[];
}

/**
 * Transaction graph node interface
 */
interface TransactionGraphNode {
  to: string;
  amount: number;
  label: string;
  tx_hashes: string[];
  direction: 'in' | 'out';
}

/**
 * Fund flow path step
 */
interface PathStep {
  from: string;
  to: string;
  amount: number;
  label: string;
  direction: 'in' | 'out';
  tx_hashes: string[];
}

/**
 * Important address information
 */
interface ImportantAddress {
  address: string;
  label: string;
  category: string;
  depth: number;
  direction: 'in' | 'out';
  amount: number;
  tx_hashes: string[];
}

/**
 * Analysis report interface
 */
interface AnalysisReport {
  root_address: string;
  coin: string;
  total_addresses: number;
  important_addresses: ImportantAddress[];
  fund_flow_paths: PathStep[][];
  label_statistics: Record<string, number>;
  depth_statistics: Record<string, number>;
  labeled_addresses_by_depth: Record<string, [string, string][]>;
  error?: boolean;
  message?: string;
}

/**
 * Transaction analyzer class, used for analyzing multi-layer transaction relationships and fund flows
 */
export class TransactionsAnalyzer {
  private misttrackClient: MistTrackClient;
  private visitedAddresses: Set<string> = new Set();
  private transactionGraph: Map<string, TransactionGraphNode[]> = new Map();
  private addressInfo: Record<string, AddressInfo> = {};

  /**
   * Initialize transaction analyzer
   * 
   * @param misttrackClient MistTrack API client instance, if not provided will be obtained from manager
   */
  constructor(misttrackClient?: MistTrackClient) {
    this.misttrackClient = misttrackClient || MistTrackClientManager.getClient();
  }

  /**
   * Analyze single level of transaction information
   * 
   * @param coin Cryptocurrency type
   * @param address Address to analyze
   * @param startTimestamp Start timestamp
   * @param endTimestamp End timestamp
   * @param transactionType Transaction type
   * @param currentDepth Current analysis depth
   * @param parentAddress Parent address
   * @param parentTxHash Parent transaction hash
   */
  private async analyzeSingleLevel(
    coin: string,
    address: string,
    startTimestamp?: number,
    endTimestamp?: number,
    transactionType?: string,
    currentDepth: number = 0,
    parentAddress?: string,
    parentTxHash?: string
  ): Promise<void> {
    // If address has already been analyzed, return
    if (this.visitedAddresses.has(address)) {
      return;
    }

    // Mark address as visited
    this.visitedAddresses.add(address);

    // Get transaction information
    const txResponse = await this.misttrackClient.getTransactionsInvestigation(
      coin,
      address,
      startTimestamp,
      endTimestamp,
      transactionType
    );

    if (!txResponse.success) {
      return;
    }

    const data = txResponse.data || {};

    // Store current address basic information
    this.addressInfo[address] = {
      depth: currentDepth,
      parent_address: parentAddress || null,
      parent_tx_hash: parentTxHash || null,
      inflow: [],
      outflow: []
    };

    // Process inflow transactions
    const inflows = data.in || [];
    for (const tx of inflows) {
      const counterparty = tx.address || '';
      const amount = tx.amount || 0;
      const label = tx.label || '';
      const txHashes = tx.tx_hash_list || [];

      // Record inflow information
      this.addressInfo[address].inflow.push({
        address: counterparty,
        amount: amount,
        label: label,
        tx_hashes: txHashes
      });

      // Add to transaction graph
      if (!this.transactionGraph.has(counterparty)) {
        this.transactionGraph.set(counterparty, []);
      }
      
      this.transactionGraph.get(counterparty)!.push({
        to: address,
        amount: amount,
        label: label,
        tx_hashes: txHashes,
        direction: 'in'
      });
    }

    // Process outflow transactions
    const outflows = data.out || [];
    for (const tx of outflows) {
      const counterparty = tx.address || '';
      const amount = tx.amount || 0;
      const label = tx.label || '';
      const txHashes = tx.tx_hash_list || [];

      // Record outflow information
      this.addressInfo[address].outflow.push({
        address: counterparty,
        amount: amount,
        label: label,
        tx_hashes: txHashes
      });

      // Add to transaction graph
      if (!this.transactionGraph.has(address)) {
        this.transactionGraph.set(address, []);
      }
      
      this.transactionGraph.get(address)!.push({
        to: counterparty,
        amount: amount,
        label: label,
        tx_hashes: txHashes,
        direction: 'out'
      });
    }
  }

  /**
   * Recursively analyze transaction relationships, build transaction graph
   * 
   * @param coin Cryptocurrency type
   * @param address Address to analyze
   * @param startTimestamp Start timestamp
   * @param endTimestamp End timestamp
   * @param transactionType Transaction type
   * @param maxDepth Maximum analysis depth
   * @param currentDepth Current analysis depth
   * @param parentAddress Parent address
   * @param parentTxHash Parent transaction hash
   * @returns Dictionary containing analysis results
   */
  private async analyzeTransactionsRecursively(
    coin: string,
    address: string,
    startTimestamp?: number,
    endTimestamp?: number,
    transactionType?: string,
    maxDepth: number = 1,
    currentDepth: number = 0,
    parentAddress?: string,
    parentTxHash?: string
  ): Promise<AnalysisReport | Record<string, never>> {
    // If maximum depth reached, return immediately
    if (currentDepth > maxDepth) {
      return this.generateAnalysisReport(coin, address, maxDepth);
    }

    // If address has been analyzed, skip repeated analysis
    if (this.visitedAddresses.has(address) && currentDepth > 0) { // Allow root address to be analyzed
      return {};
    }

    // Analyze current level
    await this.analyzeSingleLevel(
      coin,
      address,
      startTimestamp,
      endTimestamp,
      transactionType,
      currentDepth,
      parentAddress,
      parentTxHash
    );

    // Check if current address has exchange label, if so end analysis early
    const exchangeKeywords = ["Binance", "Huobi", "OKEx", "Coinbase", "exchange"];
    
    if (this.addressInfo[address]) {
      for (const inflow of this.addressInfo[address].inflow) {
        if (exchangeKeywords.some(exchange => inflow.label.includes(exchange))) {
          return this.generateAnalysisReport(coin, address, maxDepth);
        }
      }
      
      for (const outflow of this.addressInfo[address].outflow) {
        if (exchangeKeywords.some(exchange => outflow.label.includes(exchange))) {
          return this.generateAnalysisReport(coin, address, maxDepth);
        }
      }
    }

    // If maximum depth not reached, continue analyzing next layer
    if (currentDepth < maxDepth && this.addressInfo[address]) {
      // Collect tasks for all lower level addresses
      const tasks: Promise<any>[] = [];

      // Process inflow transactions
      for (const inflow of this.addressInfo[address].inflow) {
        if (this.visitedAddresses.has(inflow.address)) {
          continue; // Skip already analyzed addresses
        }

        if (inflow.tx_hashes.length > 0) {
          const task = this.analyzeTransactionsRecursively(
            coin,
            inflow.address,
            startTimestamp,
            endTimestamp,
            transactionType,
            maxDepth,
            currentDepth + 1,
            address,
            inflow.tx_hashes[0]
          );
          tasks.push(task);
          break; // Only analyze one transaction per address to avoid excessive recursion
        }
      }

      // Process outflow transactions
      for (const outflow of this.addressInfo[address].outflow) {
        if (this.visitedAddresses.has(outflow.address)) {
          continue; // Skip already analyzed addresses
        }

        if (outflow.tx_hashes.length > 0) {
          const task = this.analyzeTransactionsRecursively(
            coin,
            outflow.address,
            startTimestamp,
            endTimestamp,
            transactionType,
            maxDepth,
            currentDepth + 1,
            address,
            outflow.tx_hashes[0]
          );
          tasks.push(task);
          break; // Only analyze one transaction per address to avoid excessive recursion
        }
      }

      // Wait for all child tasks to complete, but ignore their return values
      // We only use the final report generated by the root node
      if (tasks.length > 0) {
        await Promise.all(tasks);
      }
    }

    // Only return complete report at root node (initial call layer)
    // Other recursive layers return empty dictionary to avoid generating multiple reports
    if (currentDepth === 0) {
      return this.generateAnalysisReport(coin, address, maxDepth);
    } else {
      return {};
    }
  }

  /**
   * Generate analysis report
   * 
   * @param coin Cryptocurrency type
   * @param rootAddress Root address
   * @param maxDepth Maximum analysis depth
   * @returns Analysis report
   */
  private generateAnalysisReport(
    coin: string,
    rootAddress: string,
    maxDepth: number = 1
  ): AnalysisReport {
    // Important label statistics
    const importantLabels = {
      "mixer": ["Tornado.Cash", "Wasabi", "Mixer"],
      "exchange": ["Binance", "Huobi", "OKEx", "Coinbase", "exchange", "okx", "gate.io", "weex", "huionepay", "binance"],
      "dex": ["Uniswap", "SushiSwap", "PancakeSwap"],
      "defi": ["Aave", "Compound", "MakerDAO"],
      "malicious": ["Suspected malicious", "Theft", "Phishing", "Scam", "Fraud"]
    };

    // Initialize report
    const report: AnalysisReport = {
      root_address: rootAddress,
      coin: coin,
      total_addresses: this.visitedAddresses.size,
      important_addresses: [],
      fund_flow_paths: [],
      label_statistics: {},
      depth_statistics: {},
      labeled_addresses_by_depth: {}
    };

    // For temporary data storage
    const labelStatistics: Record<string, number> = {};
    const depthStatistics: Record<string, number> = {};
    const labeledAddressesByDepth: Record<string, Array<[string, string]>> = {};

    // Analyze each address
    for (const [address, info] of Object.entries(this.addressInfo)) {
      const depth = info.depth;
      depthStatistics[depth] = (depthStatistics[depth] || 0) + 1;

      // Check inflow transactions
      for (const inflow of info.inflow) {
        const label = inflow.label;
        if (label) {
          // If root address, only count labels
          if (depth === 0) {
            labelStatistics[label] = (labelStatistics[label] || 0) + 1;
          }
          
          // Record labeled addresses at next level
          const nextDepth = depth + 1;
          if (!labeledAddressesByDepth[nextDepth]) {
            labeledAddressesByDepth[nextDepth] = [];
          }
          labeledAddressesByDepth[nextDepth].push([inflow.address, label]);

          // Check if contains important labels
          for (const [category, keywords] of Object.entries(importantLabels)) {
            if (keywords.some(keyword => label.toLowerCase().includes(keyword.toLowerCase()))) {
              report.important_addresses.push({
                address: inflow.address,
                label: label,
                category: category,
                depth: depth + 1,
                direction: 'in',
                amount: inflow.amount,
                tx_hashes: inflow.tx_hashes
              });
            }
          }
        }
      }

      // Check outflow transactions
      for (const outflow of info.outflow) {
        const label = outflow.label;
        if (label) {
          // If root address, only count labels
          if (depth === 0) {
            labelStatistics[label] = (labelStatistics[label] || 0) + 1;
          }
          
          // Record labeled addresses at next level
          const nextDepth = depth + 1;
          if (!labeledAddressesByDepth[nextDepth]) {
            labeledAddressesByDepth[nextDepth] = [];
          }
          labeledAddressesByDepth[nextDepth].push([outflow.address, label]);

          // Check if contains important labels
          for (const [category, keywords] of Object.entries(importantLabels)) {
            if (keywords.some(keyword => label.toLowerCase().includes(keyword.toLowerCase()))) {
              report.important_addresses.push({
                address: outflow.address,
                label: label,
                category: category,
                depth: depth + 1,
                direction: 'out',
                amount: outflow.amount,
                tx_hashes: outflow.tx_hashes
              });
            }
          }
        }
      }
    }

    // Build fund flow paths
    this.buildFundFlowPaths(rootAddress, report.fund_flow_paths, [], 0, maxDepth);

    // Filter fund flow paths, only keep paths containing labeled addresses
    const filteredPaths: PathStep[][] = [];
    for (const path of report.fund_flow_paths) {
      // Check if path contains labeled addresses
      let hasLabeledAddress = false;

      if (labeledAddressesByDepth[1]) {
        for (const step of path) {
          if (labeledAddressesByDepth[1].some(([addr]) => step.from === addr || step.to === addr)) {
            hasLabeledAddress = true;
            break;
          }
        }
      }

      if (hasLabeledAddress) {
        filteredPaths.push(path);
      }
    }
    report.fund_flow_paths = filteredPaths;

    // Save statistics results
    report.label_statistics = labelStatistics;
    report.depth_statistics = depthStatistics;
    report.labeled_addresses_by_depth = labeledAddressesByDepth;

    return report;
  }

  /**
   * Recursively build fund flow paths
   * 
   * @param currentAddress Current address
   * @param paths All paths list
   * @param currentPath Current path
   * @param currentDepth Current depth
   * @param maxDepth Maximum depth
   */
  private buildFundFlowPaths(
    currentAddress: string,
    paths: PathStep[][],
    currentPath: PathStep[] = [],
    currentDepth: number = 0,
    maxDepth: number = 1
  ): void {
    // If maximum depth reached, stop recursion
    if (currentDepth >= maxDepth) {
      if (currentPath.length > 0) {
        paths.push([...currentPath]);
      }
      return;
    }

    // Get current address transaction information
    const transactions = this.transactionGraph.get(currentAddress);
    if (!transactions || transactions.length === 0) {
      if (currentPath.length > 0) {
        paths.push([...currentPath]);
      }
      return;
    }

    // Traverse all transactions
    for (const tx of transactions) {
      const nextAddress = tx.to;

      // Avoid cycles - check if path already contains same from or to address
      if (currentPath.some(step => step.from === nextAddress || step.to === nextAddress)) {
        continue;
      }

      // Add current transaction to path
      currentPath.push({
        from: currentAddress,
        to: nextAddress,
        amount: tx.amount,
        label: tx.label,
        direction: tx.direction,
        tx_hashes: tx.tx_hashes
      });

      // Recursively process next address
      this.buildFundFlowPaths(
        nextAddress,
        paths,
        currentPath,
        currentDepth + 1,
        maxDepth
      );

      // Backtrack
      currentPath.pop();
    }
  }

  /**
   * Format analysis report as text
   * 
   * @param report Analysis report
   * @returns Formatted text report
   */
  public formatAnalysisReportAsText(report: AnalysisReport): string {
    const lines: string[] = [];

    // Title
    lines.push("=".repeat(80));
    lines.push("Multi-Layer Transaction Analysis Report");
    lines.push("=".repeat(80));
    lines.push("");

    // Check for errors
    if (report.error) {
      lines.push(`Analysis failed: ${report.message || 'Unknown error'}`);
      lines.push("");
      lines.push("=".repeat(80));
      lines.push(`Report generation time: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}`);
      lines.push("=".repeat(80));
      return lines.join("\n");
    }

    // Basic information
    lines.push(`Root address: ${report.root_address}`);
    lines.push(`Coin: ${report.coin}`);
    lines.push(`Total addresses analyzed: ${report.total_addresses}`);
    lines.push("");

    // Depth statistics
    lines.push("-".repeat(80));
    lines.push("【Depth Statistics】");
    lines.push("-".repeat(80));
    for (const [depth, count] of Object.entries(report.depth_statistics)) {
      lines.push(`Layer ${depth} address count: ${count}`);
    }
    lines.push("");

    // Labeled addresses by level
    lines.push("-".repeat(80));
    lines.push("【Labeled Addresses by Layer】");
    lines.push("-".repeat(80));
    for (const [depth, addresses] of Object.entries(report.labeled_addresses_by_depth)) {
      if (addresses && addresses.length > 0) {
        lines.push(`Layer ${depth} labeled addresses:`);
        for (const [addr, label] of addresses) {
          lines.push(`  Address: ${addr}`);
          lines.push(`  Label: ${label}`);
          lines.push("");
        }
      }
    }
    lines.push("");

    // Important addresses
    lines.push("-".repeat(80));
    lines.push("【Important Addresses】");
    lines.push("-".repeat(80));
    if (report.important_addresses.length > 0) {
      for (const addr of report.important_addresses) {
        lines.push(`Address: ${addr.address}`);
        lines.push(`Label: ${addr.label}`);
        lines.push(`Category: ${addr.category}`);
        lines.push(`Depth: ${addr.depth}`);
        lines.push(`Direction: ${addr.direction}`);
        lines.push(`Amount: ${addr.amount} ${report.coin}`);
        lines.push(`Transaction hashes: ${addr.tx_hashes.slice(0, 3).join(', ')}`);
        if (addr.tx_hashes.length > 3) {
          lines.push(`  ... total of ${addr.tx_hashes.length} transactions`);
        }
        lines.push("");
      }
    } else {
      lines.push("No important addresses found");
      lines.push("");
    }

    // Label statistics
    lines.push("-".repeat(80));
    lines.push("【Label Statistics】");
    lines.push("-".repeat(80));
    for (const [label, count] of Object.entries(report.label_statistics)) {
      lines.push(`${label}: ${count} occurrences`);
    }
    lines.push("");

    // Fund flow paths
    lines.push("-".repeat(80));
    lines.push("【Traceable Fund Flow Paths】");
    lines.push("-".repeat(80));
    if (report.fund_flow_paths.length > 0) {
      // Only show first 5 paths
      const displayPaths = report.fund_flow_paths.slice(0, 5);
      for (let i = 0; i < displayPaths.length; i++) {
        lines.push(`Path ${i + 1}:`);
        for (const step of displayPaths[i]) {
          const direction = step.direction === 'out' ? "→" : "←";
          lines.push(`  ${step.from} ${direction} ${step.to}`);
          lines.push(`    Amount: ${step.amount} ${report.coin}`);
          if (step.label) {
            lines.push(`    Label: ${step.label}`);
          }
        }
        lines.push("");
      }
      if (report.fund_flow_paths.length > 5) {
        lines.push(`... total of ${report.fund_flow_paths.length} paths`);
      }
    } else {
      lines.push("No traceable fund flow paths found");
      lines.push("");
    }

    // Footer
    lines.push("=".repeat(80));
    lines.push(`Report generation time: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}`);
    lines.push("=".repeat(80));

    return lines.join("\n");
  }

  /**
   * Analyze transactions and return analysis results
   * 
   * @param coin Cryptocurrency type
   * @param address Address to analyze
   * @param startTimestamp Start timestamp
   * @param endTimestamp End timestamp
   * @param transactionType Transaction type
   * @param maxDepth Maximum analysis depth
   * @returns Analysis result dictionary
   */
  public async analyzeAndFormat(
    coin: string,
    address: string,
    startTimestamp?: number,
    endTimestamp?: number,
    transactionType?: string,
    maxDepth: number = 1
  ): Promise<AnalysisReport> {
    // Reset analyzer state
    this.visitedAddresses.clear();
    this.transactionGraph.clear();
    this.addressInfo = {};

    // Execute analysis
    const report = await this.analyzeTransactionsRecursively(
      coin,
      address,
      startTimestamp,
      endTimestamp,
      transactionType,
      maxDepth
    );

    return report as AnalysisReport;
  }
} 