import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import { resetPassword, confirmResetPassword } from '@aws-amplify/auth';
import styles from './forgotPasswordScreen.styles';

function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [stage, setStage] = useState(1);

  const handleSendCode = async () => {
    try {
      await resetPassword({
        username: email, 
        options: {},
      });
      setStage(2);
    } catch (error) {
      Alert.alert('Error', 'Error sending code. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    try {
      await confirmResetPassword({
        username: email,
        newPassword,            
        confirmationCode: code,
        options: {},       
      });
      Alert.alert('Success', 'Password reset successful! Please log in with your new password.');
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error resetting password:', error);
      Alert.alert('Error', 'Error resetting password. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {stage === 1 ? (
        <>
          <Text style={styles.instructionText}>Enter your email address to receive a verification code.</Text>
          <TextInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={handleSendCode} style={styles.primaryButtonContainer}>
            <Text style={styles.buttonText}>Send Code</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.instructionText}>Enter the verification code you received and your new password.</Text>
          <TextInput
            placeholder="Verification Code"
            value={code}
            onChangeText={setCode}
            style={styles.input}
          />
          <TextInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            secureTextEntry
          />
          <TouchableOpacity onPress={handleResetPassword} style={styles.primaryButtonContainer}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

export default ForgotPasswordScreen;