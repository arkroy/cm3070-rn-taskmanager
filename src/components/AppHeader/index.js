import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, Alert } from 'react-native';
import { signOut } from '@aws-amplify/auth';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { currentTaskVar, isAuthenticatedVar, userVar } from '../../utils/apolloState'; 
import { useQuery } from '@apollo/client';
import { GET_USER } from '../../utils/schemas';
import * as FileSystem from 'expo-file-system';

const AppHeader = ({ screen }) => {
  const navigation = useNavigation();
  const user = userVar();
  const [imageExists, setImageExists] = useState(false); // State to check if the image exists

  // Fetch user data if it's not available
  const { data, loading } = useQuery(GET_USER, {
    variables: { id: user?.sub || '' }, 
    skip: !!user?.profilePicture, // Skip fetching if profile picture exists
    onCompleted: (data) => {
      if (data?.getUser) {
        userVar({
          ...userVar(),
          profilePicture: data.getUser.profilePicture, // Update the profile picture
        });
      }
    },
  });

  useEffect(() => {
    console.log('Current screen:', screen); 
    console.log('User profile picture:', user?.profilePicture);

    if (user?.profilePicture) {
      // Check if the file exists
      checkFileExists(user.profilePicture);
    } else {
      setImageExists(false);  // Fallback if profile picture is undefined
    }
  }, [screen, user]);

  const checkFileExists = async (fileUri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        setImageExists(true);
      } else {
        console.log('File does not exist:', fileUri);
        setImageExists(false);
      }
    } catch (error) {
      console.error('Error checking file existence:', error);
      setImageExists(false);
    }
  };

  const renderLeftIcon = () => {
    if (screen === 'Dashboard' && imageExists && user?.profilePicture) {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image 
            source={{ uri: Platform.OS === 'ios' ? user.profilePicture.replace('file://', '') : user.profilePicture }} 
            style={styles.profileImage} 
            onError={(error) => {
              console.error('Failed to load image:', error);
              Alert.alert('Failed to load image', 'Please try again.');
            }}
          />
        </TouchableOpacity>
      );
    } else if (screen === 'Dashboard') {
      // Show a default profile icon if no profile picture is available
      return (
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="person-circle" size={40} color="black" style={styles.icon} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
      );
    }
  };

  const logout = () => {
    signOut();
    isAuthenticatedVar(false);
  };

  const renderRightIcon = () => {
    if (screen === 'TaskDetails') {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('EditTaskForm')}>
          <Ionicons name="pencil" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            currentTaskVar(null);
            navigation.navigate('EditTaskForm');
          }}
        >
          <Ionicons name="add-circle" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
      );
    }
  };

  // Don't return null if the profile picture is undefined; handle the case gracefully
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderLeftIcon()}
        <Text>ChoreChamp</Text>
        {renderRightIcon()}
        <TouchableOpacity onPress={logout}>
          <Ionicons name="notifications" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  icon: {
    marginLeft: 15,
    marginRight: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
});

export default AppHeader;