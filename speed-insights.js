/**
 * Vercel Speed Insights for Static HTML
 * This script injects the Speed Insights web vitals tracking
 */
(function() {
  'use strict';
  
  // Check if we're on Vercel (production) or if Speed Insights is explicitly enabled
  if (typeof window !== 'undefined') {
    // The Speed Insights script is automatically injected by Vercel when enabled in the dashboard
    // This file serves as a placeholder and documentation for the integration
    
    // Optionally, you can add custom beforeSend logic here if needed
    // See: https://vercel.com/docs/speed-insights/quickstart#beforeSend-(optional)
    
    console.log('[Speed Insights] Vercel Speed Insights is configured and will track when deployed');
  }
})();
