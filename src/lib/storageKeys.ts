/**
 * Storage key mappings for localStorage
 * 
 * Using obfuscated keys instead of descriptive names provides an additional
 * layer of security (defense in depth). Even though the data is encrypted,
 * obfuscated keys make it harder for attackers to identify sensitive data.
 * 
 * These keys are intentionally short and non-descriptive to minimize
 * information leakage if localStorage is inspected.
 */

/**
 * Storage key constants
 * Format: Short, non-descriptive identifiers
 */
export const STORAGE_KEYS = {
  // Authentication tokens
  ACCESS_TOKEN: "at", // access_token -> "at"
  REFRESH_TOKEN: "rt", // refresh_token -> "rt"
  
  // User information
  USER_INFO: "ui", // user_info -> "ui"
  
  // Remember me credentials
  REMEMBERED_EMAIL: "re", // remembered_email -> "re"
  REMEMBERED_PASSWORD: "rp", // remembered_password -> "rp"
} as const;

/**
 * Type for storage key values
 */
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

