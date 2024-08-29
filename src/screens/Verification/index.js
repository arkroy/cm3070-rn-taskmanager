import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import * as Auth from '@aws-amplify/auth'; // Import the specific function

const VerificationScreen = ({ route, navigation }) => {
  const { username } = route.params;
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerify = async () => {
    try {
      await Auth.confirmSignUp({username, confirmationCode});
      alert('Verification successful! You can now log in.');
      navigation.navigate('Login');

    } catch (error) {
      setErrorMessage(error.message);
      console.log('Error confirming sign up:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter the verification code sent to your email:</Text>
      <TextInput
        placeholder="Verification Code"
        value={confirmationCode}
        onChangeText={setConfirmationCode}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
      <Button title="Verify Email" onPress={handleVerify} />
    </View>
  );
};

export default VerificationScreen;