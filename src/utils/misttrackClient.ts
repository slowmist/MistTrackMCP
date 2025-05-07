import axios, { AxiosRequestConfig } from 'axios';
import filterApiResponse from './dataFilter';

/**
 * MistTrack API parameter type interface
 */
export interface MistTrackRequestParams {
  coin?: string;
  address?: string;
  txid?: string;
  api_key?: string;
  start_timestamp?: number; 
  end_timestamp?: number;
  type?: string;
  page?: number;
  [key: string]: any;
}

/**
 * MistTrack API response interface
 */
export interface MistTrackResponse<T = any> {
  success: boolean;
  msg?: string;
  data?: T;
  [key: string]: any;
}

/**
 * MistTrack API client class, encapsulates all calls to MistTrack API
 */
export class MistTrackClient {
  private readonly api_key: string | null;
  private readonly base_url: string;
  private readonly rate_limit: number;
  private readonly max_retries: number;
  private readonly retry_delay: number;
  private readonly retry_backoff: number;

  private request_interval: number;
  private last_request_time: number;

  /**
   * Initialize MistTrack client
   * 
   * @param api_key MistTrack API key, default gets from environment variable
   * @param base_url MistTrack API base URL, default uses official URL
   * @param rate_limit Maximum requests per second limit
   * @param max_retries Maximum retry count for failed requests
   * @param retry_delay Initial retry delay time (seconds)
   * @param retry_backoff Exponential growth factor for retry delay
   */
  constructor(
    api_key: string | null = null,
    base_url: string = 'https://openapi.misttrack.io',
    rate_limit: number = 1.0,
    max_retries: number = 3,
    retry_delay: number = 1.0,
    retry_backoff: number = 2.0
  ) {
    // Prioritize the API key parameter passed in
    this.api_key = api_key || process.env.MISTTRACK_API_KEY || null;
    this.base_url = base_url;
    this.rate_limit = rate_limit;
    this.max_retries = max_retries;
    this.retry_delay = retry_delay;
    this.retry_backoff = retry_backoff;

    this.request_interval = rate_limit > 0 ? 1.0 / rate_limit : 0;
    this.last_request_time = 0;
  }

  /**
   * Wait to comply with rate limit
   */
  private async waitForRateLimit(): Promise<void> {
    if (this.rate_limit <= 0) return;

    const currentTime = Date.now() / 1000;
    const elapsed = currentTime - this.last_request_time;

    if (elapsed < this.request_interval) {
      const waitTime = this.request_interval - elapsed;
      await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
    }

    this.last_request_time = Date.now() / 1000;
  }

  /**
   * Check if valid API Key is set
   * @returns Whether API Key is set
   */
  public hasApiKey(): boolean {
    return this.api_key !== null && this.api_key !== undefined && this.api_key !== '';
  }

