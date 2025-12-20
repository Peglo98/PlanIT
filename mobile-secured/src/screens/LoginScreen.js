import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Switch,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { loginHandler } from '../handlers/loginHandler';
import { loginStyles } from '../styles/loginStyles';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkStoredCredentials();
  }, []);

  const checkStoredCredentials = async () => {
    const result = await loginHandler.checkStoredCredentials();
    setRememberMe(result.rememberMe);
    setUsername(result.username);
  };

  const handleLogin = async () => {
    setLoading(true);
    await loginHandler.handleLogin(username, password, rememberMe, navigation);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      style={loginStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={loginStyles.content}>
        <Text style={loginStyles.title}>PlanItSecure</Text>
        <Text style={loginStyles.subtitle}>Welcome back!</Text>
        
        <View style={loginStyles.form}>
          <Text style={loginStyles.label}>Username</Text>
          <TextInput
            style={loginStyles.input}
            placeholder="Enter your username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <Text style={loginStyles.label}>Password</Text>
          <TextInput
            style={loginStyles.input}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          
          <View style={loginStyles.row}>
            <Text style={loginStyles.rememberText}>Remember username</Text>
            <Switch 
              value={rememberMe} 
              onValueChange={setRememberMe}
              trackColor={{ false: '#ccc', true: '#4CAF50' }}
              thumbColor={rememberMe ? '#fff' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity 
            style={[loginStyles.button, loading && loginStyles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={loginStyles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={loginStyles.linkButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={loginStyles.linkText}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
