// LoginScreen business logic handlers (Vulnerable Version)
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '../config';

export const loginHandler = {
  /**
   * Check for stored credentials (M9: Insecure Data Storage)
   * M9: Insecure Data Storage - Reading plain text credentials
   */
  async checkStoredCredentials() {
    try {
      const storedUser = await AsyncStorage.getItem('username');
      const storedPass = await AsyncStorage.getItem('password');
      if (storedUser && storedPass) {
        return {
          username: storedUser,
          password: storedPass,
          rememberMe: true
        };
      }
      return { username: '', password: '', rememberMe: false };
    } catch (e) {
      console.error(e);
      return { username: '', password: '', rememberMe: false };
    }
  },

  /**
   * Handle user login (M9: Insecure Data Storage)
   * M9: Insecure Data Storage - Saving plain text credentials
   */
  async handleLogin(username, password, rememberMe, navigation) {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      
      if (rememberMe) {
        // M9: Insecure Data Storage - Saving plain text credentials
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('password', password);
      } else {
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('password');
      }

      // Save user_id for session
      await AsyncStorage.setItem('user_id', String(response.data.user_id));
      
      navigation.replace('Home');
      return { success: true };
    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.error || 'Unknown error');
      return { success: false, error };
    }
  }
};
