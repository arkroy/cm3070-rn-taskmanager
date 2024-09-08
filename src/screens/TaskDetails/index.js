import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { useReactiveVar, useMutation, gql } from '@apollo/client';
import * as Location from 'expo-location';
import { currentTaskVar } from '../../utils/apolloState';
import MapView, { Marker } from 'react-native-maps';
import haversine from 'haversine-distance';
import { UPDATE_TASK } from '../../utils/schemas';

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
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  // Fetch device's current location (only for Android)
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

  // Calculate the distance when both current location and task location are available (only for Android)
  useEffect(() => {
    if (Platform.OS === 'android' && currentLocation && task?.latitude && task?.longitude) {
      const start = { latitude: currentLocation.latitude, longitude: currentLocation.longitude };
      const end = { latitude: task.latitude, longitude: task.longitude };

      const distanceInMeters = haversine(start, end);
      const distanceInKm = (distanceInMeters / 1000).toFixed(2);
      setDistance(distanceInKm);
    }
  }, [currentLocation, task]);

  // Define the mutation for deleting a task
  const [deleteTaskMutation] = useMutation(DELETE_TASK, {
    onCompleted: () => {
      Alert.alert("Task deleted", "The task was successfully deleted.", [
        { text: "OK", onPress: () => navigation.navigate('Dashboard') }
      ]);
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
      Alert.alert("Error", `Failed to delete task: ${error.message}`);
    }
  });

  const [updateTask] = useMutation(UPDATE_TASK);

  const handleDelete = () => {
    if (task && task.id) {
      deleteTaskMutation({
        variables: {
          input: {
            id: task.id
          }
        }
      });
    } else {
      Alert.alert("Error", "Task ID is not defined.");
    }
  };

  const handleStartTask = async () => {
    try {
      // Update the task's status to INPROGRESS
      await updateTask({
        variables: {
          input: {
            id: task.id,
            status: 'INPROGRESS',
          },
        },
      });

      // Set the current task in the reactive variable
      currentTaskVar(task);

      // Navigate back to the Dashboard and start the timer
      navigation.navigate('Dashboard', { startTimerForTask: task });
    } catch (error) {
      console.error('Error starting task:', error);
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

      {/* Add the Start Task button */}
      <TouchableOpacity style={styles.startButton} onPress={handleStartTask}>
        <Text style={styles.startButtonText}>Start Task</Text>
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
});

export default TaskDetailsScreen;