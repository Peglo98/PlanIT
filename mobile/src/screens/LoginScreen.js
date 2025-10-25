import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Switch } from 'react-native';
import { loginHandler } from '../handlers/loginHandler';
import { loginStyles } from '../styles/loginStyles';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    checkStoredCredentials();
  }, []);

  const checkStoredCredentials = async () => {
    const result = await loginHandler.checkStoredCredentials();
    setUsername(result.username);
    setPassword(result.password);
    setRememberMe(result.rememberMe);
  };

  const handleLogin = async () => {
    await loginHandler.handleLogin(username, password, rememberMe, navigation);
  };

  return (
    <View style={loginStyles.container}>
      <Text style={loginStyles.title}>PlanItBroken Login</Text>
      <TextInput
        style={loginStyles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={loginStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <View style={loginStyles.row}>
        <Text>Remember Me (Insecure): </Text>
        <Switch value={rememberMe} onValueChange={setRememberMe} />
      </View>

      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} color="gray" />
    </View>
  );
}
