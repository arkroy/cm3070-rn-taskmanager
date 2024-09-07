import React, { useState } from 'react';
import { KeyboardAvoidingView, FlatList, StyleSheet, Button, Alert, Platform } from 'react-native';
import { useReactiveVar, useMutation } from '@apollo/client';
import { currentTaskVar, userVar } from '../../utils/apolloState';
import { CREATE_TASK, UPDATE_TASK, CREATE_ATTACHMENT } from '../../utils/gqlMutations';
import TaskFormFields from '../../components/TaskFormFields';
import AttachmentsSection from '../../components/Attachements';
import VoiceInput from '../../components/VoiceInput';
import { Audio } from 'expo-av';
import { fileToBase64 } from '../../utils/audioUtils';
import moment from 'moment';

const EditTaskForm = ({ navigation }) => {
  const currentTask = useReactiveVar(currentTaskVar);

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

  // Image handling functions (same as original)
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
  // Remove Attachments
  const removeAttachment = (uri) => {
    setAttachments(attachments.filter((attachment) => attachment !== uri));
  };

  

  // Voice recording functions (same as original)

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission to access microphone was denied.');
        return;
      }
  
      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync(); // Stop and unload the recording
      const uri = recording.getURI(); // Get the URI of the audio file
      const status = await recording.getStatusAsync(); // Get recording status (duration)
      setPlaybackUri(uri); // Set the URI for playback
  
      console.log('Recording saved at:', uri);
      console.log('Recording duration (ms):', status.durationMillis);
  
      if (status.durationMillis < 2000) {
        Alert.alert('Recording too short', 'Please record for at least 2 seconds.');
        return;
      }
  
      await processAudioForTranscription(uri); // Process the audio file for transcription
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const playRecording = async () => {
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

  const processAudioForTranscription = async (uri) => {
    try {
      const base64Audio = await fileToBase64(uri); // Convert the audio file to base64
      if (!base64Audio) {
        console.error('Error: Base64 audio is null');
        Alert.alert('Error', 'Failed to convert audio to base64.');
        return;
      }
  
      const googleResponse = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=YOUR_GOOGLE_CLOUD_API_KEY`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            config: {
              encoding: 'LINEAR16',
              sampleRateHertz: 16000,
              languageCode: 'en-US',
            },
            audio: {
              content: base64Audio,
            },
          }),
        }
      );
  
      const result = await googleResponse.json();
      console.log('Google Cloud Speech API Response:', result);
  
      if (result.results && result.results[0]) {
        const alternatives = result.results[0].alternatives;
        if (alternatives && alternatives[0].transcript) {
          const transcript = alternatives[0].transcript;
          console.log('Transcript:', transcript);
          setNotes((prevNotes) => `${prevNotes} ${transcript}`); // Append the transcript to the notes field
        } else {
          Alert.alert('Transcription failed', 'No transcript found in the response.');
        }
      } else {
        Alert.alert('Transcription failed', 'Could not recognize the audio.');
      }
    } catch (error) {
      console.error('Failed to transcribe audio:', error);
      Alert.alert('Error', 'Failed to transcribe the audio.');
    }
  };

  // Form submission logic (same as original)
  const handleSubmit = async () => {
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
    const userId = user.sub;
  
    // Format the date using moment for AWSDate type
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const formattedStartTime = moment(startTime).toISOString();
    const formattedEndTime = moment(endTime).toISOString();
  
    // Task input with status set to INCOMPLETE by default
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
      status: 'INCOMPLETE', // New task is always INCOMPLETE
      userId, // Add user ID from userVar
    };
  
    console.log("Task input:", taskInput);
  
    try {
      if (currentTask) {
        // Update existing task
        await updateTask({
          variables: {
            input: { ...taskInput, id: currentTask.id },
          },
        });
        Alert.alert("Success", "Task updated successfully.");
      } else {
        // Create new task
        const { data } = await createTask({
          variables: {
            input: taskInput,
          },
        });
        const taskId = data?.createTask?.id;
  
        // Handle attachments after task creation
        await handleAttachments(taskId);
  
        Alert.alert("Success", "Task created successfully.");
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error saving task:", error);
      Alert.alert("Error", `Failed to save task: ${error.message}`);
    }
  };

// Handle attaching images to the task after it's created/updated
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
              taskId, // Link the attachment to the task
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