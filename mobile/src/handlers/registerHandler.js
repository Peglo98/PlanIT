// RegisterScreen business logic handlers (Vulnerable Version)
import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '../config';

export const registerHandler = {
  /**
   * Handle user registration
   */
  async handleRegister(username, password, navigation) {
    try {
      await axios.post(`${API_URL}/register`, { username, password });
      Alert.alert('Success', 'User registered!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      return { success: true };
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Registration failed');
      return { success: false, error };
    }
  }
};
