import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useReactiveVar } from '@apollo/client';
import { currentTaskVar } from '../../utils/apolloState';
import { useMutation, gql } from '@apollo/client';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

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
  const [date, setDate] = useState(task?.date || '');
  const [startTime, setStartTime] = useState(task?.startTime || '');
  const [endTime, setEndTime] = useState(task?.endTime || '');
  const [notes, setNotes] = useState(task?.notes || '');
  const [userId, setUserId] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

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
      date,
      startTime,
      endTime,
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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (selectedDate) => {
    setDate(moment(selectedDate).format('YYYY-MM-DD'));
    hideDatePicker();
  };

  const showStartTimePicker = () => {
    setStartTimePickerVisibility(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisibility(false);
  };

  const handleConfirmStartTime = (selectedTime) => {
    setStartTime(moment(selectedTime).format('HH:mm:ss'));
    hideStartTimePicker();
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisibility(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisibility(false);
  };

  const handleConfirmEndTime = (selectedTime) => {
    setEndTime(moment(selectedTime).format('HH:mm:ss'));
    hideEndTimePicker();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Cost"
        value={cost}
        keyboardType="numeric"
        onChangeText={setCost}
      />

      <TouchableOpacity onPress={showDatePicker}>
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          editable={false}
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />

      <TouchableOpacity onPress={showStartTimePicker}>
        <TextInput
          style={styles.input}
          placeholder="Start Time (HH:MM:SS)"
          value={startTime}
          editable={false}
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmStartTime}
        onCancel={hideStartTimePicker}
      />

      <TouchableOpacity onPress={showEndTimePicker}>
        <TextInput
          style={styles.input}
          placeholder="End Time (HH:MM:SS)"
          value={endTime}
          editable={false}
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmEndTime}
        onCancel={hideEndTimePicker}
      />

      <TextInput
        style={styles.input}
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
      />
      <Button title={isEditMode ? 'Save' : 'Create'} onPress={handleSave} />
    </ScrollView>
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
});

export default EditTaskForm;