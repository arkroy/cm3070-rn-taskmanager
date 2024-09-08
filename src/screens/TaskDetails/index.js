import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert, Linking, Platform, Modal, ScrollView } from 'react-native';
import { useReactiveVar, useMutation, gql } from '@apollo/client';
import * as Location from 'expo-location';
import { currentTaskVar } from '../../utils/apolloState';
import MapView, { Marker } from 'react-native-maps';
import haversine from 'haversine-distance';
import { Audio } from 'expo-av';  // Import Audio for playback
import { UPDATE_TASK } from '../../utils/schemas';

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
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [fullImageModalVisible, setFullImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [sound, setSound] = useState(null);  // State for handling sound playback

  useEffect(() => {
    const fetchLocation = async () => {
      if (Platform.OS === 'android') {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setLocationPermissionGranted(false);
            return;
          }
          setLocationPermissionGranted(true);
          const location = await Location.getCurrentPositionAsync({});
          setCurrentLocation(location.coords);
        } catch (error) {
          setLocationPermissionGranted(false);
        }
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android' && currentLocation && task?.latitude && task?.longitude) {
      const start = { latitude: currentLocation.latitude, longitude: currentLocation.longitude };
      const end = { latitude: task.latitude, longitude: task.longitude };

      const distanceInMeters = haversine(start, end);
      const distanceInKm = (distanceInMeters / 1000).toFixed(2);
      setDistance(distanceInKm);
    }
  }, [currentLocation, task]);

  const [deleteTaskMutation] = useMutation(DELETE_TASK, {
    onCompleted: () => {
      Alert.alert("Task deleted", "The task was successfully deleted.", [
        { text: "OK", onPress: () => navigation.navigate('Dashboard') }
      ]);
    },
    onError: (error) => {
      Alert.alert("Error", `Failed to delete task: ${error.message}`);
    }
  });

  const [updateTask] = useMutation(UPDATE_TASK);

  const handleDelete = () => {
    if (task && task.id) {
      deleteTaskMutation({
        variables: {
          input: { id: task.id }
        }
      });
    } else {
      Alert.alert("Error", "Task ID is not defined.");
    }
  };

  const handleStartTask = async () => {
    try {
      await updateTask({
        variables: {
          input: {
            id: task.id,
            status: 'INPROGRESS',
          },
        },
      });

      currentTaskVar(task);
      navigation.navigate('Dashboard', { startTimerForTask: task });
    } catch (error) {
      Alert.alert('Error', 'Failed to start the task.');
    }
  };

  const handleOpenMaps = () => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q='
    });
    const latLng = `${task.latitude},${task.longitude}`;
    const label = task.location;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url);
  };

  const openFullImage = (imageUri) => {
    setSelectedImage(imageUri);
    setFullImageModalVisible(true);
  };

  // Play the voice recording
  const playVoiceNote = async (voiceNoteUri) => {
    try {
      const { sound: playbackObject } = await Audio.Sound.createAsync({ uri: voiceNoteUri });
      setSound(playbackObject);
      await playbackObject.playAsync();
    } catch (error) {
      Alert.alert('Error', 'Failed to play the voice recording.');
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();  // Clean up sound when component unmounts
        }
      : undefined;
  }, [sound]);

  // Log the voice notes and attachments to debug
  console.log('TASK DETAILS Task object:', task);
  console.log('TASK DETAILS Task attachments:', task?.attachments?.items);
  console.log('TASK DETAILS Task voice notes:', task?.voiceNotes?.items);
  console.log('TASK DETAILS Task notes:', task?.notes);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text>No task selected.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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

        {task.latitude && task.longitude && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: task.latitude,
                longitude: task.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{ latitude: task.latitude, longitude: task.longitude }}
                title={task.location}
              />
            </MapView>
            <TouchableOpacity style={styles.mapLink} onPress={handleOpenMaps}>
              <Text style={styles.mapLinkText}>Open in Google Maps</Text>
            </TouchableOpacity>
          </View>
        )}

        {Platform.OS === 'android' && locationPermissionGranted && distance && (
          <Text style={styles.distance}>
            Distance from current location: {distance} km
          </Text>
        )}
      </View>

      {task.attachments?.items?.length > 0 && (
        <View style={styles.attachmentsSection}>
          <Text style={styles.attachmentsHeader}>Attachments</Text>
          <FlatList
            data={task.attachments.items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openFullImage(item.filePath)}>
                <Image
                  source={{ uri: item.filePath }}
                  style={styles.attachmentImage}
                />
              </TouchableOpacity>
            )}
            horizontal
          />
        </View>
      )}

      {/* Voice Note Section */}
      {task.voiceNotes?.items?.length > 0 && (
        <View style={styles.voiceNotesSection}>
          <Text style={styles.voiceNotesHeader}>Voice Notes</Text>
          <FlatList
            data={task.voiceNotes.items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.voiceNoteButton} onPress={() => playVoiceNote(item.fileUrl)}>
                <Text style={styles.voiceNoteText}>Play Voice Note</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Delete Task</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.startButton} onPress={handleStartTask}>
        <Text style={styles.startButtonText}>Start Task</Text>
      </TouchableOpacity>

      {/* Full Image Modal */}
      <Modal
        visible={fullImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFullImageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setFullImageModalVisible(false)} style={styles.closeModal}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 10,
  },
  taskDetails: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
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
  mapContainer: {
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
  },
  map: {
    flex: 1,
  },
  mapLink: {
    marginTop: 10,
    alignItems: 'center',
  },
  mapLinkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  distance: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
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
  voiceNotesSection: {
    marginTop: 20,
  },
  voiceNotesHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  voiceNoteButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  voiceNoteText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
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
  startButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
  closeModal: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default TaskDetailsScreen;