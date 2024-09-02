import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut } from '@aws-amplify/auth';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { currentTaskVar, isAuthenticatedVar } from '../../utils/apolloState'; // Import Apollo Client variable

const AppHeader = ({ screen }) => {
  const navigation = useNavigation();

  const renderLeftIcon = () => (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} color="black" style={styles.icon} />
    </TouchableOpacity>
  );

  const logout = () => {
    signOut();
    isAuthenticatedVar(false)
  }

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
            currentTaskVar(null); // Clear the currentTaskVar to ensure empty fields
            navigation.navigate('EditTaskForm'); // Navigate to the EditTaskForm screen
          }}
        >
          <Ionicons name="add-circle" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
      );
    }
  };

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
});

export default AppHeader;