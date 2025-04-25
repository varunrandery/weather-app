import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useFonts, Geist_400Regular, Geist_600SemiBold } from '@expo-google-fonts/geist';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import our screens
import HomeScreen from './src/screens/HomeScreen';
import PlacesScreen from './src/screens/PlacesScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Create the tab navigator
const Tab = createBottomTabNavigator();

export default function App() {
  // Load Geist font
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_600SemiBold,
  });

  // Loading screen while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0070f3" />
      </View>
    );
  }

  return (
      <NavigationContainer>
        <StatusBar style="dark" />
        
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#0070f3',
            tabBarInactiveTintColor: '#666',
            tabBarLabelStyle: {
              fontFamily: 'Geist_400Regular',
              fontSize: 12,
            },
            headerShown: false,
            tabBarStyle: {
              height: 85,
              paddingBottom: 30,
              paddingTop: 8,
              backgroundColor: 'white',
              borderTopWidth: 0,
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.05,
              shadowRadius: 6,
            }
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              tabBarLabel: 'Weather',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="partly-sunny" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Places" 
            component={PlacesScreen}
            options={{
              tabBarLabel: 'Places',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="search" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              tabBarLabel: 'Settings',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings-outline" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
