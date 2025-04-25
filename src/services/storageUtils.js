import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const RECENT_LOCATIONS_KEY = 'recentLocations';
const CURRENT_LOCATION_KEY = 'currentLocation';
const MAX_RECENT_LOCATIONS = 5;

/**
 * Add a location to the recently viewed list
 * @param {Object} location - The location object to add
 * @returns {Promise<Array>} - The updated list of recent locations
 */
export const addRecentLocation = async (location) => {
  try {
    // Get existing recent locations
    const existingLocationsJson = await AsyncStorage.getItem(RECENT_LOCATIONS_KEY);
    let recentLocations = existingLocationsJson ? JSON.parse(existingLocationsJson) : [];
    
    // Check if this location already exists
    const existingIndex = recentLocations.findIndex(
      item => item.lat === location.lat && item.lon === location.lon
    );
    
    // If it exists, remove it so we can add it to the top
    if (existingIndex !== -1) {
      recentLocations.splice(existingIndex, 1);
    }
    
    // Add the new location to the top
    recentLocations.unshift(location);
    
    // Limit to MAX_RECENT_LOCATIONS
    if (recentLocations.length > MAX_RECENT_LOCATIONS) {
      recentLocations = recentLocations.slice(0, MAX_RECENT_LOCATIONS);
    }
    
    // Save the updated list
    await AsyncStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(recentLocations));
    
    return recentLocations;
  } catch (error) {
    console.error('Error adding recent location:', error);
    return [];
  }
};

/**
 * Get the list of recently viewed locations
 * @returns {Promise<Array>} - The list of recent locations
 */
export const getRecentLocations = async () => {
  try {
    const locationsJson = await AsyncStorage.getItem(RECENT_LOCATIONS_KEY);
    return locationsJson ? JSON.parse(locationsJson) : [];
  } catch (error) {
    console.error('Error getting recent locations:', error);
    return [];
  }
};

/**
 * Clear the list of recently viewed locations
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export const clearRecentLocations = async () => {
  try {
    await AsyncStorage.removeItem(RECENT_LOCATIONS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing recent locations:', error);
    return false;
  }
};

/**
 * Save the current location
 * @param {Object} location - The current location object
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
export const saveCurrentLocation = async (location) => {
  try {
    await AsyncStorage.setItem(CURRENT_LOCATION_KEY, JSON.stringify(location));
    return true;
  } catch (error) {
    console.error('Error saving current location:', error);
    return false;
  }
};

/**
 * Get the current location
 * @returns {Promise<Object|null>} - The current location or null if not set
 */
export const getCurrentLocation = async () => {
  try {
    const locationJson = await AsyncStorage.getItem(CURRENT_LOCATION_KEY);
    return locationJson ? JSON.parse(locationJson) : null;
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};