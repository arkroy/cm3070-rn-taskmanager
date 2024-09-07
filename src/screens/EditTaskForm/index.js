import React, { useState } from 'react';
import { KeyboardAvoidingView, FlatList, StyleSheet, Button, Alert, Platform } from 'react-native';
import { useReactiveVar, useMutation } from '@apollo/client';
import { currentTaskVar, userVar } from '../../utils/apolloState';
import { CREATE_TASK, UPDATE_TASK, CREATE_ATTACHMENT } from '../../utils/schemas';
import TaskFormFields from '../../components/TaskFormFields';
import AttachmentsSection from '../../components/Attachements';
import VoiceInput from '../../components/VoiceInput';
import PlacesInput from '../../components/PlacesInput'; // Import PlacesInput
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { Audio } from 'expo-av'; // Import Audio from expo-av for voice input
import { fileToBase64 } from '../../utils/audioUtils';
import moment from 'moment';

const EditTaskForm = ({ navigation }) => {
  const currentTask = useReactiveVar(currentTaskVar);
  const isCompletedTask = currentTask?.status === 'COMPLETE';

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
  const [recording, setRecording] = useState(null);
  const [playbackUri, setPlaybackUri] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Mutations
  const [createTask] = useMutation(CREATE_TASK);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [createAttachment] = useMutation(CREATE_ATTACHMENT);

  // Image handling functions
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

  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAttachments([...attachments, result.uri]);
    }
  };

  const removeAttachment = (uri) => {
    setAttachments(attachments.filter((attachment) => attachment !== uri));
  };

  // Handle location selection
  const handleLocationSelect = (locationData) => {
    console.log('Location selected:', locationData);
    setLocation(locationData.address || ''); // Ensure it's never undefined
    setLatitude(locationData.latitude || 0); // Provide default values
    setLongitude(locationData.longitude || 0); // Provide default values
  };

  // Voice recording functions

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission to access microphone was denied.');
        return;
      }

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const status = await recording.getStatusAsync();
      setPlaybackUri(uri);
      console.log('Recording saved at:', uri);
      console.log('Recording duration (ms):', status.durationMillis);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const playRecording = async () => {
    if (!playbackUri) {
      Alert.alert('No recording to play');
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: playbackUri },
        { shouldPlay: true }
      );
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play recording:', error);
    }
  };

  const handleSubmit = async () => {
    if (!title) {
      Alert.alert("Error", "Title is mandatory");
      return;
    }

    // Ensure location is not undefined or null
    if (!location) {
      Alert.alert("Error", "Please select a location");
      return;
    }

    const today = moment().startOf('day');
    const selectedDate = moment(date).startOf('day');

    if (selectedDate.isBefore(today)) {
      Alert.alert("Error", "Date cannot be in the past. Please select today or a future date.");
      return;
    }

    const user = userVar();
    if (!user || !user.sub) {
      Alert.alert("Error", "User not authenticated");
      return;
    }
    const userId = user.sub;

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
      status: 'INCOMPLETE',
      userId,
    };

    console.log("Task input:", taskInput);

    try {
      if (currentTask) {
        await updateTask({
          variables: {
            input: { ...taskInput, id: currentTask.id },
          },
        });
        Alert.alert("Success", "Task updated successfully.");
      } else {
        const { data } = await createTask({
          variables: {
            input: taskInput,
          },
        });
        const taskId = data?.createTask?.id;

        await handleAttachments(taskId);

        Alert.alert("Success", "Task created successfully.");
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error saving task:", error);
      Alert.alert("Error", `Failed to save task: ${error.message}`);
    }
  };

  const handleAttachments = async (taskId) => {
    if (!taskId) {
      console.error("Task ID is null, cannot create attachments.");
      return;
    }

    for (let attachment of attachments) {
      if (attachment) {
        try {
          await createAttachment({
            variables: {
              input: {
                taskId,
                filePath: attachment,
                fileType: "image",
              },
            },
          });
        } catch (error) {
          console.error("Failed to create attachment:", error);
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <FlatList
        data={[{ key: 'form' }]}
        renderItem={() => (
          <>
            <TaskFormFields
              title={title} setTitle={setTitle}
              date={date} setDate={setDate}
              startTime={startTime} setStartTime={setStartTime}
              endTime={endTime} setEndTime={setEndTime}
              isPersonal={isPersonal} setIsPersonal={setIsPersonal}
              showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker}
              showStartTimePicker={showStartTimePicker} setShowStartTimePicker={setShowStartTimePicker}
              showEndTimePicker={showEndTimePicker} setShowEndTimePicker={setShowEndTimePicker}
            />

            <PlacesInput
              placeholder="Enter location"
              onLocationSelect={({ address, latitude, longitude }) =>
                handleLocationSelect({ address, latitude, longitude })
              }
            />

            <AttachmentsSection
              attachments={attachments}
              pickImage={pickImage}
              takePicture={takePicture}
              removeAttachment={removeAttachment}
            />

            <VoiceInput
              recording={recording}
              startRecording={startRecording}
              stopRecording={stopRecording}
              playRecording={playRecording}
              playbackUri={playbackUri}
            />

            <Button title="Save Task" onPress={handleSubmit} />
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
});

export default EditTaskForm;