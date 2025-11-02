import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, TouchableOpacity } from 'react-native';
import { homeHandler } from '../handlers/homeHandler';
import { homeStyles } from '../styles/homeStyles';

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // M1: Improper Credential Usage - Displaying the hardcoded secret
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    loadUserAndTasks();
  }, []);

  const loadUserAndTasks = async () => {
    const id = await homeHandler.loadUserAndTasks();
    if (id) {
      setUserId(id);
      const result = await homeHandler.fetchTasks(id);
      if (result.success) {
        setTasks(result.data);
      }
    }
  };

  const fetchTasks = async (id) => {
    const result = await homeHandler.fetchTasks(id);
    if (result.success) {
      setTasks(result.data);
    }
  };

  const handleSearch = async () => {
    const result = await homeHandler.handleSearch(searchQuery);
    if (result.success) {
      setTasks(result.data);
    }
  };

  const renderItem = ({ item }) => (
    <View style={homeStyles.card}>
      <Text style={homeStyles.cardTitle}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text style={homeStyles.meta}>User ID: {item.user_id} | Done: {item.is_done ? 'Yes' : 'No'}</Text>
    </View>
  );

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.header}>
        <Text style={homeStyles.title}>My Tasks</Text>
        <Button title="Logout" onPress={() => navigation.replace('Login')} />
      </View>

      {/* M1 Demo */}
      <TouchableOpacity onPress={() => setShowSecret(!showSecret)}>
        <Text style={homeStyles.secret}>
          {showSecret ? `Secret: ${homeHandler.getApiKey()}` : "Tap to see Admin Secret (M1)"}
        </Text>
      </TouchableOpacity>

      {/* M3 Demo: IDOR Control */}
      <View style={homeStyles.controlPanel}>
        <Text>Viewing Tasks for User ID:</Text>
        <TextInput 
          style={homeStyles.input} 
          value={userId} 
          onChangeText={(text) => { setUserId(text); fetchTasks(text); }} 
          keyboardType="numeric"
        />
        <Text style={homeStyles.hint}>(Change ID to spy on others - M3)</Text>
      </View>

      {/* M4 Demo: SQLi Search */}
      <View style={homeStyles.controlPanel}>
        <TextInput 
          style={homeStyles.input} 
          placeholder="Search (Try ' OR '1'='1)" 
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button title="Search (M4)" onPress={handleSearch} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        style={homeStyles.list}
      />

      <View style={homeStyles.footer}>
        <Button title="Add Task" onPress={() => navigation.navigate('AddTask')} />
        <Button title="Calendar" onPress={() => navigation.navigate('Calendar')} />
      </View>
    </View>
  );
}
