import React from 'react';
import { View, FlatList, Button, Image, StyleSheet, TouchableHighlight, Text } from 'react-native';

const AttachmentsSection = ({ attachments, pickImage, takePicture, removeAttachment }) => (
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
);

const styles = StyleSheet.create({
  attachmentsContainer: { marginBottom: 20 },
  attachmentWrapper: { position: 'relative' },
  attachmentImage: { width: 100, height: 100, marginRight: 10, borderRadius: 8 },
  removeButton: { position: 'absolute', top: 5, right: 5, backgroundColor: 'red', borderRadius: 50, padding: 5 },
  removeButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default AttachmentsSection;