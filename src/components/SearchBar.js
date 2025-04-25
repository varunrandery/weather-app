import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, FlatList, ActivityIndicator } from 'react-native';
import { searchCities } from '../services/weatherApi';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ onSelectLocation, onSearchStart }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef(null);

  // Throttled search function that triggers as user types
  useEffect(() => {
    if (query.trim().length >= 2) {
      // Notify parent component that search has started
      if (onSearchStart) {
        onSearchStart();
      }
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set a new timeout for throttling (400ms)
      timeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, 400);
    } else {
      setResults([]);
    }
    
    // Cleanup timeout on component unmount or when query changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const performSearch = async (searchQuery) => {
    setIsSearching(true);
    try {
      const data = await searchCities(searchQuery);
      // Show only 3 results
      setResults(data.slice(0, 3));
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (item) => {
    // Create a location object with necessary info for recent locations
    const locationData = {
      name: item.name,
      lat: item.lat,
      lon: item.lon,
      country: item.country,
      state: item.state || null
    };
    
    // Pass lat, lon, and the location data object for storage
    onSelectLocation(item.lat, item.lon, locationData);
    setQuery('');
    setResults([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search city..."
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {isSearching && (
          <ActivityIndicator 
            size="small" 
            color="#0070f3" 
            style={styles.searchingIndicator} 
          />
        )}
      </View>
      
      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `location-${index}-${item.lat.toFixed(6)}-${item.lon.toFixed(6)}`}
          style={styles.resultsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.resultText}>
                {item.name}{item.state ? `, ${item.state}` : ''}, {item.country}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 0,
    paddingHorizontal: 10,
    paddingRight: 50,
    fontSize: 16,
    backgroundColor: 'transparent',
    fontFamily: 'Geist_400Regular',
  },
  searchIcon: {
    marginLeft: 16,
  },
  searchingIndicator: {
    position: 'absolute',
    right: 16,
  },
  resultsList: {
    marginTop: 8,
    maxHeight: 162, // Height set for 3 items (approx 54px per item)
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    zIndex: 10, // Ensure it appears above other components
    position: 'relative', // Required for z-index to work
  },
  resultItem: {
    padding: 12,
    paddingLeft: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    fontFamily: 'Geist_400Regular',
    color: '#333',
    marginLeft: 4,
  },
});

export default SearchBar;