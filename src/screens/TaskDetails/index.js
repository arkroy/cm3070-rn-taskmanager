import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useReactiveVar } from '@apollo/client';
import { currentTaskVar } from '../../utils/apolloState'; // Import the reactive variable

function TaskDetailsScreen({ navigation }) {
  const task = useReactiveVar(currentTaskVar); // Retrieve the task from the reactive variable

  if (!task) {
    return <Text>No task details available</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.detailCard}>
        <Text style={styles.label}>Title:</Text>
        <Text style={styles.value}>{task.title}</Text>
      </View>
      <View style={styles.detailCard}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{new Date(task.date).toDateString()}</Text>
      </View>
      <View style={styles.detailCard}>
        <Text style={styles.label}>Start Time:</Text>
        <Text style={styles.value}>{new Date(task.startTime).toLocaleTimeString()}</Text>
      </View>
      <View style={styles.detailCard}>
        <Text style={styles.label}>End Time:</Text>
        <Text style={styles.value}>{new Date(task.endTime).toLocaleTimeString()}</Text>
      </View>
      <View style={styles.detailCard}>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>{task.location}</Text>
      </View>
      <View style={styles.detailCard}>
        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{task.type}</Text>
      </View>
      <View style={styles.detailCard}>
        <Text style={styles.label}>Cost:</Text>
        <Text style={styles.value}>${task.cost}</Text>
      </View>
      <View style={styles.detailCard}>
        <Text style={styles.label}>Notes:</Text>
        <Text style={styles.value}>{task.notes}</Text>
      </View>
      <View style={styles.detailCard}>
        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{task.userId}</Text>
      </View>
      <View style={styles.detailCard}>
        <Text style={styles.label}>Created At:</Text>
        <Text style={styles.value}>{new Date(task.createdAt).toLocaleString()}</Text>
      </View>
      <View style={styles.detailCard}>
        <Text style={styles.label}>Updated At:</Text>
        <Text style={styles.value}>{new Date(task.updatedAt).toLocaleString()}</Text>
      </View>
      <View style={styles.detailCard}>
        <Text style={styles.label}>Owner:</Text>
        <Text style={styles.value}>{task.owner}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
});

export default TaskDetailsScreen;