/**
 * Simple encryption utilities for localStorage
 * Uses Web Crypto API for encryption/decryption
 * 
 * Security Note: This provides protection against casual inspection and basic XSS attacks.
 * For production use, consider using a more robust key management solution.
 */

// Generate a key based on the origin (domain) - this provides basic obfuscation
// Note: This is not military-grade encryption, but provides protection against
// casual inspection and basic XSS attacks
async function getEncryptionKey(): Promise<CryptoKey> {
  // Use a combination of origin and a fixed salt for key derivation
  const keyMaterial = `${window.location.origin}_mutopia_pet_remember_me_v1`;
  
  // Convert to ArrayBuffer
  const encoder = new TextEncoder();
  const keyData = encoder.encode(keyMaterial);
  
  // Hash the key material to get a 256-bit key
  const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);
  
  // Import as AES-GCM key (256-bit)
  return crypto.subtle.importKey(
    'raw',
    hashBuffer,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a string value
 */
export async function encryptValue(value: string): Promise<string> {
  try {
    if (!value) return value;
    
    const key = await getEncryptionKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    
    // Generate a random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      data
    );
    
    // Combine IV and encrypted data, then encode as base64
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    // Fallback: return original value if encryption fails
    return value;
  }
}

/**
 * Decrypt a string value
 */
export async function decryptValue(encryptedValue: string): Promise<string> {
  try {
    if (!encryptedValue) return encryptedValue;
    
    const key = await getEncryptionKey();
    
    // Decode from base64
    const combined = Uint8Array.from(atob(encryptedValue), c => c.charCodeAt(0));
    
    // Extract IV (first 12 bytes) and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encrypted
    );
    
    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    // If decryption fails, try to return as-is (might be old unencrypted data)
    return encryptedValue;
  }
}

/**
 * Save encrypted value to localStorage
 */
export async function saveEncryptedItem(key: string, value: string): Promise<void> {
  try {
    const encrypted = await encryptValue(value);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error(`Failed to save encrypted item ${key}:`, error);
    throw error;
  }
}

/**
 * Get and decrypt value from localStorage
 */
export async function getEncryptedItem(key: string): Promise<string | null> {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    
    // Try to decrypt - if it fails, it might be old unencrypted data
    try {
      return await decryptValue(encrypted);
    } catch (error) {
      // If decryption fails, return the value as-is (backward compatibility)
      // This handles the case where old unencrypted data exists
      console.warn(`Failed to decrypt ${key}, returning as-is:`, error);
      return encrypted;
    }
  } catch (error) {
    console.error(`Failed to get encrypted item ${key}:`, error);
    return null;
  }
}

/**
 * Remove encrypted item from localStorage
 */
export function removeEncryptedItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove encrypted item ${key}:`, error);
  }
}

