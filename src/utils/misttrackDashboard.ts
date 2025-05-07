/**
 * MistTrack Dashboard URL Generation Tool
 * 
 * Provides functions for generating MistTrack dashboard URLs to directly access analysis pages for specific addresses
 */

/**
 * Generate MistTrack dashboard URL based on coin and address
 * 
 * @param coin Coin code, e.g. "ETH", "BTC", "USDT-TRC20", etc.
 * @param address Blockchain address
 * @returns MistTrack dashboard URL
 * 
 * @example
 * ```typescript
 * getDashboardUrl("USDT-TRC20", "TGBZh32uiJL3RuVfQiwZrQs5U6nJBmUYxb")
 * // returns: "https://dashboard.misttrack.io/address/USDT-TRC20/TGBZh32uiJL3RuVfQiwZrQs5U6nJBmUYxb"
 * ```
 */
export function getDashboardUrl(coin: string, address: string): string {
  // Ensure coin format is correct
  coin = coin.trim().toUpperCase();
  
  // Build URL
  const baseUrl = "https://dashboard.misttrack.io/address";
  const url = `${baseUrl}/${coin}/${address}`;
  
  return url;
}

/**
 * Normalize coin format, e.g. convert "usdt_trc20" to "USDT-TRC20"
 * 
 * @param coin Input coin code
 * @param address Optional address, used to infer coin type based on address format
 * @returns Normalized coin code
 */
export function normalizeCoinFormat(coin: string, address?: string): string {
  coin = coin.trim().toUpperCase();
  
  // Common format conversions
  const replacements: Record<string, string> = {
    "_": "-",  // e.g. USDT_TRC20 -> USDT-TRC20
  };
  
  for (const [old, newChar] of Object.entries(replacements)) {
    coin = coin.replace(new RegExp(old, 'g'), newChar);
  }
  
  // Handle common special cases
  if (coin === "USDT" && address) {
    // Determine USDT chain based on address format
    if (address.startsWith("T")) {
      return "USDT-TRC20";
    } else if (address.startsWith("0x")) {
      return "USDT-ERC20";
    } else if (address.startsWith("bnb") || address.toLowerCase().startsWith("0x")) {
      return "USDT-BEP20";
    }
  }
  
  return coin;
}

/**
 * Generate blockchain explorer URL based on coin and address
 * 
 * @param coin Coin code
 * @param address Blockchain address
 * @returns Blockchain explorer URL
 */
export function getChainExplorerUrl(coin: string, address: string): string {
  coin = normalizeCoinFormat(coin, address);
  
  // Mapping of blockchain explorer URLs for different chains
  const explorers: Record<string, string> = {
    "ETH": `https://etherscan.io/address/${address}`,
    "USDT-ERC20": `https://etherscan.io/address/${address}`,
    "USDT-TRC20": `https://tronscan.org/#/address/${address}`,
    "USDT-BEP20": `https://bscscan.com/address/${address}`,
    "BTC": `https://www.blockchain.com/explorer/addresses/btc/${address}`,
    "BNB": `https://bscscan.com/address/${address}`,
    "TRX": `https://tronscan.org/#/address/${address}`,
  };
  
  return explorers[coin] || `https://dashboard.misttrack.io/address/${coin}/${address}`;
} 