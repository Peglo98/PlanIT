// RegisterScreen business logic handlers
import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '../config';

export const registerHandler = {
  /**
   * Validate registration input
   */
  validateInput(username, password, confirmPassword) {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return false;
    }

    if (username.length > 50) {
      Alert.alert('Validation Error', 'Username must be 50 characters or less');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }

    return true;
  },

  /**
   * Handle user registration
   */
  async handleRegister(username, password, navigation) {
    try {
      await axios.post(`${API_URL}/register`, { 
        username: username.trim(), 
        password 
      });
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      Alert.alert('Error', errorMessage);
      return { success: false, error: errorMessage };
    }
  }
};
