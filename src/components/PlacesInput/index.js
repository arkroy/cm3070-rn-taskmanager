// PlacesInput.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

function PlacesInput({ placeholder, onLocationSelect }) {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        minLength={2}
        fetchDetails={true}
        onPress={(data, details = null) => {
          // Extract location details here
          if (details) {
            const location = details.formatted_address;
            onLocationSelect(location);
          }
        }}
        query={{
          key: 'AIzaSyBARAPcaDbFUDfLo4WrfTfiXJzMxaExI0A',
          language: 'en',
        }}
        styles={{
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  textInputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  textInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default PlacesInput;