// HomeScreen business logic handlers (Vulnerable Version)
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL, API_KEY } from '../config';

export const homeHandler = {
  /**
   * Load user ID from AsyncStorage
   */
  async loadUserAndTasks() {
    const id = await AsyncStorage.getItem('user_id');
    return id;
  },

  /**
   * Fetch tasks by user_id (M3: IDOR vulnerability)
   * M3: Insecure Authorization (IDOR) - Requesting tasks by simple user_id param
   */
  async fetchTasks(userId) {
    try {
      const response = await axios.get(`${API_URL}/tasks?user_id=${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(error);
      return { success: false, error };
    }
  },

  /**
   * Search tasks (M4: SQL Injection vulnerability)
   * M4: Insufficient Input Validation - Sending raw query to vulnerable endpoint
   */
  async handleSearch(searchQuery) {
    try {
      const response = await axios.get(`${API_URL}/tasks/search?q=${searchQuery}`);
      return { success: true, data: response.data };
    } catch (error) {
      // M8: Security Misconfiguration - Showing stack trace to user if server sends it
      Alert.alert("Server Error", JSON.stringify(error.response?.data));
      return { success: false, error };
    }
  },

  /**
   * Get hardcoded API key (M1: Improper Credential Usage)
   */
  getApiKey() {
    return API_KEY;
  }
};
