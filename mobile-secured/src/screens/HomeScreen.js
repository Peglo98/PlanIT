import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { homeHandler } from '../handlers/homeHandler';
import { homeStyles } from '../styles/homeStyles';

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: '', userId: null });

  useEffect(() => {
    loadUserInfo();
    fetchTasks();
  }, []);

  const loadUserInfo = async () => {
    const info = await homeHandler.loadUserInfo();
    setUserInfo(info);
  };

  const fetchTasks = async () => {
    setLoading(true);
    const result = await homeHandler.fetchTasks(navigation);
    if (result.success) {
      setTasks(result.data);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    const result = await homeHandler.searchTasks(searchQuery, navigation);
    if (result.success) {
      setTasks(result.data);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    homeHandler.handleLogout(navigation);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const toggleTaskDone = async (taskId, currentStatus) => {
    const result = await homeHandler.toggleTaskDone(taskId, currentStatus);
    if (result.success) {
      fetchTasks(); // Refresh list
    }
  };

  const deleteTask = (taskId) => {
    homeHandler.deleteTask(taskId, fetchTasks);
  };

  const renderItem = ({ item }) => (
    <View style={homeStyles.card}>
      <View style={homeStyles.cardHeader}>
        <Text style={homeStyles.cardTitle}>{item.title}</Text>
        <View style={homeStyles.cardActions}>
          <TouchableOpacity
            onPress={() => toggleTaskDone(item.id, item.is_done)}
            style={[homeStyles.checkButton, item.is_done && homeStyles.checkButtonDone]}
          >
            <Text style={homeStyles.checkButtonText}>{item.is_done ? '✓' : '○'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteTask(item.id)}
            style={homeStyles.deleteButton}
          >
            <Text style={homeStyles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
      {item.description ? (
        <Text style={homeStyles.cardDescription}>{item.description}</Text>
      ) : null}
      <View style={homeStyles.cardFooter}>
        <Text style={homeStyles.cardMeta}>
          {item.is_done ? '✓ Completed' : '○ Pending'}
        </Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={homeStyles.emptyContainer}>
      <Text style={homeStyles.emptyText}>No tasks yet</Text>
      <Text style={homeStyles.emptySubtext}>Tap "Add Task" to create your first task</Text>
    </View>
  );

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.header}>
        <View>
          <Text style={homeStyles.title}>My Tasks</Text>
          {userInfo.username && (
            <Text style={homeStyles.subtitle}>Welcome, {userInfo.username}!</Text>
          )}
        </View>
        <TouchableOpacity onPress={handleLogout} style={homeStyles.logoutButton}>
          <Text style={homeStyles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={homeStyles.searchContainer}>
        <TextInput
          style={homeStyles.searchInput}
          placeholder="Search tasks..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={homeStyles.searchButton} onPress={handleSearch}>
          <Text style={homeStyles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={homeStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          style={homeStyles.list}
          contentContainerStyle={tasks.length === 0 ? homeStyles.emptyList : null}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <View style={homeStyles.footer}>
        <TouchableOpacity 
          style={homeStyles.addButton}
          onPress={() => navigation.navigate('AddTask')}
        >
          <Text style={homeStyles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={homeStyles.calendarButton}
          onPress={() => navigation.navigate('Calendar')}
        >
          <Text style={homeStyles.calendarButtonText}>📅 Calendar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
