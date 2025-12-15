// HomeScreen business logic handlers
import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '../config';
import { authService } from '../services/authService';

export const homeHandler = {
  /**
   * Load user information from secure storage
   */
  async loadUserInfo() {
    try {
      const info = await authService.getUserInfo();
      return info;
    } catch (error) {
      console.error('Error loading user info:', error);
      return { username: '', userId: null };
    }
  },

  /**
   * Fetch all tasks for the authenticated user
   * M3: FIXED - No user_id parameter needed, backend uses JWT token
   */
  async fetchTasks(navigation) {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again', [
          { text: 'OK', onPress: () => navigation.replace('Login') }
        ]);
        return { success: false, error: 'UNAUTHORIZED' };
      } else {
        Alert.alert('Error', 'Failed to load tasks');
        return { success: false, error: 'FETCH_FAILED' };
      }
    }
  },

  /**
   * Search tasks by query
   * M4: FIXED - Backend now uses parameterized queries
   */
  async searchTasks(searchQuery, navigation) {
    if (!searchQuery.trim()) {
      Alert.alert('Validation Error', 'Please enter a search query');
      return { success: false, error: 'VALIDATION_ERROR' };
    }

    try {
      const response = await axios.get(
        `${API_URL}/tasks/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again', [
          { text: 'OK', onPress: () => navigation.replace('Login') }
        ]);
        return { success: false, error: 'UNAUTHORIZED' };
      } else {
        Alert.alert('Error', error.response?.data?.error || 'Search failed');
        return { success: false, error: 'SEARCH_FAILED' };
      }
    }
  },

  /**
   * Toggle task completion status
   */
  async toggleTaskDone(taskId, currentStatus) {
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, {
        is_done: !currentStatus
      });
      return { success: true };
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
      return { success: false };
    }
  },

  /**
   * Delete a task
   */
  async deleteTask(taskId, onSuccess) {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/tasks/${taskId}`);
              if (onSuccess) onSuccess();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            }
          }
        }
      ]
    );
  },

  /**
   * Handle logout
   */
  async handleLogout(navigation) {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await authService.removeToken();
            navigation.replace('Login');
          }
        }
      ]
    );
  }
};
