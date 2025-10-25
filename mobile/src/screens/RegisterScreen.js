import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { registerHandler } from '../handlers/registerHandler';
import { registerStyles } from '../styles/registerStyles';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    await registerHandler.handleRegister(username, password, navigation);
  };

  return (
    <View style={registerStyles.container}>
      <Text style={registerStyles.title}>Register</Text>
      <TextInput
        style={registerStyles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={registerStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Create Account" onPress={handleRegister} />
    </View>
  );
}
