/**
 * Feature Flags Configuration
 * 
 * Centralized feature flag management using environment variables.
 * This allows for easy toggling of features between environments.
 */

const features = {
  // Authentication Feature Flag
  // When false: Users are redirected to waiting page instead of real auth
  // When true: Normal authentication flow with backend APIs
  AUTH_ENABLED: import.meta.env.VITE_AUTH_ENABLED === 'true',
  
  // Add more feature flags here as needed
  // PAYMENTS_ENABLED: import.meta.env.VITE_PAYMENTS_ENABLED === 'true',
  // ANALYTICS_ENABLED: import.meta.env.VITE_ANALYTICS_ENABLED === 'true',
};

/**
 * Get a feature flag value
 * @param {string} flagName - The name of the feature flag
 * @returns {boolean} - The feature flag value
 */
export const getFeatureFlag = (flagName) => {
  return features[flagName] || false;
};

/**
 * Check if authentication is enabled
 * @returns {boolean} - True if auth is enabled, false otherwise
 */
export const isAuthEnabled = () => {
  return getFeatureFlag('AUTH_ENABLED');
};

/**
 * Get current environment info for debugging
 * @returns {object} - Environment and feature flag info
 */
export const getEnvironmentInfo = () => {
  return {
    mode: import.meta.env.MODE,
    authEnabled: isAuthEnabled(),
    allFlags: features,
  };
};

export default features;