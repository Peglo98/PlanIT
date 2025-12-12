// Authentication service with secure token storage
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '../config';

const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'user_id';
const USERNAME_KEY = 'username';

// M9: FIXED - Using SecureStore instead of AsyncStorage for sensitive data
export const authService = {
  async saveToken(token) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  },

  async getToken() {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async removeToken() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_ID_KEY);
      await SecureStore.deleteItemAsync(USERNAME_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  async saveUserInfo(userId, username) {
    try {
      await SecureStore.setItemAsync(USER_ID_KEY, String(userId));
      await SecureStore.setItemAsync(USERNAME_KEY, username);
    } catch (error) {
      console.error('Error saving user info:', error);
    }
  },

  async getUserInfo() {
    try {
      const userId = await SecureStore.getItemAsync(USER_ID_KEY);
      const username = await SecureStore.getItemAsync(USERNAME_KEY);
      return { userId, username };
    } catch (error) {
      console.error('Error getting user info:', error);
      return { userId: null, username: null };
    }
  },

  // Configure axios to include token in requests
  setupAxiosInterceptors() {
    axios.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, clear storage
          await this.removeToken();
        }
        return Promise.reject(error);
      }
    );
  }
};

// Initialize interceptors
authService.setupAxiosInterceptors();
