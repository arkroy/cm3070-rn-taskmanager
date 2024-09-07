import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const TaskFilters = ({ taskTypeFilter, setTaskTypeFilter, taskStatusFilter, setTaskStatusFilter, tasks }) => {
  const taskCounts = {
    personal: tasks.filter(task => task.type === 'PERSONAL').length,
    professional: tasks.filter(task => task.type === 'PROFESSIONAL').length,
    complete: tasks.filter(task => task.status === 'COMPLETE').length,
    pending: tasks.filter(task => task.status === 'INCOMPLETE' || task.status === 'INPROGRESS').length,
  };

  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setTaskTypeFilter('PERSONAL')}
      >
        <Text>Personal ({taskCounts.personal})</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setTaskTypeFilter('PROFESSIONAL')}
      >
        <Text>Professional ({taskCounts.professional})</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setTaskStatusFilter('COMPLETE')}
      >
        <Text>Complete ({taskCounts.complete})</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setTaskStatusFilter('INCOMPLETE')}
      >
        <Text>Pending ({taskCounts.pending})</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    padding: 10,
  },
});

export default TaskFilters;