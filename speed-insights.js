/**
 * Vercel Speed Insights for Static HTML
 * This script loads and initializes the Speed Insights tracking
 * Documentation: https://vercel.com/docs/speed-insights/quickstart
 */

(function() {
  'use strict';
  
  // Import and initialize Speed Insights
  // For static HTML sites, we load the script directly from Vercel's CDN
  if (typeof window !== 'undefined') {
    // Initialize the queue for tracking events
    if (!window.si) {
      window.si = function() {
        (window.siq = window.siq || []).push(arguments);
      };
    }
    
    // Determine the script source based on environment
    var isDev = false;
    try {
      isDev = window.location.hostname === 'localhost' || 
              window.location.hostname === '127.0.0.1' ||
              window.location.hostname.includes('local');
    } catch (e) {
      // Ignore errors
    }
    
    var scriptSrc = isDev 
      ? 'https://va.vercel-scripts.com/v1/speed-insights/script.debug.js'
      : '/_vercel/speed-insights/script.js';
    
    // Check if script is already loaded
    if (document.head.querySelector('script[src*="speed-insights/script"]')) {
      console.log('[Speed Insights] Script already loaded');
      return;
    }
    
    // Create and inject the Speed Insights script
    var script = document.createElement('script');
    script.src = scriptSrc;
    script.defer = true;
    script.setAttribute('data-sdkn', '@vercel/speed-insights');
    script.setAttribute('data-sdkv', '1.3.1');
    
    script.onerror = function() {
      console.warn(
        '[Speed Insights] Failed to load from ' + scriptSrc + 
        '. Speed Insights will be available when deployed to Vercel.'
      );
    };
    
    script.onload = function() {
      console.log('[Speed Insights] Successfully initialized');
    };
    
    // Append script to head
    document.head.appendChild(script);
  }
})();
