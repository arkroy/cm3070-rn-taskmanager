import React from 'react';
import { Button, View, StyleSheet } from 'react-native';

const VoiceInput = ({ recording, startRecording, stopRecording, playRecording, playbackUri }) => (
  <View style={styles.voiceInputContainer}>
    <Button
      title={recording ? 'Stop Recording' : 'Start Voice Input'}
      onPress={recording ? stopRecording : startRecording}
    />
    {playbackUri && <Button title="Play Recording" onPress={playRecording} />}
  </View>
);

const styles = StyleSheet.create({
  voiceInputContainer: { marginBottom: 20 },
});

export default VoiceInput;