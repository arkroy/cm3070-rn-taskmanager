import React, { useState } from 'react';
import { View, Image, TouchableOpacity, TextInput, Text, Button, Alert, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import * as Auth from 'aws-amplify/auth';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import styles from './registrationScreen.styles';

function RegistrationScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); // profile picture
  const [selectedUnit, setSelectedUnit] = useState(0);

  const selectProfilePicture = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const savedUri = await saveImageLocally(pickerResult.assets[0].uri); // Save image to local storage
      setProfilePicture(savedUri); // Set the URI of the saved image
    }
  };

  const saveImageLocally = async (uri) => {
    try {
      const fileName = uri.split('/').pop(); // Extract the file name
      const newPath = `${FileSystem.documentDirectory}${fileName}`; // Define a new path

      await FileSystem.copyAsync({
        from: uri,
        to: newPath,
      });

      return newPath; // Return the new path
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save profile picture');
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null); // Remove the profile picture
  };

  const handleRegister = async () => {
    try {
      // Perform the sign-up
      const result = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          name: fullName,
          'custom:unit': selectedUnit === 0 ? 'Imperial' : 'Metric',
        },
      });

      // Navigate to the VerificationScreen
      navigation.navigate('Verification', { username: email });
    } catch (error) {
      console.log('Error signing up:', error);
      Alert.alert(`Error signing up: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>New user registration</Text>
      <Text style={styles.description}>
        Welcome, you&apos;re one step away from being a chore champ. Please fill
        out the simple form below to get started.
      </Text>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
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
      <TouchableOpacity onPress={selectProfilePicture} style={styles.secondaryButtonContainer}>
        <Text style={styles.buttonText}>Select Profile Picture</Text>
      </TouchableOpacity>

      {profilePicture && (
        <View style={styles.profilePictureContainer}>
          <Image
            source={{ uri: profilePicture }}
            style={styles.profilePicture}
          />
          <TouchableOpacity
            onPress={removeProfilePicture}
            style={styles.removeIcon}
          >
            <Ionicons name="close-circle" size={24} color="red" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={handleRegister} style={styles.primaryButtonContainer}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default RegistrationScreen;