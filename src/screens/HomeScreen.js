import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import { getWeatherByCoords, getForecastByCoords } from '../services/weatherApi';
import { getWeatherBackgroundColors } from '../utils/weatherUtils';
import { addRecentLocation, saveCurrentLocation, getCurrentLocation } from '../services/storageUtils';

const HomeScreen = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({
    lat: 37.7749,
    lon: -122.4194,
    name: 'San Francisco',
    country: 'US'
  });
  
  // Use location reference to always have latest value in callbacks
  const locationRef = useRef(currentLocation);
  
  // Keep location reference updated
  useEffect(() => {
    locationRef.current = currentLocation;
  }, [currentLocation]);

  // Setup global callback for location changes - could be moved to a LocationContext in the future
  useEffect(() => {
    global.locationSelectedCallback = async (lat, lon, locationData = null) => {
      // Create a location object with the provided data or basic coordinates
      const location = locationData || { 
        lat, 
        lon,
        name: locationRef.current.name || 'Unknown location', 
        country: locationRef.current.country || ''
      };
      
      // Update our state
      setCurrentLocation(location);
      
      // Save location to AsyncStorage
      await saveCurrentLocation(location);
      
      // Fetch weather with the current units
      fetchWeather(lat, lon);
    };
    
    // Load initial location
    loadInitialLocation();
    
    // Cleanup listeners
    return () => {
      global.locationSelectedCallback = null;
      global.recentLocationsClearedCallback = null;
    };
  }, []);

  // Load the last viewed location on startup
  const loadInitialLocation = async () => {
    try {
      const savedLocation = await getCurrentLocation();
      if (savedLocation) {
        setCurrentLocation(savedLocation);
        fetchWeather(savedLocation.lat, savedLocation.lon);
      } else {
        // Use default San Francisco if no saved location
        fetchWeather(currentLocation.lat, currentLocation.lon);
      }
    } catch (error) {
      console.error('Error loading initial location:', error);
      fetchWeather(currentLocation.lat, currentLocation.lon);
    }
  };

  // Fetch weather data from API
  const fetchWeather = async (lat, lon) => {
    if (!lat || !lon) {
      setError('Invalid location coordinates');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch both current weather and forecast data in parallel
      const [weatherResponse, forecastResponse] = await Promise.all([
        getWeatherByCoords(lat, lon),
        getForecastByCoords(lat, lon)
      ]);
      
      // Set the weather data in state
      setWeatherData(weatherResponse);
      setForecastData(forecastResponse);
      
      // Create location data object
      if (weatherResponse && weatherResponse.name) {
        const locationData = {
          name: weatherResponse.name,
          lat: lat,
          lon: lon,
          country: weatherResponse.sys?.country || '',
          state: null // OpenWeatherMap current weather doesn't provide state info
        };
        
        // Add to recently viewed locations
        await addRecentLocation(locationData);
        
        // Update our current location state
        setCurrentLocation(locationData);
        
        // Save to AsyncStorage
        await saveCurrentLocation(locationData);
      }
    } catch (err) {
      setError('Failed to load weather data. Please try again.');
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get background colors based on weather condition
  const { primary, secondary } = weatherData 
    ? getWeatherBackgroundColors(weatherData) 
    : { primary: '#f0f5ff', secondary: '#e7efff' };

  return (
    <LinearGradient
      colors={[primary, secondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0070f3" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <WeatherCard weather={weatherData} />
            <ForecastCard forecast={forecastData} />
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 10,
    paddingBottom: 30, // Extra padding at bottom for better scrolling
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    margin: 20,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Semi-transparent background
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backdropFilter: 'blur(8px)', // This won't work on all devices but adds a nice effect where supported
  },
  errorText: {
    color: '#e74c3c',
    fontFamily: 'Geist_400Regular',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;