import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const AppHeader = ({ screen }) => {
  const navigation = useNavigation();

  const renderLeftIcon = () => {
    if (screen === 'Dashboard') {
      return (
        <TouchableOpacity>
          <View style={styles.profilePicture}>
            <Text style={styles.initials}>AB</Text>
          </View>
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

  const renderRightIcon = () => {
    if (screen === 'TaskDetails' || screen === 'CreateTask') {
      return (
        <TouchableOpacity>
          <Ionicons name="pencil" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity>
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
        <TouchableOpacity>
          <Ionicons name="notifications" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white', // Ensure it matches your header background color
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
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: 'white',
    fontSize: 18,
  },
  logo: {
    width: 100,
    height: 40,
  },
  icon: {
    marginLeft: 15,
    marginRight: 15,
  },
});

export default AppHeader;