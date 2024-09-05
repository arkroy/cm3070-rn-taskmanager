import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch, TouchableOpacity, StyleSheet, Alert, Platform, FlatList, Image, TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import moment from 'moment'; // Using moment for date formatting
import { useReactiveVar, useMutation, gql } from '@apollo/client';
import { currentTaskVar, userVar } from '../../utils/apolloState';
import * as ImagePicker from 'expo-image-picker';
import PlacesInput from '../../components/PlacesInput';

// Define the create and update task mutations
const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      date
      startTime
      endTime
      location
      latitude
      longitude
      type
      notes
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      id
      title
      date
      startTime
      endTime
      location
      latitude
      longitude
      type
      notes
    }
  }
`;

// Mutation to create an attachment
const CREATE_ATTACHMENT = gql`
  mutation CreateAttachment($input: CreateAttachmentInput!) {
    createAttachment(input: $input) {
      id
      filePath
      fileType
    }
  }
`;

const EditTaskForm = ({ navigation }) => {
  const currentTask = useReactiveVar(currentTaskVar); // Get the current task if it's an edit operation

  // Define state variables
  const [title, setTitle] = useState(currentTask?.title || '');
  const [date, setDate] = useState(currentTask?.date ? new Date(currentTask.date) : new Date());
  const [startTime, setStartTime] = useState(currentTask?.startTime ? new Date(currentTask.startTime) : new Date());
  const [endTime, setEndTime] = useState(currentTask?.endTime ? new Date(currentTask.endTime) : new Date());
  const [isPersonal, setIsPersonal] = useState(currentTask?.type === 'PERSONAL' || true);
  const [location, setLocation] = useState(currentTask?.location || '');
  const [latitude, setLatitude] = useState(currentTask?.latitude || null);
  const [longitude, setLongitude] = useState(currentTask?.longitude || null);
  const [notes, setNotes] = useState(currentTask?.notes || '');
  const [attachments, setAttachments] = useState(currentTask?.attachments?.items.map(item => item.filePath) || []);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Define mutation hooks for creating and updating a task
  const [createTask] = useMutation(CREATE_TASK, {
    onCompleted: async (data) => {
      console.log("Create task completed:", data.createTask.id);
      await handleAttachments(data.createTask.id); // Pass the newly created task's ID to handleAttachments
      Alert.alert("Task Created", "Your task has been created successfully.");
      navigation.goBack();
    },
    onError: (error) => {
      console.error("Create task error:", error);
      Alert.alert("Error", `Failed to create task: ${error.message}`);
    },
  });

  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: async (data) => {
      console.log("Update task completed:", data.updateTask.id);
      await handleAttachments(data.updateTask.id); // Pass the updated task's ID to handleAttachments
      Alert.alert("Task Updated", "Your task has been updated successfully.");
      navigation.goBack();
    },
    onError: (error) => {
      console.error("Update task error:", error);
      Alert.alert("Error", `Failed to update task: ${error.message}`);
    },
  });

  // Mutation hook to create an attachment
  const [createAttachment] = useMutation(CREATE_ATTACHMENT);

  // Handle image picking
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAttachments([...attachments, result.uri]);
    }
  };

  // Handle taking a picture using the camera
  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAttachments([...attachments, result.uri]);
    }
  };

  // Handle removing an attachment
  const removeAttachment = (uri) => {
    setAttachments(attachments.filter((attachment) => attachment !== uri));
  };

  // Handle form submission (saving task)

  const handleSubmit = () => {
    if (!title) {
      Alert.alert("Error", "Title is mandatory");
      return;
    }
  
    if (date < new Date()) {
      Alert.alert("Error", "Date cannot be in the past");
      return;
    }
  
    // Get the user details from the reactive variable
    const user = userVar();
    if (!user || !user.sub) {
      Alert.alert("Error", "User not authenticated");
      return;
    }
    const userId = user.sub; // This should be the user's ID (e.g., from Cognito)
  
    // Format the date using moment for AWSDate type
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const formattedStartTime = moment(startTime).toISOString();
    const formattedEndTime = moment(endTime).toISOString();
  
    const taskInput = {
      title,
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      location,
      latitude,
      longitude,
      type: isPersonal ? 'PERSONAL' : 'PROFESSIONAL',
      notes,
      userId, // Add the userId from userVar
    };
  
    console.log("Task input:", taskInput);
  
    if (currentTask) {
      updateTask({ variables: { input: { ...taskInput, id: currentTask.id } } });
    } else {
      createTask({ variables: { input: taskInput } });
    }
  };

  // Handle attaching images to the task after it's created/updated
  const handleAttachments = async (taskId) => {
    if (!taskId) {
      console.error("Task ID is null, cannot create attachments.");
      return;
    }

    console.log("Handling attachments for task:", taskId);

    for (let attachment of attachments) {
      if (attachment) {
        try {
          await createAttachment({
            variables: {
              input: {
                taskId, // Pass the task ID to link the attachment
                filePath: attachment,
                fileType: "image",
              },
            },
          });
          console.log("Attachment created:", attachment);
        } catch (error) {
          console.error("Failed to create attachment:", error);
        }
      }
    }
  };

  // Handle setting location and coordinates from Google Places
  const handleLocationSelect = (formattedAddress, details) => {
    setLocation(formattedAddress);
    if (details?.geometry) {
      setLatitude(details.geometry.location.lat);
      setLongitude(details.geometry.location.lng);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100} // Adjust based on your UI
    >
      <FlatList
        data={[{ key: 'form' }]}
        renderItem={() => (
          <>
            <Text style={styles.label}>Title (Mandatory)</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
            />

            <Text style={styles.label}>Date (Mandatory)</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
              <Text>{moment(date).format('YYYY-MM-DD')}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                minimumDate={new Date()}
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}

            <Text style={styles.label}>Start Time (Mandatory)</Text>
            <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.datePicker}>
              <Text>{startTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {showStartTimePicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowStartTimePicker(false);
                  if (selectedTime) setStartTime(selectedTime);
                }}
              />
            )}

            <Text style={styles.label}>End Time (Mandatory)</Text>
            <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.datePicker}>
              <Text>{endTime.toLocaleTimeString()}</Text>
            </TouchableOpacity>
            {showEndTimePicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowEndTimePicker(false);
                  if (selectedTime) setEndTime(selectedTime);
                }}
              />
            )}

            <Text style={styles.label}>Personal/Professional</Text>
            <View style={styles.switchContainer}>
              <Text>{isPersonal ? 'Personal' : 'Professional'}</Text>
              <Switch
                value={isPersonal}
                onValueChange={(value) => setIsPersonal(value)}
              />
            </View>

            <Text style={styles.label}>Location (Optional)</Text>
            <View style={styles.placesInputWrapper}>
              <PlacesInput
                placeholder="Search for a location"
                onLocationSelect={(location) => handleLocationSelect(location)}
              />
            </View>

            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Enter additional notes"
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Attachments</Text>
            <View style={styles.attachmentsContainer}>
              <Button title="Pick Image" onPress={pickImage} />
              <Button title="Take Picture" onPress={takePicture} />
              <FlatList
                horizontal
                data={attachments}
                renderItem={({ item, index }) => (
                  <View key={index} style={styles.attachmentWrapper}>
                    <Image source={{ uri: item }} style={styles.attachmentImage} />
                    <TouchableHighlight
                      style={styles.removeButton}
                      onPress={() => removeAttachment(item)}
                    >
                      <Text style={styles.removeButtonText}>X</Text>
                    </TouchableHighlight>
                  </View>
                )}
                keyExtractor={(item, index) => `${item}-${index}`}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button title="Save Task" onPress={handleSubmit} />
            </View>
          </>
        )}
        keyExtractor={(item) => item.key}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  placesInputWrapper: {
    height: 200, // Set a fixed height for PlacesInput
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
  },
  datePicker: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  attachmentsContainer: {
    marginBottom: 20,
  },
  attachmentWrapper: {
    position: 'relative',
  },
  attachmentImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 50,
    padding: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40, // Add margin for the button to always be visible
  },
});

export default EditTaskForm;