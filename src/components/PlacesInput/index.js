import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from '../../../apikeys';

function PlacesInput({ placeholder, onLocationSelect }) {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        minLength={2}
        fetchDetails={true}
        onPress={(data, details = null) => {
          if (details) {
            const location = {
              address: details.formatted_address,
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            };
            onLocationSelect(location);
          }
        }}
        query={{
          key: 'GOOGLE_API_KEY',
          language: 'en',
        }}
        styles={{
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
        }}
        enablePoweredByContainer={false} // Remove the "Powered by Google" logo for a cleaner UI
        keyboardShouldPersistTaps="always" // Ensure that taps on the suggestions work
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