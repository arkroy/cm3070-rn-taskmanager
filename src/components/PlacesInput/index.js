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
        fetchDetails={true} // Important to get detailed location info
        onPress={(data, details = null) => {
          if (details) {
            const location = {
              address: details.formatted_address,
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            };
            console.log("Location selected:", location);
            onLocationSelect(location);
          } else {
            console.error('No details available for selected location');
          }
        }}
        query={{
          key: 'AIzaSyBARAPcaDbFUDfLo4WrfTfiXJzMxaExI0A', // Replace with your actual Google API key
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