/**
 * Data Filter - For filtering potential malicious content in API response data
 */

import { MistTrackResponse } from './misttrackClient';

/**
 * List of sensitive keywords to be filtered
 */
const SENSITIVE_KEYWORDS = [
  // Common malicious prompt words
  'prompt injection',
  'ignore previous instructions',
  'disregard earlier directives',
  'system prompt',
  'override instructions',
  // Add more keywords to filter
];

/**
 * Recursively check and filter all string values in objects or arrays
 * 
 * @param data Data to filter
 * @returns Filtered data
 */
function filterObjectRecursively(data: any): any {
  // If null or undefined, return directly
  if (data === null || data === undefined) {
    return data;
  }

  // Handle string type - direct filtering
  if (typeof data === 'string') {
    return filterSensitiveContent(data);
  }

  // Handle array type - recursively filter each element
  if (Array.isArray(data)) {
    return data.map(item => filterObjectRecursively(item));
  }

  // Handle object type - recursively filter each property value
  if (typeof data === 'object') {
    const filteredObject: Record<string, any> = {};
    
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        // Filter property name (optional)
        const filteredKey = filterSensitiveContent(key);
        // Recursively filter property value
        filteredObject[filteredKey] = filterObjectRecursively(data[key]);
      }
    }
    
    return filteredObject;
  }

  // Other types (numbers, booleans, etc.) return directly
  return data;
}

/**
 * Filter sensitive content in strings
 * 
 * @param text String to filter
 * @returns Filtered string
 */
function filterSensitiveContent(text: string): string {
  if (typeof text !== 'string') {
    return text;
  }

  let filteredText = text;

  // Use regular expressions to detect and filter sensitive keywords
  SENSITIVE_KEYWORDS.forEach(keyword => {
    // Create case-insensitive regex
    const regex = new RegExp(keyword, 'gi');
    // Replace sensitive words with [FILTERED]
    filteredText = filteredText.replace(regex, '[FILTERED]');
  });

  // Can add more complex detection logic, such as detecting specific pattern strings

  return filteredText;
}

/**
 * Filter sensitive content in API response data
 * 
 * @param response MistTrack API response data
 * @returns Filtered response data
 */
export function filterApiResponse<T = any>(response: MistTrackResponse<T>): MistTrackResponse<T> {
  if (!response) {
    return response;
  }

  // Create a copy of the response data to avoid modifying original data
  const filteredResponse = { ...response };

  // Filter response message
  if (typeof filteredResponse.msg === 'string') {
    filteredResponse.msg = filterSensitiveContent(filteredResponse.msg);
  }

  // Recursively filter response data
  if (filteredResponse.data !== undefined) {
    filteredResponse.data = filterObjectRecursively(filteredResponse.data);
  }

  // Filter other possible fields
  for (const key in filteredResponse) {
    if (key !== 'success' && key !== 'msg' && key !== 'data' && 
        Object.prototype.hasOwnProperty.call(filteredResponse, key)) {
      filteredResponse[key] = filterObjectRecursively(filteredResponse[key]);
    }
  }

  return filteredResponse;
}

/**
 * Detect if string contains sensitive content
 * 
 * @param text String to check
 * @returns Whether it contains sensitive content
 */
export function containsSensitiveContent(text: string): boolean {
  if (typeof text !== 'string') {
    return false;
  }

  // Check if text contains any sensitive keywords
  return SENSITIVE_KEYWORDS.some(keyword => {
    const regex = new RegExp(keyword, 'gi');
    return regex.test(text);
  });
}

export default filterApiResponse; 