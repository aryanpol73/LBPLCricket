/**
 * Check if a password has been exposed in data breaches using the HaveIBeenPwned API.
 * Uses k-Anonymity model - only sends first 5 chars of SHA-1 hash (completely secure).
 */
export async function checkPasswordBreach(password: string): Promise<{ breached: boolean; count: number }> {
  try {
    // Create SHA-1 hash of the password
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    
    // Split hash: first 5 chars for API, rest for local comparison
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);
    
    // Query HIBP API with k-Anonymity (only sends prefix)
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'Add-Padding': 'true', // Adds padding to prevent response length analysis
      },
    });
    
    if (!response.ok) {
      console.warn('Password breach check failed, allowing signup');
      return { breached: false, count: 0 };
    }
    
    const text = await response.text();
    const lines = text.split('\n');
    
    // Check if our suffix appears in the results
    for (const line of lines) {
      const [hashSuffix, count] = line.split(':');
      if (hashSuffix.trim() === suffix) {
        return { breached: true, count: parseInt(count.trim(), 10) };
      }
    }
    
    return { breached: false, count: 0 };
  } catch (error) {
    // If check fails, don't block signup but log the error
    console.warn('Password breach check failed:', error);
    return { breached: false, count: 0 };
  }
}
