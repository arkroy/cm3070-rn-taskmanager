import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { resetPassword, confirmResetPassword } from '@aws-amplify/auth'; // Import the updated functions
import styles from './forgotPasswordScreen.styles';

function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [stage, setStage] = useState(1); // 1: Enter email, 2: Enter code and new password
  const { colors } = useTheme();

  const handleSendCode = async () => {
    try {
      await resetPassword({
        username: email, // Pass the email as the username
        options: {},     // Additional options if needed (e.g., clientMetadata)
      });
      setStage(2); // Move to the next stage to allow the user to enter the code and new password
    } catch (error) {
      alert('Error sending code. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    try {
      await confirmResetPassword({
        username: email,
        newPassword,               // The new password the user wants to set
        confirmationCode: code,    // The code sent to the user's email
        options: {},               // Additional options if needed (e.g., clientMetadata)
      });
      alert('Password reset successful! Please log in with your new password.');
      navigation.navigate('Login'); // Redirect to the Login screen after successful reset
    } catch (error) {
      console.log('Error resetting password:', error);
      alert('Error resetting password. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {stage === 1 ? (
        <>
          <Text style={styles.instructionText}>Enter your email address to receive a verification code.</Text>
          <TextInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button
            mode="contained"
            onPress={handleSendCode}
            style={styles.button}
          >
            <Text variant="bodyMedium">Send Code</Text>
          </Button>
        </>
      ) : (
        <>
          <Text style={styles.instructionText}>Enter the verification code you received and your new password.</Text>
          <TextInput
            label="Verification Code"
            value={code}
            onChangeText={setCode}
            style={styles.input}
          />
          <TextInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            secureTextEntry
          />
          <Button
            mode="contained"
            onPress={handleResetPassword}
            style={styles.button}
          >
            <Text variant="bodyMedium">Reset Password</Text>
          </Button>
        </>
      )}
    </View>
  );
}

export default ForgotPasswordScreen;