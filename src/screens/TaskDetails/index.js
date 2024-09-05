import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useReactiveVar, useMutation, gql } from '@apollo/client';
import { currentTaskVar } from '../../utils/apolloState';

// Define the deleteTask mutation locally
const DELETE_TASK = gql`
  mutation DeleteTask($input: DeleteTaskInput!) {
    deleteTask(input: $input) {
      id
      title
    }
  }
`;

const TaskDetailsScreen = ({ navigation }) => {
  const task = useReactiveVar(currentTaskVar);

  // Define the mutation for deleting a task
  const [deleteTaskMutation] = useMutation(DELETE_TASK, {
    onCompleted: () => {
      Alert.alert("Task deleted", "The task was successfully deleted.", [
        { text: "OK", onPress: () => navigation.navigate('Dashboard') }
      ]);
    },
    onError: (error) => {
      console.error("Error deleting task:", error); // Log detailed error
      Alert.alert("Error", `Failed to delete task: ${error.message}`);
    }
  });

  const handleDelete = () => {
    if (task && task.id) {
      // Ensure task.id is defined before attempting to delete
      deleteTaskMutation({
        variables: {
          input: {
            id: task.id // Only pass the task ID in the input object
          }
        }
      });
    } else {
      Alert.alert("Error", "Task ID is not defined.");
    }
  };

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>No task selected.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.taskDetails}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.time}>
          {new Date(task.startTime).toLocaleString()} - {new Date(task.endTime).toLocaleString()}
        </Text>
        <Text style={styles.date}>Date: {new Date(task.date).toLocaleDateString()}</Text>
        <Text style={styles.location}>Location: {task.location}</Text>
        <Text style={styles.type}>Type: {task.type}</Text>
        <Text style={styles.cost}>Cost: ${task.cost}</Text>
        <Text style={styles.notes}>Notes: {task.notes}</Text>
      </View>

      {task.attachments?.items?.length > 0 && (
        <View style={styles.attachmentsSection}>
          <Text style={styles.attachmentsHeader}>Attachments</Text>
          <FlatList
            data={task.attachments.items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.filePath }}
                style={styles.attachmentImage}
              />
            )}
            horizontal
          />
        </View>
      )}

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  taskDetails: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  time: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  date: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  location: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  type: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  cost: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  notes: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  attachmentsSection: {
    marginTop: 20,
  },
  attachmentsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  attachmentImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TaskDetailsScreen;