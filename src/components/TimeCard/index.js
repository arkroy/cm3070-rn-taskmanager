import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';

const TimerCard = ({ currentTask, isTimerActive, startTimerTime, handleTimerPress }) => {
  const [progress, setProgress] = useState(0); // State for progress animation

  useEffect(() => {
    let interval = null;

    if (isTimerActive && startTimerTime) {
      interval = setInterval(() => {
        const elapsedMinutes = moment().diff(startTimerTime, 'minutes');
        const totalMinutes = moment(currentTask.endTime).diff(currentTask.startTime, 'minutes');
        const progressValue = (elapsedMinutes / totalMinutes) * 100;
        setProgress(Math.min(progressValue, 100)); // Ensure progress is capped at 100%
      }, 1000);
    } else {
      setProgress(0);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, startTimerTime, currentTask]);

  const buttonText = isTimerActive ? 'Stop' : 'Start';
  const buttonColor = isTimerActive ? '#f44336' : '#4CAF50'; // Red for stop, green for start

  if (!currentTask) return null;

  const startTime = new Date(currentTask.startTime);
  const endTime = new Date(currentTask.endTime);
  const totalMinutes = moment(endTime).diff(startTime, 'minutes');

  return (
    <View style={styles.timerCard}>
      <Text style={styles.title}>{currentTask.title}</Text>
      <Text style={styles.time}>
        {moment(currentTask.startTime).format('h:mm A')} - {moment(currentTask.endTime).format('h:mm A')}
      </Text>
      <Text style={styles.location}>Location: {currentTask.location}</Text>
      <Text style={styles.cost}>Cost: ${currentTask.cost}</Text>

      <TouchableOpacity
        onPress={() => handleTimerPress(!isTimerActive)} // Start/Stop the timer
        style={[styles.button, { backgroundColor: buttonColor }]}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  timerCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 16,
    color: '#666',
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  cost: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    marginTop: 15,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TimerCard;