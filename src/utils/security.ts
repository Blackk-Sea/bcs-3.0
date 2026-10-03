/**
 * Robust URL Security Filter
 * Ensures URLs only use safe protocols (http:// or https://)
 * Rejects javascript:, data:, vbscript:, file:, etc.
 */

export function sanitizeUrl(inputUrl: string): { url: string; isValid: boolean; error?: string } {
  let cleaned = String(inputUrl || '').trim();

  if (!cleaned) {
    return { url: '', isValid: false, error: 'লিংক ফাঁকা রাখা যাবে না' };
  }

  // Remove control characters and whitespace within protocol checks
  const lowercased = cleaned.toLowerCase();

  // Explicit check for hazardous protocol prefixes
  const forbiddenProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'blob:', 'about:'];
  for (const proto of forbiddenProtocols) {
    if (lowercased.startsWith(proto) || lowercased.includes(proto)) {
      return {
        url: '#unsafe-url',
        isValid: false,
        error: `অনিরাপদ লিংক! ${proto} প্রোটোকল অনুমোদিত নয়।`,
      };
    }
  }

  // Auto-prefix missing protocol
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }

  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        url: '#unsafe-url',
        isValid: false,
        error: 'শুধু HTTP এবং HTTPS লিংক সমর্থন করা হয়।',
      };
    }
    return { url: parsed.href, isValid: true };
  } catch (err) {
    return {
      url: '#invalid-url',
      isValid: false,
      error: 'সঠিক URL বিন্যাস লিখুন (যেমন: https://youtube.com)',
    };
  }
}

export function escapeHtml(str: string): string {
  return String(str || '').replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return map[c] || c;
  });
}