  /**
   * Generic API request method, includes request frequency control and error retry
   * 
   * @param endpoint API endpoint path
   * @param params URL parameters
   * @param method HTTP method (GET or POST)
   * @param jsonData JSON request body data (for POST requests)
   * @returns API response data
   */
  private async makeRequest<T = any>(
    endpoint: string, 
    params: MistTrackRequestParams = {}, 
    method: string = 'GET', 
    jsonData: any = null
  ): Promise<MistTrackResponse<T>> {
    // Check if API key is set (all requests except /v1/status endpoint require API key)
    if (this.api_key === null && endpoint !== '/v1/status') {
      return filterApiResponse<T>({
        success: false,
        msg: 'Please set MistTrack API Key, normal operation is not possible without an API Key. Tip: Visit https://dashboard.misttrack.io/apikeys to create an API Key, if you haven\'t upgraded to MistTrack Standard Plan please visit https://dashboard.misttrack.io/upgrade to upgrade your plan.',
        data: undefined as unknown as T
      });
    }

    try {
      // Ensure request and base URL are valid
      const url = `${this.base_url}${endpoint}`;

      // If it's a GET request and no api_key parameter, add API key to parameters
      if (method.toUpperCase() === 'GET' && !('api_key' in params) && endpoint !== '/v1/status') {
        params.api_key = this.api_key || undefined;
      }

      let retries = 0;
      let retryDelay = this.retry_delay;

      while (true) {
        try {
          // Wait to comply with rate limit
          await this.waitForRateLimit();

          const config: AxiosRequestConfig = {
            method: method.toUpperCase(),
            url,
            params: method.toUpperCase() === 'GET' ? params : undefined,
            data: method.toUpperCase() === 'POST' ? jsonData : undefined,
            headers: {
              'Content-Type': method.toUpperCase() === 'POST' ? 'application/json' : 'application/x-www-form-urlencoded',
            },
            // Set timeout to prevent request from getting stuck
            timeout: 10000, // 10 seconds timeout
          };

          // For POST requests, add api_key to URL parameters
          if (method.toUpperCase() === 'POST' && !('api_key' in params) && endpoint !== '/v1/status') {
            config.params = { api_key: this.api_key || undefined };
          }

          const response = await axios.request<MistTrackResponse<T>>(config);
          return filterApiResponse<T>(response.data);
        } catch (error: any) {
          // Check if should retry (based on HTTP status code)
          const status = error.response?.status || 0;
          const shouldRetry = (
            retries < this.max_retries &&
            (status >= 500 || status === 429 || status === 408)
          );

          if (!shouldRetry) {
            return filterApiResponse<T>({
              success: false,
              msg: `API request failed: ${error.message}`,
              data: undefined as unknown as T
            });
          }

          // Calculate retry delay (with some random jitter to avoid synchronized requests)
          const jitter = 0.8 + Math.random() * 0.4; // Between 0.8 and 1.2
          const sleepTime = retryDelay * jitter;

          // Increase delay for next retry (exponential backoff)
          retryDelay *= this.retry_backoff;
          retries++;

          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, sleepTime * 1000));
        }
      }
    } catch (error: any) {
      // Catch all other errors (including network connection issues)
      return filterApiResponse<T>({
        success: false,
        msg: `API request error: ${error.message}`,
        data: undefined as unknown as T
      });
    }
  }

  /**
   * Get API status and supported coins
   */
  async getApiStatus(): Promise<MistTrackResponse> {
    return this.makeRequest('/v1/status');
  }

  /**
   * Get label list for specified address
   * 
   * @param coin Coin to check, such as ETH, BTC, etc.
   * @param address Address to check
   */
  async getAddressLabels(coin: string, address: string): Promise<MistTrackResponse> {
    const params: MistTrackRequestParams = {
      coin,
      address,
      api_key: this.api_key || undefined
    };
    return this.makeRequest('/v1/address_labels', params);
  }

  /**
   * Get balance and statistics for specified address
   * 
   * @param coin Coin to check, such as ETH, BTC, etc.
   * @param address Address to check
   */
  async getAddressOverview(coin: string, address: string): Promise<MistTrackResponse> {
    const params: MistTrackRequestParams = {
      coin,
      address,
      api_key: this.api_key || undefined
    };
    return this.makeRequest('/v1/address_overview', params);
  }

  /**
   * Get risk score for specified address or transaction hash
   * 
   * @param coin Coin to check, such as ETH, BTC, etc.
   * @param address Address to check (address and txid must pass at least one)
   * @param txid Transaction hash to check (address and txid must pass at least one)
   */
  async getRiskScore(coin: string, address?: string, txid?: string): Promise<MistTrackResponse> {
    if (!address && !txid) {
      return { success: false, msg: 'Must provide address or txid parameter', data: null };
    }

    const params: MistTrackRequestParams = {
      coin,
      api_key: this.api_key || undefined
    };

    if (address) {
      params.address = address;
    }
    if (txid) {
      params.txid = txid;
    }

    return this.makeRequest('/v1/risk_score', params);
  }

  /**
   * Get transaction investigation results for specified address
   * 
   * @param coin Coin to check, such as ETH, BTC, etc.
   * @param address Address to check
   * @param startTimestamp Start timestamp (optional, default is 0)
   * @param endTimestamp End timestamp (optional, default is current timestamp)
   * @param transactionType Transaction type (optional values: "in", "out", or "all", default is "all")
   * @param page Page number (optional, default is 1)
   */
  async getTransactionsInvestigation(
    coin: string,
    address: string,
    startTimestamp?: number,
    endTimestamp?: number,
    transactionType?: string,
    page?: number
  ): Promise<MistTrackResponse> {
    const params: MistTrackRequestParams = {
      coin,
      address,
      api_key: this.api_key || undefined
    };

    if (startTimestamp !== undefined) {
      params.start_timestamp = startTimestamp;
    }
    if (endTimestamp !== undefined) {
      params.end_timestamp = endTimestamp;
    }
    if (transactionType !== undefined) {
      params.type = transactionType;
    }
    if (page !== undefined) {
      params.page = page;
    }

    return this.makeRequest('/v1/transactions_investigation', params);
  }

  /**
   * Get transaction operation analysis results for specified address
   * 
   * @param coin Coin to check, such as ETH, BTC, etc.
   * @param address Address to check
   */
  async getAddressAction(coin: string, address: string): Promise<MistTrackResponse> {
    const params: MistTrackRequestParams = {
      coin,
      address,
      api_key: this.api_key || undefined
    };
    return this.makeRequest('/v1/address_action', params);
  }

  /**
   * Get profile for specified address, including platform interaction list and related threat intelligence data
   * 
   * @param coin Coin to check, such as ETH, BTC, etc.
   * @param address Address to check
   */
  async getAddressTrace(coin: string, address: string): Promise<MistTrackResponse> {
    const params: MistTrackRequestParams = {
      coin,
      address,
      api_key: this.api_key || undefined
    };
    return this.makeRequest('/v1/address_trace', params);
  }

  /**
   * Get transaction counterparty analysis results for specified address
   * 
   * @param coin Coin to check, such as ETH, BTC, etc.
   * @param address Address to check
   */
  async getAddressCounterparty(coin: string, address: string): Promise<MistTrackResponse> {
    const params: MistTrackRequestParams = {
      coin,
      address,
      api_key: this.api_key || undefined
    };
    return this.makeRequest('/v1/address_counterparty', params);
  }

  /**
   * Get list of coins supported by MistTrack
   */
  async getSupportedCoins(): Promise<string[] | string> {
    try {
      const response = await this.getApiStatus();
      if (response.success) {
        const coins = response.data?.support_coin || [];
        return coins;
      }
      return `Unable to get supported coin list: ${response.msg || 'Unknown error'}`;
    } catch (e: any) {
      return `Error getting supported coin list: ${e.message}`;
    }
  }
} 