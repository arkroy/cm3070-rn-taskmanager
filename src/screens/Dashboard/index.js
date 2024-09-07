import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button, Platform } from 'react-native';
import { useQuery, gql } from '@apollo/client';
import DateTimePicker from '@react-native-community/datetimepicker';
import FloatingNavBar from '../../components/FloatingNavbar';
import { currentTaskVar } from '../../utils/apolloState';
import moment from 'moment'; // For date formatting

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
        attachments {
          items {
            id
            filePath
            fileType
          }
        }
        __typename
      }
      nextToken
      __typename
    }
  }
`;

function DashboardScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date()); // State to hold the selected date
  const [showDatePicker, setShowDatePicker] = useState(false); // State to control the visibility of the date picker

  // Filter to get tasks for the selected date
  const filter = {
    date: {
      eq: moment(selectedDate).format('YYYY-MM-DD'), // Filter tasks by selected date
    },
  };

  // Run the GraphQL query with the selected date filter
  const { data, loading, error } = useQuery(LIST_TASKS, { variables: { filter } });

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

  // Handle the date change from the picker
  const handleDateChange = (event, date) => {
    setShowDatePicker(false); // Close the date picker
    if (date) setSelectedDate(date); // Update the selected date
  };

  return (
    <View style={styles.container}>
      {/* Date Picker Button */}
      <View style={styles.datePickerContainer}>
        <Button
          title={`Filter by Date: ${moment(selectedDate).format('YYYY-MM-DD')}`}
          onPress={() => setShowDatePicker(true)} // Show the date picker when the button is pressed
        />
      </View>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
        />
      )}

      {/* Task List */}
      <FlatList
        data={data?.listTasks?.items || []}
        renderItem={renderTask}
        keyExtractor={(task) => task.id}
      />

      {/* Floating Navigation Bar */}
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
  datePickerContainer: {
    marginBottom: 10,
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