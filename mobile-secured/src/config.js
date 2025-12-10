// M1: FIXED - No hardcoded secrets
// API URL is configured via environment or defaults to localhost
// For production, use environment variables or Expo Constants

// M5: Note - For local development, HTTP is acceptable
// In production, this should be HTTPS
// For Android emulator: http://10.0.2.2:5000
// For iOS simulator: http://localhost:5000
// For production: https://your-api-domain.com

// Try to get from environment variable first, then default
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 
                       "http://10.0.2.2:5000";

// M1: FIXED - No hardcoded API keys
// If API keys are needed, they should be:
// 1. Stored in environment variables
// 2. Retrieved from secure backend endpoint after authentication
// 3. Never hardcoded in source code
