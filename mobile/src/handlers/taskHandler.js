// AddTaskScreen business logic handlers (Vulnerable Version)
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '../config';

export const taskHandler = {
  /**
   * Add a new task (M3: IDOR - user_id from client)
   */
  async addTask(title, description, navigation) {
    const userId = await AsyncStorage.getItem('user_id');
    
    if (!userId) {
      Alert.alert('Error', 'Please login first');
      navigation.replace('Login');
      return { success: false, error: 'NO_USER_ID' };
    }

    if (!title || !title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return { success: false, error: 'NO_TITLE' };
    }

    try {
      await axios.post(`${API_URL}/tasks`, {
        user_id: userId,
        title: title.trim(),
        description: description ? description.trim() : ''
      });
      navigation.goBack();
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Could not add task';
      Alert.alert('Error', errorMessage);
      console.error('Add task error:', error.response?.data || error);
      return { success: false, error };
    }
  }
};
