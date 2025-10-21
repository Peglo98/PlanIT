// CalendarScreen business logic handlers (Vulnerable Version)
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config';

export const calendarHandler = {
  /**
   * Fetch events (M3: IDOR - user_id from client)
   */
  async fetchEvents() {
    const userId = await AsyncStorage.getItem('user_id');
    const response = await axios.get(`${API_URL}/events?user_id=${userId}`);
    return { success: true, data: response.data };
  },

  /**
   * Add a new event (M3: IDOR - user_id from client)
   */
  async addEvent(title, date, onSuccess) {
    const userId = await AsyncStorage.getItem('user_id');
    await axios.post(`${API_URL}/events`, {
      user_id: userId,
      title,
      date
    });
    if (onSuccess) onSuccess();
    return { success: true };
  }
};
