import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ScrollView } from 'react-native';
import SearchBar from '../components/SearchBar';
import RecentlyViewed from '../components/RecentlyViewed';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getRecentLocations, addRecentLocation } from '../services/storageUtils';

const PlacesScreen = () => {
  const navigation = useNavigation();
  const [isSearching, setIsSearching] = useState(false);
  const [recentLocations, setRecentLocations] = useState([]);

  // Load recent locations on component mount and listen for clear event
  useEffect(() => {
    loadRecentLocations();
    
    // Set up listener for when recent locations are cleared from Settings
    global.recentLocationsClearedCallback = () => {
      setRecentLocations([]);
    };
    
    // Clean up listener on unmount
    return () => {
      global.recentLocationsClearedCallback = null;
    };
  }, []);

  const loadRecentLocations = async () => {
    const locations = await getRecentLocations();
    setRecentLocations(locations);
  };

  const handleSelectLocation = async (lat, lon, locationData) => {
    // Store the location data for future reference
    if (locationData) {
      await addRecentLocation(locationData);
      // Refresh the list of recent locations
      loadRecentLocations();
    }
    
    // IMPORTANT: First call the callback BEFORE navigation
    // This ensures the data is updated before the screen changes
    if (global.locationSelectedCallback) {
      // Pass the full location object to ensure units don't reset
      await global.locationSelectedCallback(lat, lon, locationData);
    }
    
    // Only navigate after the callback completes
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Places</Text>
          <Text style={styles.headerSubtitle}>Find weather for any city</Text>
        </View>
        
        <View style={styles.searchSection}>
          <SearchBar 
            onSelectLocation={(lat, lon, locationData) => handleSelectLocation(lat, lon, locationData)}
            onSearchStart={() => setIsSearching(true)} 
          />
        </View>
        
        {/* Show empty state only if no recent locations and not searching */}
        {recentLocations.length === 0 && !isSearching && (
          <View style={styles.emptyStateContainer}>
            <View style={styles.illustrationContainer}>
              <Ionicons name="search" size={60} color="#ccd9ff" />
            </View>
            <Text style={styles.emptyStateText}>Search for a city to get weather information</Text>
          </View>
        )}
        
        {/* Fixed Recently Viewed component at bottom of screen */}
        {recentLocations.length > 0 && (
          <View style={styles.recentlyViewedContainer}>
            <RecentlyViewed 
              locations={recentLocations} 
              onSelectLocation={(lat, lon, locationData) => handleSelectLocation(lat, lon, locationData)} 
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f5ff',
  },
  scrollContent: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  searchSection: {
    marginHorizontal: 0,
    zIndex: 10, // Ensure it sits above RecentlyViewed
    position: 'relative',
  },
  recentlyViewedContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 0,
    zIndex: 5, // Lower zIndex to allow search results to overlap
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 32,
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: 'Geist_400Regular',
    fontSize: 16,
    color: '#666',
  },
  emptyStateContainer: {
    height: 200, // Reduced height to make room for Recently Viewed at bottom
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 30,
  },
  illustrationContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e7f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
});

export default PlacesScreen;