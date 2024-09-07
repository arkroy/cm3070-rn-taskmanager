import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TaskList = ({ task, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.taskDetails}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.time}>
        {new Date(task.startTime).toLocaleTimeString()} - {new Date(task.endTime).toLocaleTimeString()}
      </Text>
      <Text style={styles.location}>Location: {task.location}</Text>
      <Text style={styles.cost}>Cost: ${task.cost}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  taskDetails: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  time: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  cost: {
    fontSize: 14,
    color: '#666',
  },
});

export default TaskList;