import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { registerHandler } from '../handlers/registerHandler';
import { registerStyles } from '../styles/registerStyles';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!registerHandler.validateInput(username, password, confirmPassword)) {
      return;
    }

    setLoading(true);
    await registerHandler.handleRegister(username, password, navigation);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      style={registerStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={registerStyles.content}>
        <Text style={registerStyles.title}>Create Account</Text>
        <Text style={registerStyles.subtitle}>Join PlanItSecure today</Text>
        
        <View style={registerStyles.form}>
          <Text style={registerStyles.label}>Username</Text>
          <TextInput
            style={registerStyles.input}
            placeholder="Choose a username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={50}
          />
          
          <Text style={registerStyles.label}>Password</Text>
          <TextInput
            style={registerStyles.input}
            placeholder="Create a password (min. 6 characters)"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          
          <Text style={registerStyles.label}>Confirm Password</Text>
          <TextInput
            style={registerStyles.input}
            placeholder="Confirm your password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity 
            style={[registerStyles.button, loading && registerStyles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={registerStyles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={registerStyles.linkButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={registerStyles.linkText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
