/**
 * Returns a background color gradient based on the weather condition
 * @param {Object} weather - The weather data object
 * @returns {Object} - An object with primary and secondary colors for the gradient
 */
export const getWeatherBackgroundColors = (weather) => {
  if (!weather || !weather.weather || !weather.weather[0]) {
    return {
      primary: '#f0f5ff',   // Default light blue
      secondary: '#e7efff'  // Slightly darker light blue
    };
  }

  // Get the weather condition code and main description
  const conditionCode = weather.weather[0].id;
  const conditionMain = weather.weather[0].main.toLowerCase();
  const isDay = weather.weather[0].icon.includes('d');
  
  // Check if it's night time
  if (!isDay) {
    return {
      primary: '#1a237e',   // Dark blue
      secondary: '#121858'  // Deeper dark blue
    };
  }

  // Check for clear sky
  if (conditionMain === 'clear') {
    return {
      primary: '#4fc3f7',   // Light blue
      secondary: '#29b6f6'  // Slightly darker blue
    };
  }
  
  // Check for clouds
  if (conditionMain === 'clouds') {
    if (conditionCode === 801) { // Few clouds
      return {
        primary: '#90caf9',   // Light blue-gray
        secondary: '#64b5f6'   // Slightly darker blue-gray
      };
    } else {
      return {
        primary: '#b0bec5',   // Gray-blue
        secondary: '#90a4ae'   // Darker gray-blue
      };
    }
  }
  
  // Check for rain or drizzle
  if (conditionMain === 'rain' || conditionMain === 'drizzle') {
    return {
      primary: '#78909c',   // Blue-gray
      secondary: '#546e7a'  // Darker blue-gray
    };
  }
  
  // Check for thunderstorm
  if (conditionMain === 'thunderstorm') {
    return {
      primary: '#455a64',   // Dark gray-blue
      secondary: '#37474f'  // Even darker gray-blue
    };
  }
  
  // Check for snow
  if (conditionMain === 'snow') {
    return {
      primary: '#e1f5fe',   // Very light blue
      secondary: '#b3e5fc'  // Slightly darker light blue
    };
  }
  
  // Check for mist, fog, haze, etc.
  if (['mist', 'fog', 'haze', 'smoke', 'dust', 'sand', 'ash'].includes(conditionMain)) {
    return {
      primary: '#cfd8dc',   // Light gray
      secondary: '#b0bec5'  // Medium gray
    };
  }
  
  // Default fallback
  return {
    primary: '#f0f5ff',   // Default light blue
    secondary: '#e7efff'  // Slightly darker light blue
  };
};

/**
 * Convert wind speed from m/s to km/h for display
 * @param {number} speed - The wind speed in m/s
 * @returns {number} - Converted wind speed in km/h
 */
export const convertWindSpeed = (speed) => {
  return Math.round(speed * 3.6); // Convert m/s to km/h
};