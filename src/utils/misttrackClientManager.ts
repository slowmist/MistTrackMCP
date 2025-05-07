import { MistTrackClient } from './misttrackClient';
import { MistTrackConfig } from '../MistTrackMCPServer';

/**
 * MistTrack API client manager, implements singleton pattern
 */
export class MistTrackClientManager {
  private static _instance: MistTrackClient | null = null;

  /**
   * Initialize MistTrackClient singleton, recommended to call once at project startup
   * 
   * @param config MistTrack API configuration object
   * @returns MistTrackClient instance
   */
  public static initialize(config: MistTrackConfig): MistTrackClient {
    this._instance = new MistTrackClient(
      config.API_KEY,
      config.BASE_URL,
      config.RATE_LIMIT,
      config.MAX_RETRIES,
      config.RETRY_DELAY,
      config.RETRY_BACKOFF
    );

    return this._instance;
  }

  /**
   * Get MistTrackClient singleton
   * 
   * @param config MistTrack API configuration object
   * @returns MistTrackClient instance
   */
  public static getClient(config?: MistTrackConfig): MistTrackClient {
    // If instance doesn't exist, create new instance
    if (this._instance === null) {
      if (config) {
        this._instance = new MistTrackClient(
          config.API_KEY,
          config.BASE_URL,
          config.RATE_LIMIT,
          config.MAX_RETRIES,
          config.RETRY_DELAY,
          config.RETRY_BACKOFF
        );
      } else {
        // If no configuration is provided, try to create from environment variables (compatible with existing code)
        this._instance = new MistTrackClient(
          process.env.MISTTRACK_API_KEY || null,
          'https://openapi.misttrack.io',
          1.0,
          3,
          1.0,
          2.0
        );
      }
    }

    return this._instance;
  }
} 