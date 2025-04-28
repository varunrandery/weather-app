import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, SafeAreaView, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import SearchBar from '../components/SearchBar';
import RecentlyViewed from '../components/RecentlyViewed';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getRecentLocations, addRecentLocation } from '../services/storageUtils';

const PlacesScreen = () => {
  const navigation = useNavigation();
  const [isSearching, setIsSearching] = useState(false);
  const [recentLocations, setRecentLocations] = useState([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Load recent locations on component mount and listen for clear event
  useEffect(() => {
    loadRecentLocations();
    
    // Always set up listener for when recent locations are cleared from Settings
    // This ensures the callback is always pointing to the current instance
    global.recentLocationsClearedCallback = () => {
      setRecentLocations([]);
    };
    
    // Clean up listener on unmount
    return () => {
      global.recentLocationsClearedCallback = null;
    };
  }, []);
  
  // Reload recent locations when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadRecentLocations();
      return () => {};
    }, [])
  );
  
  // Set up keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    // Clean up listeners on unmount
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const loadRecentLocations = async () => {
    const locations = await getRecentLocations();
    setRecentLocations(locations || []);
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
      await global.locationSelectedCallback(lat, lon, locationData);
    }
    
    // Only navigate after the callback completes
    navigation.navigate('Home');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex: 1}}
    >
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
          
          {/* Recently Viewed component - positioned based on keyboard visibility */}
          {recentLocations.length > 0 && (
            <View style={[
              styles.recentlyViewedContainer, 
              keyboardVisible && styles.recentlyViewedContainerKeyboardOpen
            ]}>
              <RecentlyViewed 
                locations={recentLocations} 
                onSelectLocation={(lat, lon, locationData) => handleSelectLocation(lat, lon, locationData)} 
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    zIndex: 10,
    position: 'relative',
  },
  recentlyViewedContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 0,
    zIndex: 5,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 32,
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Geist_400Regular',
    fontSize: 16,
    color: '#666',
  },
});

export default PlacesScreen;