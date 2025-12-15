// AddTaskScreen business logic handlers
import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '../config';

export const taskHandler = {
  /**
   * Validate task input
   */
  validateInput(title, description) {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a task title');
      return false;
    }

    if (title.length > 200) {
      Alert.alert('Validation Error', 'Title must be 200 characters or less');
      return false;
    }

    if (description.length > 1000) {
      Alert.alert('Validation Error', 'Description must be 1000 characters or less');
      return false;
    }

    return true;
  },

  /**
   * Add a new task
   * M3: FIXED - No user_id needed, backend uses JWT token
   */
  async addTask(title, description, navigation) {
    try {
      await axios.post(`${API_URL}/tasks`, {
        title: title.trim(),
        description: description.trim()
      });
      navigation.goBack();
      return { success: true };
    } catch (error) {
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again', [
          { text: 'OK', onPress: () => navigation.replace('Login') }
        ]);
        return { success: false, error: 'UNAUTHORIZED' };
      } else {
        Alert.alert('Error', error.response?.data?.error || 'Could not add task');
        return { success: false, error: 'ADD_FAILED' };
      }
    }
  }
};
