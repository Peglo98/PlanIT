// LoginScreen business logic handlers
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '../config';
import { authService } from '../services/authService';

export const loginHandler = {
  /**
   * Check for stored credentials (non-sensitive preferences only)
   * M9: FIXED - Only store non-sensitive preference, not credentials
   */
  async checkStoredCredentials() {
    try {
      const rememberPreference = await AsyncStorage.getItem('rememberMe');
      if (rememberPreference === 'true') {
        const storedUser = await AsyncStorage.getItem('username');
        return {
          rememberMe: true,
          username: storedUser || ''
        };
      }
      return { rememberMe: false, username: '' };
    } catch (e) {
      console.error('Error checking stored credentials:', e);
      return { rememberMe: false, username: '' };
    }
  },

  /**
   * Validate login input
   * M4: Input validation
   */
  validateInput(username, password) {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter both username and password');
      return false;
    }

    if (username.length > 50) {
      Alert.alert('Validation Error', 'Username is too long');
      return false;
    }

    return true;
  },

  /**
   * Handle user login
   * M9: FIXED - Save token to SecureStore, not AsyncStorage
   */
  async handleLogin(username, password, rememberMe, navigation) {
    if (!this.validateInput(username, password)) {
      return { success: false };
    }

    try {
      const response = await axios.post(`${API_URL}/login`, { 
        username: username.trim(), 
        password 
      });
      
      // M9: FIXED - Save token to SecureStore, not AsyncStorage
      if (response.data.token) {
        await authService.saveToken(response.data.token);
        await authService.saveUserInfo(response.data.user_id, response.data.username);
      }

      // Store non-sensitive preferences only
      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
        await AsyncStorage.setItem('username', username.trim());
        // M9: FIXED - Password is NEVER stored
      } else {
        await AsyncStorage.removeItem('rememberMe');
        await AsyncStorage.removeItem('username');
      }
      
      navigation.replace('Home');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      Alert.alert('Login Failed', errorMessage);
      return { success: false, error: errorMessage };
    }
  }
};
