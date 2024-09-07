import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

const CircularProgressBar = ({ isTimerActive, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.progressContainer}>
      {/* Indeterminate Circular Progress */}
      <Progress.Circle
        size={120}
        thickness={5}
        indeterminate={isTimerActive} // Show indeterminate loader when active
        borderWidth={2}
        color={isTimerActive ? '#00e0ff' : '#FF0000'} // Color based on play/pause state
        borderColor="#3d5875"
      />
      
      {/* Center Play/Pause Button */}
      <View style={styles.iconWrapper}>
        <Ionicons
          name={isTimerActive ? 'pause' : 'play'} // Toggle play/pause icon
          size={40}
          color="white"
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // To position the button in the center
  },
  iconWrapper: {
    position: 'absolute', // Center the button on top of the progress circle
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CircularProgressBar;