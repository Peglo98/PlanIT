// CalendarScreen styles (Vulnerable Version)
import { StyleSheet } from 'react-native';

export const calendarStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    paddingTop: 50 
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20 
  },
  form: { 
    marginBottom: 20, 
    padding: 10, 
    backgroundColor: '#eee', 
    borderRadius: 8 
  },
  input: { 
    borderWidth: 1, 
    padding: 8, 
    marginBottom: 10, 
    backgroundColor: 'white' 
  },
  card: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderColor: '#ccc' 
  },
  date: { 
    fontWeight: 'bold', 
    color: 'blue' 
  },
  eventTitle: { 
    fontSize: 16 
  }
});
