import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Button } from 'react-native';
import { signIn } from '@aws-amplify/auth';
import { isAuthenticatedVar, userVar } from '../../utils/apolloState'; // Import the reactive variable
import styles from './loginScreen.styles';

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
        // Store the user details in the reactive variable
        userVar({
          ...user.attributes,
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
        placeholder="Email Address"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      <View style={styles.buttonRow}>
      <TouchableOpacity style={styles.primaryButtonContainer} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButtonContainer} onPress={handleSignup}>
        <Text style={styles.buttonText}>Register Now</Text>
      </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.link}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
     
    </View>
  );
}

export default LoginScreen;