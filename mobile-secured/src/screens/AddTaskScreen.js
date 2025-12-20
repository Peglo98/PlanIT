import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { taskHandler } from '../handlers/taskHandler';
import { taskStyles } from '../styles/taskStyles';

export default function AddTaskScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!taskHandler.validateInput(title, description)) {
      return;
    }

    setLoading(true);
    await taskHandler.addTask(title, description, navigation);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      style={taskStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={taskStyles.scrollContent}>
        <View style={taskStyles.content}>
          <Text style={taskStyles.title}>New Task</Text>
          <Text style={taskStyles.subtitle}>Create a new task to track</Text>
          
          <View style={taskStyles.form}>
            <Text style={taskStyles.label}>Title *</Text>
            <TextInput
              style={taskStyles.input}
              placeholder="Enter task title"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              maxLength={200}
              multiline={false}
            />
            <Text style={taskStyles.charCount}>{title.length}/200</Text>
            
            <Text style={taskStyles.label}>Description</Text>
            <TextInput
              style={[taskStyles.input, taskStyles.textArea]}
              placeholder="Enter task description (optional)"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              maxLength={1000}
              textAlignVertical="top"
            />
            <Text style={taskStyles.charCount}>{description.length}/1000</Text>

            <TouchableOpacity 
              style={[taskStyles.button, loading && taskStyles.buttonDisabled]} 
              onPress={handleAdd}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={taskStyles.buttonText}>Save Task</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={taskStyles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={taskStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
