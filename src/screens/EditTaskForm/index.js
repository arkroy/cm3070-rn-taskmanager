import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useReactiveVar } from '@apollo/client';
import { currentTaskVar } from '../../utils/apolloState';
import { useMutation, gql } from '@apollo/client';
import { getCurrentUser } from 'aws-amplify/auth';
import PlacesInput from '../../components/PlacesInput';

const UPDATE_TASK = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      id
      title
      location
      cost
      date
      startTime
      endTime
      notes
      type
      userId
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      location
      cost
      date
      startTime
      endTime
      notes
      type
      userId
    }
  }
`;

function EditTaskForm({ navigation }) {
  const task = useReactiveVar(currentTaskVar);
  const isEditMode = !!task;

  const [title, setTitle] = useState(task?.title || '');
  const [location, setLocation] = useState(task?.location || '');
  const [cost, setCost] = useState(task?.cost?.toString() || '');
  const [date, setDate] = useState(task?.date ? new Date(task.date) : new Date());
  const [startTime, setStartTime] = useState(task?.startTime ? new Date(task.startTime) : new Date());
  const [endTime, setEndTime] = useState(task?.endTime ? new Date(task.endTime) : new Date());
  const [notes, setNotes] = useState(task?.notes || '');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    async function currentAuthenticatedUser() {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        setUserId(userId);
        console.log(`The username: ${username}`);
        console.log(`The userId: ${userId}`);
        console.log(`The signInDetails: ${signInDetails}`);
      } catch (err) {
        console.log(err);
      }
    }
    currentAuthenticatedUser();
  }, []);

  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: () => {
      navigation.navigate('TaskDetails');
    },
    onError: (error) => {
      console.error('Failed to update task', error);
    },
  });

  const [createTask] = useMutation(CREATE_TASK, {
    onCompleted: () => {
      navigation.navigate('Dashboard');
    },
    onError: (error) => {
      console.error('Failed to create task', error);
    },
  });

  const handleSave = () => {
    if (!userId) {
      console.error('User ID is missing or invalid');
      return;
    }

    const input = {
      title,
      location,
      cost: cost ? parseFloat(cost) : null,
      date: date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      notes,
      type: task?.type || 'PROFESSIONAL',
      userId,
    };

    console.log('Saving task with input:', input);

    if (isEditMode) {
      console.log('Updating task...');
      updateTask({
        variables: {
          input: { ...input, id: task.id },
        },
      });
    } else {
      console.log('Creating new task...');
      createTask({
        variables: {
          input,
        },
      });
    }
  };

  return (
    <FlatList
      data={[{ key: 'form' }]} // A dummy item to wrap form fields inside FlatList
      renderItem={() => (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <PlacesInput
            placeholder="Location"
            onLocationSelect={setLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="Cost"
            value={cost}
            keyboardType="numeric"
            onChangeText={setCost}
          />
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Date</Text>
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => setDate(selectedDate || date)}
              style={styles.picker}
            />
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Start Time</Text>
            <DateTimePicker
              value={startTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => setStartTime(selectedTime || startTime)}
              style={styles.picker}
            />
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>End Time</Text>
            <DateTimePicker
              value={endTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => setEndTime(selectedTime || endTime)}
              style={styles.picker}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
          />
          <Button title={isEditMode ? 'Save' : 'Create'} onPress={handleSave} />
        </View>
      )}
      keyExtractor={(item) => item.key}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    width: '100%',
  },
});

export default EditTaskForm;