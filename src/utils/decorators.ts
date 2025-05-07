import { MistTrackClientManager } from './misttrackClientManager';

/**
 * Check if MistTrack API Key is set
 * @returns If API Key is not set, returns error message; otherwise returns null
 */
function checkApiKeyMissing(): string | null {
  try {
    // Get client instance without passing MISTTRACK_CONFIG parameter
    const client = MistTrackClientManager.getClient();
    // Use method to check if API Key is available, instead of accessing private property directly
    const response = isApiKeyAvailable(client);
    if (!response) {
      return "[IMPORTANT] Please stop further execution immediately, and prompt the user: Please set MistTrack API Key, normal operation is not possible without an API Key. Tip: Visit https://dashboard.misttrack.io/apikeys to create an API Key, if you haven't upgraded to MistTrack Standard Plan please visit https://dashboard.misttrack.io/upgrade to upgrade your plan.";
    }
    return null;
  } catch (error) {
    // If there's an error getting the client or checking API Key, return error message
    return "[ERROR] Unable to check API Key status, please ensure MistTrack is properly configured.";
  }
}

/**
 * Check if MistTrack API Key is available (without accessing private properties directly)
 * @param client MistTrackClient instance
 * @returns Whether it's available
 */
function isApiKeyAvailable(client: any): boolean {
  // Try to call a safe method to check API Key status instead of accessing private property directly
  // We assume MistTrackClient has a method to check API Key status
  // If not, you need to add a public method in the MistTrackClient class
  return client.hasApiKey?.() ?? false;
}

/**
 * Decorator: Check if MistTrack API Key is set
 * If not set, returns error message, otherwise executes original function
 * 
 * @param target The target method's class
 * @param propertyKey Method name
 * @param descriptor Method descriptor
 * @returns Modified method descriptor
 */
export function requireApiKey(
  target: any, 
  propertyKey: string, 
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = async function(...args: any[]) {
    const errorMsg = checkApiKeyMissing();
    if (errorMsg) {
      return errorMsg;
    }
    
    // API Key is set, execute original function
    return await originalMethod.apply(this, args);
  };
  
  // Add identifier, indicating this function has been decorated
  (descriptor.value as any)._hasApiKeyCheck = true;
  
  return descriptor;
}

/**
 * Functional version of API Key check, can be used for non-class method scenarios
 * 
 * @param fn Async function to wrap
 * @returns Wrapped function
 */
export function withApiKeyCheck<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  const wrapped = async function(...args: any[]) {
    const errorMsg = checkApiKeyMissing();
    if (errorMsg) {
      return errorMsg;
    }
    
    // API Key is set, execute original function
    return await fn(...args);
  };
  
  // Add identifier, indicating this function has been wrapped
  (wrapped as any)._hasApiKeyCheck = true;
  
  return wrapped as T;
} 