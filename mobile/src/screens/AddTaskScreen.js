import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { taskHandler } from '../handlers/taskHandler';
import { taskStyles } from '../styles/taskStyles';

export default function AddTaskScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    await taskHandler.addTask(title, description, navigation);
  };

  return (
    <View style={taskStyles.container}>
      <Text style={taskStyles.title}>New Task</Text>
      <TextInput
        style={taskStyles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={taskStyles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Save Task" onPress={handleAdd} />
    </View>
  );
}
