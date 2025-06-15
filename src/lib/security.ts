
// Security utilities and CSP configuration
export const setupSecurityHeaders = () => {
  // Set security-related meta tags
  const setMetaTag = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  // Content Security Policy (basic implementation)
  setMetaTag('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://api.sentry.io https://www.google-analytics.com; " +
    "frame-ancestors 'none';"
  );

  // X-Frame-Options
  setMetaTag('X-Frame-Options', 'DENY');

  // X-Content-Type-Options
  setMetaTag('X-Content-Type-Options', 'nosniff');

  // Referrer Policy
  setMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  setMetaTag('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), payment=()'
  );
};

// Rate limiting for client-side (basic implementation)
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the time window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }

  reset(key: string) {
    this.requests.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// Client-side rate limiting hook
export const useRateLimit = (key: string, maxRequests: number, windowMs: number) => {
  return {
    isAllowed: () => rateLimiter.isAllowed(key, maxRequests, windowMs),
    reset: () => rateLimiter.reset(key)
  };
};
