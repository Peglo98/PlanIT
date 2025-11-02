import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button } from 'react-native';
import { calendarHandler } from '../handlers/calendarHandler';
import { calendarStyles } from '../styles/calendarStyles';

export default function CalendarScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const result = await calendarHandler.fetchEvents();
    if (result.success) {
      setEvents(result.data);
    }
  };

  const addEvent = async () => {
    await calendarHandler.addEvent(newTitle, newDate, () => {
      setNewTitle('');
      setNewDate('');
      fetchEvents();
    });
  };

  return (
    <View style={calendarStyles.container}>
      <Text style={calendarStyles.title}>My Calendar</Text>
      
      <View style={calendarStyles.form}>
        <TextInput 
          style={calendarStyles.input} 
          placeholder="Event Title" 
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput 
          style={calendarStyles.input} 
          placeholder="Date (YYYY-MM-DD)" 
          value={newDate}
          onChangeText={setNewDate}
        />
        <Button title="Add Event" onPress={addEvent} />
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={calendarStyles.card}>
            <Text style={calendarStyles.date}>{item.date}</Text>
            <Text style={calendarStyles.eventTitle}>{item.title}</Text>
          </View>
        )}
      />
      
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
