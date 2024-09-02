import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const CircularProgressBar = ({ startTime, endTime }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        const currentTime = new Date();
        const totalDuration = endTime - startTime;
        const elapsedTime = currentTime - startTime;
        setProgress((elapsedTime / totalDuration) * 100);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, startTime, endTime]);

  return (
    <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
      <AnimatedCircularProgress
        size={120}
        width={15}
        fill={progress}
        tintColor="#00e0ff"
        backgroundColor="#3d5875"
      >
        {() => (
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={40}
            color="white"
          />
        )}
      </AnimatedCircularProgress>
    </TouchableOpacity>
  );
};

export default CircularProgressBar;