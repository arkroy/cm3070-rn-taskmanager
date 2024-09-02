import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { signIn } from '@aws-amplify/auth';
import { isAuthenticatedVar, userVar } from '../../utils/apolloState'; // Import the reactive variable
import styles from './loginScreen.styles';

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { colors } = useTheme();

  const handleLogin = async () => {
    setErrorMessage(''); // Reset any previous error messages
  
    try {
      if (!username.trim() || !password.trim()) {
        setErrorMessage("Email and Password are required.");
        return;
      }
  
      console.log('Attempting sign in with:', username.trim());
  
      // Sign in the user using Amplify Auth
      const user = await signIn({
        username: username.trim(),
        password: password.trim(),
        options: {
          authFlowType: 'USER_PASSWORD_AUTH',
        },
      });
  
      if (user) {
        // Assuming user is successfully signed in, fetch the current session
        const session = await Auth.currentSession();
        const token = session.getIdToken().getJwtToken();
  
        // Store the user details and token in the reactive variable
        userVar({
          ...user.attributes,
          token,
        });
  
        // Update the authentication state in the reactive variable
        isAuthenticatedVar(true);
  
        // Navigate to the Dashboard
        navigation.navigate('Dashboard');
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } catch (error) {
      console.log('Sign in error details:', error); // Log the full error object
      setErrorMessage(error.message || 'An unknown error occurred.');
    }
  };

  const handleSignup = () => {
    navigation.navigate('Registration');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Email Address"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        <Text variant="bodyMedium">Login</Text>
      </Button>
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={[styles.link, { color: colors.primary }]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <Button mode="outlined" onPress={handleSignup} style={styles.button}>
        <Text variant="bodyMedium">Register Now</Text>
      </Button>
    </View>
  );
}

export default LoginScreen;