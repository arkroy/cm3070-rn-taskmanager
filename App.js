import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { fetchAuthSession } from '@aws-amplify/auth';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/Login';
import RegistrationScreen from './src/screens/Registration';
import ForgotPasswordScreen from './src/screens/ForgotPassword';
import DashboardScreen from './src/screens/Dashboard';
import VerificationScreen from './src/screens/Verification';
import AppHeader from './src/components/AppHeader'; // Import the custom header

const Stack = createStackNavigator();
Amplify.configure(awsconfig);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      const { accessToken } = (await fetchAuthSession()).tokens ?? {};
      if (accessToken) {
        setIsAuthenticated(true);
        console.log('User is signed in:', accessToken);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('No user is signed in:', error);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
    console.log('CHECKED STATUS');
  }, [checkAuthStatus]);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                header: () => <AppHeader screen="Dashboard" />, // Use custom header
              }}
            />
            
            {/* <Stack.Screen
              name="Schedule"
              component={ScheduleScreen}
              options={{
                header: () => <AppHeader screen="Schedule" />,
              }}
            />
            <Stack.Screen
              name="Insights"
              component={InsightsScreen}
              options={{
                header: () => <AppHeader screen="Insights" />,
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                header: () => <AppHeader screen="Settings" />,
              }}
            />
            <Stack.Screen
              name="TaskDetails"
              component={TaskDetailsScreen}
              options={{
                header: () => <AppHeader screen="TaskDetails" />,
              }}
            /> */}
          </>
        ) : (
          <>
             <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen {...props} onLoginSuccess={checkAuthStatus}  options={{ headerShown: false }}/>
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Registration"
              component={RegistrationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Verification"
              component={VerificationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}