import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, View, Platform, Alert } from 'react-native';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { fetchAuthSession } from '@aws-amplify/auth';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { isAuthenticatedVar, userVar } from './src/utils/apolloState';
import client from './src/utils/ApolloClient';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppHeader from './src/components/AppHeader';
import LoginScreen from './src/screens/Login';
import RegistrationScreen from './src/screens/Registration';
import ForgotPasswordScreen from './src/screens/ForgotPassword';
import DashboardScreen from './src/screens/Dashboard';
import VerificationScreen from './src/screens/Verification';
import TaskDetailsScreen from './src/screens/TaskDetails';
import EditTaskForm from './src/screens/EditTaskForm';
import SettingsScreen from './src/screens/Settings';
import InsightsPage from './src/screens/Insights';

Amplify.configure(awsconfig);

const Stack = createStackNavigator();

export default function App() {
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  // Check user authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
        if (accessToken) {
          isAuthenticatedVar(true);
          userVar(idToken.payload);
        } else {
          isAuthenticatedVar(false);
          userVar(null);
        }
      } catch (error) {
        isAuthenticatedVar(false);
        userVar(null);
      }
    };

    checkAuthStatus();
  }, []);

  // Register for push notifications
  useEffect(() => {
    async function register() {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
      } else {
      }
    }
    register();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

   // Push notification registration function
   async function registerForPushNotificationsAsync() {
    let token;
    try {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          Alert.alert('Failed to get push token for push notification!');
          return;
        }
    
        // Get the Expo push token
        token = (await Notifications.getExpoPushTokenAsync()).data;
      }
  
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
  
      return token;
    } catch (error) {
      console.error('Error while registering for push notifications:', error);
      return null;
    }
  }

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator>
          {isAuthenticated ? (
            <>
              <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                  header: () => <AppHeader screen="Dashboard" />,
                }}
              />
              <Stack.Screen
                name="TaskDetails"
                component={TaskDetailsScreen}
                options={{
                  header: () => <AppHeader screen="TaskDetails" />,
                }}
              />
              <Stack.Screen
                name="EditTaskForm"
                component={EditTaskForm}
                options={{
                  header: () => <AppHeader screen="EditTaskForm" />,
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
                name="Insights"
                component={InsightsPage}
                options={{
                  header: () => <AppHeader screen="Insights" />,
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
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
    </ApolloProvider>
  );
}