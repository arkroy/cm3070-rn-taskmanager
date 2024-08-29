import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { signOut } from '@aws-amplify/auth';

function DashboardScreen({ navigation }) {
  

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>This is the dashboard Page</Text>
      <Button mode="contained" onPress={signOut} >
        <Text variant="bodyMedium">Log Out</Text>
      </Button>
    </View>
  )
}

export default DashboardScreen;