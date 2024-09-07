import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import CircularProgressBar from '../CircularProgressBar';

const TimerCard = ({ currentTask, isTimerActive, startTimerTime, handleTimerPress }) => {
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

      <CircularProgressBar
        progress={isTimerActive ? (moment().diff(startTimerTime, 'minutes') / totalMinutes) * 100 : 0}
        onPress={() => handleTimerPress(!isTimerActive)}
      />
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
});

export default TimerCard;