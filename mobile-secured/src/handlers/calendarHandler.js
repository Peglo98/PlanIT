// CalendarScreen business logic handlers
import axios from 'axios';
import { Alert } from 'react-native';
import { API_URL } from '../config';

export const calendarHandler = {
  /**
   * Fetch all events for the authenticated user
   * M3: FIXED - No user_id needed, backend uses JWT token
   */
  async fetchEvents(navigation) {
    try {
      const response = await axios.get(`${API_URL}/events`);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response?.status === 401) {
        Alert.alert('Session Expired', 'Please login again', [
          { text: 'OK', onPress: () => navigation.replace('Login') }
        ]);
        return { success: false, error: 'UNAUTHORIZED' };
      } else {
        Alert.alert('Error', 'Failed to load events');
        return { success: false, error: 'FETCH_FAILED' };
      }
    }
  },

  /**
   * Validate event input
   */
  validateInput(title, date) {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter an event title');
      return false;
    }

    if (!date.trim()) {
      Alert.alert('Validation Error', 'Please enter a date');
      return false;
    }

    // Basic date format validation (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date.trim())) {
      Alert.alert('Validation Error', 'Please enter date in YYYY-MM-DD format');
      return false;
    }

    return true;
  },

  /**
   * Add a new event
   * M3: FIXED - No user_id needed, backend uses JWT token
   */
  async addEvent(title, date, onSuccess) {
    try {
      await axios.post(`${API_URL}/events`, {
        title: title.trim(),
        date: date.trim()
      });
      if (onSuccess) onSuccess();
      return { success: true };
    } catch (error) {
      if (error.response?.status === 401) {
        return { success: false, error: 'UNAUTHORIZED' };
      } else {
        Alert.alert('Error', error.response?.data?.error || 'Failed to add event');
        return { success: false, error: 'ADD_FAILED' };
      }
    }
  }
};
