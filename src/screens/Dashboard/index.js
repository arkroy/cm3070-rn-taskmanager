import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import FloatingNavBar from '../../components/FloatingNavbar';
import { currentTaskVar } from '../../utils/apolloState'; // Import the reactive variable

const LIST_TASKS = gql`
  query ListTasks($filter: ModelTaskFilterInput, $limit: Int, $nextToken: String) {
    listTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        date
        startTime
        endTime
        location
        type
        cost
        notes
        userId
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;

function DashboardScreen({ navigation }) {
  const { data, loading, error } = useQuery(LIST_TASKS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading tasks: {error.message}</Text>;

  const renderTask = ({ item: task }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        currentTaskVar(task); // Set the selected task in the reactive variable
        navigation.navigate('TaskDetails'); // Navigate to TaskDetails screen
      }}
    >
      <View style={styles.taskDetails}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.time}>
          {new Date(task.startTime).toLocaleTimeString()} -{' '}
          {new Date(task.endTime).toLocaleTimeString()}
        </Text>
        <Text style={styles.location}>Location: {task.location}</Text>
        <Text style={styles.cost}>Cost: ${task.cost}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data.listTasks.items}
        renderItem={renderTask}
        keyExtractor={(task) => task.id}
      />
      <FloatingNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
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

export default DashboardScreen;