import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { fetchAuthSession } from '@aws-amplify/auth';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { isAuthenticatedVar, userVar } from './src/utils/apolloState';
import client from './src/utils/ApolloClient';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/Login';
import RegistrationScreen from './src/screens/Registration';
import ForgotPasswordScreen from './src/screens/ForgotPassword';
import DashboardScreen from './src/screens/Dashboard';
import VerificationScreen from './src/screens/Verification';
import AppHeader from './src/components/AppHeader';
import TaskDetailsScreen from './src/screens/TaskDetails';
import EditTaskForm from './src/screens/EditTaskForm';

const Stack = createStackNavigator();
Amplify.configure(awsconfig);

export default function App() {
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
        if (accessToken) {
          isAuthenticatedVar(true); // Update reactive variable
          userVar(idToken.payload); // Store user details
        } else {
          isAuthenticatedVar(false);
          userVar(null); // Clear user details if not authenticated
        }
      } catch (error) {
        console.log('No user is signed in:', error);
        isAuthenticatedVar(false);
        userVar(null);
      }
    };

    checkAuthStatus();
  }, []);

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
              {/* Add other authenticated screens here */}
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