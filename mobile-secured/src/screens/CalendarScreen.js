import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { calendarHandler } from '../handlers/calendarHandler';
import { calendarStyles } from '../styles/calendarStyles';

export default function CalendarScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const result = await calendarHandler.fetchEvents(navigation);
    if (result.success) {
      setEvents(result.data);
    }
    setLoading(false);
  };

  const addEvent = async () => {
    if (!calendarHandler.validateInput(newTitle, newDate)) {
      return;
    }

    setLoading(true);
    const result = await calendarHandler.addEvent(newTitle, newDate, () => {
      setNewTitle('');
      setNewDate('');
      fetchEvents();
    });
    if (result.error === 'UNAUTHORIZED') {
      // Navigation handled in handler
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View style={calendarStyles.card}>
      <View style={calendarStyles.cardHeader}>
        <Text style={calendarStyles.eventTitle}>{item.title}</Text>
      </View>
      <Text style={calendarStyles.eventDate}>{item.date}</Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={calendarStyles.emptyContainer}>
      <Text style={calendarStyles.emptyText}>No events yet</Text>
      <Text style={calendarStyles.emptySubtext}>Add your first event below</Text>
    </View>
  );

  return (
    <View style={calendarStyles.container}>
      <View style={calendarStyles.header}>
        <Text style={calendarStyles.title}>My Calendar</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={calendarStyles.backButton}>
          <Text style={calendarStyles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
      
      <View style={calendarStyles.form}>
        <Text style={calendarStyles.label}>Event Title</Text>
        <TextInput 
          style={calendarStyles.input} 
          placeholder="Enter event title" 
          placeholderTextColor="#999"
          value={newTitle}
          onChangeText={setNewTitle}
          maxLength={200}
        />
        
        <Text style={calendarStyles.label}>Date (YYYY-MM-DD)</Text>
        <TextInput 
          style={calendarStyles.input} 
          placeholder="2024-12-25" 
          placeholderTextColor="#999"
          value={newDate}
          onChangeText={setNewDate}
          maxLength={10}
        />
        
        <TouchableOpacity 
          style={[calendarStyles.addButton, loading && calendarStyles.buttonDisabled]} 
          onPress={addEvent}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={calendarStyles.addButtonText}>Add Event</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={calendarStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          style={calendarStyles.list}
          contentContainerStyle={events.length === 0 ? calendarStyles.emptyList : calendarStyles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}
