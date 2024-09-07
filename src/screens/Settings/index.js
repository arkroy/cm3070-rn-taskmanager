import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER, UPDATE_USER } from '../../utils/schemas';
import { userVar } from '../../utils/apolloState';
import { updatePassword } from 'aws-amplify/auth'; // Use the correct function for Amplify v6.5

const SettingsScreen = ({ navigation }) => {
  const user = userVar(); // Fetch user data from Apollo's reactive variable

  const [userDetails, setUserDetails] = useState({
    id: '',
    fullName: '',
    email: '',
    profilePicture: '',
    preferredTimezone: '',
    unitOfMeasurement: 'IMPERIAL',
  });

  // Password change inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Query to fetch user data
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: user?.sub || '' }, // Use the user ID from userVar
    skip: !user?.sub, // Skip query if no user ID
    fetchPolicy: 'network-only', // Ensure fresh data is fetched from the server
  });

  useEffect(() => {
    if (data?.getUser) {
      setUserDetails({
        id: data.getUser.id,
        fullName: data.getUser.fullName,
        email: data.getUser.email,
        profilePicture: data.getUser.profilePicture || '',
        preferredTimezone: data.getUser.preferredTimezone || '',
        unitOfMeasurement: data.getUser.unitOfMeasurement || 'IMPERIAL',
      });
    }
  }, [data]);

  const [updateUser] = useMutation(UPDATE_USER);

  const handleUpdate = async () => {
    if (!userDetails.fullName || !userDetails.email) {
      Alert.alert('Error', 'Full name and email are required');
      return;
    }

    try {
      await updateUser({
        variables: {
          input: {
            id: userDetails.id,
            fullName: userDetails.fullName,
            email: userDetails.email,
            profilePicture: userDetails.profilePicture,
            preferredTimezone: userDetails.preferredTimezone,
            unitOfMeasurement: userDetails.unitOfMeasurement,
          },
        },
      });
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  // Updated password change handler using Amplify v6.5's `updatePassword`
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await updatePassword({ oldPassword: currentPassword, newPassword });
      Alert.alert('Success', 'Password updated successfully');
    } catch (err) {
      console.error('Error changing password:', err);
      Alert.alert('Error', 'Failed to change password. Please ensure the current password is correct.');
    }
  };

  if (!user?.sub) {
    return <Text>Error: User ID is missing. Please log in.</Text>;
  }

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading user details: {error.message}</Text>;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={userDetails.fullName}
            onChangeText={(text) => setUserDetails({ ...userDetails, fullName: text })}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={userDetails.email}
            onChangeText={(text) => setUserDetails({ ...userDetails, email: text })}
          />

          <Text style={styles.label}>Profile Picture (URL)</Text>
          <TextInput
            style={styles.input}
            value={userDetails.profilePicture}
            onChangeText={(text) => setUserDetails({ ...userDetails, profilePicture: text })}
          />

          <Text style={styles.label}>Preferred Timezone</Text>
          <TextInput
            style={styles.input}
            value={userDetails.preferredTimezone}
            onChangeText={(text) => setUserDetails({ ...userDetails, preferredTimezone: text })}
          />

          <Text style={styles.label}>Unit of Measurement</Text>
          <View style={styles.unitToggle}>
            <Button
              title="Imperial"
              onPress={() => setUserDetails({ ...userDetails, unitOfMeasurement: 'IMPERIAL' })}
              color={userDetails.unitOfMeasurement === 'IMPERIAL' ? 'blue' : 'gray'}
            />
            <Button
              title="Metric"
              onPress={() => setUserDetails({ ...userDetails, unitOfMeasurement: 'METRIC' })}
              color={userDetails.unitOfMeasurement === 'METRIC' ? 'blue' : 'gray'}
            />
          </View>

          <Button title="Save Changes" onPress={handleUpdate} />

          {/* Section for changing password */}
          <Text style={styles.sectionTitle}>Change Password</Text>
          <TextInput
            placeholder="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />
          <Button title="Change Password" onPress={handleChangePassword} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 50, // Add padding to ensure content is reachable
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  unitToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default SettingsScreen;