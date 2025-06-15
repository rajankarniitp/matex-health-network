
// Analytics service - supports multiple providers
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

// Extend Window interface to include dataLayer and gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

class AnalyticsService {
  private isInitialized = false;

  init() {
    if (this.isInitialized) return;

    // Google Analytics 4
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      this.initGoogleAnalytics();
    }

    // Add other analytics providers here (Mixpanel, Amplitude, etc.)
    
    this.isInitialized = true;
  }

  private initGoogleAnalytics() {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    
    gtag('js', new Date());
    gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // Make gtag available globally
    window.gtag = gtag;
  }

  track(event: AnalyticsEvent) {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized');
      return;
    }

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', event.name, event.properties);
    }

    // Add other providers tracking here
    console.log('Analytics Event:', event);
  }

  page(path: string, title?: string) {
    if (!this.isInitialized) return;

    // Google Analytics
    if (window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: path,
        page_title: title || document.title,
        page_location: window.location.href,
      });
    }
  }

  identify(userId: string, traits?: Record<string, any>) {
    if (!this.isInitialized) return;

    // Google Analytics
    if (window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        user_id: userId,
        custom_map: traits,
      });
    }
  }
}

// Global analytics instance
export const analytics = new AnalyticsService();

// Convenience functions
export const trackEvent = (name: string, properties?: Record<string, any>) => {
  analytics.track({ name, properties });
};

export const trackPageView = (path: string, title?: string) => {
  analytics.page(path, title);
};

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  analytics.identify(userId, traits);
};
