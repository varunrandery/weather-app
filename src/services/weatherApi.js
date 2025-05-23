import axios from 'axios';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

export const getWeatherByCoords = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};

export const searchCities = async (query) => {
  try {
    const response = await axios.get(`${GEO_URL}/direct`, {
      params: {
        q: query,
        limit: 3,
        appid: process.env.OPENWEATHER_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
};

export const getForecastByCoords = async (lat, lon) => {
  try {
    const response = await axios.get(FORECAST_URL, {
      params: {
        lat,
        lon,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
        cnt: 24, // Get 24 data points (3 days with 8 points per day)
      },
    });
    
    // Process the forecast data to get daily forecasts
    const dailyForecasts = processDailyForecasts(response.data);
    return dailyForecasts;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

// Helper function to process forecast data into daily forecasts
const processDailyForecasts = (forecastData) => {
  const dailyData = {};
  
  // Group forecast data by day
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    if (!dailyData[day]) {
      dailyData[day] = {
        date: day,
        temps: [],
        icons: [],
        descriptions: [],
      };
    }
    
    dailyData[day].temps.push(item.main.temp);
    dailyData[day].icons.push(item.weather[0].icon);
    dailyData[day].descriptions.push(item.weather[0].description);
  });
  
  // Calculate high/low temps and most frequent icon/description for each day
  const result = Object.values(dailyData).map(day => {
    // Find high and low temperatures
    const highTemp = Math.max(...day.temps);
    const lowTemp = Math.min(...day.temps);
    
    // Find most common icon
    const iconCounts = {};
    day.icons.forEach(icon => {
      iconCounts[icon] = (iconCounts[icon] || 0) + 1;
    });
    const mostCommonIcon = Object.entries(iconCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    // Find most common description
    const descCounts = {};
    day.descriptions.forEach(desc => {
      descCounts[desc] = (descCounts[desc] || 0) + 1;
    });
    const mostCommonDescription = Object.entries(descCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    return {
      date: day.date,
      highTemp: Math.round(highTemp),
      lowTemp: Math.round(lowTemp),
      icon: mostCommonIcon,
      description: mostCommonDescription,
    };
  });
  
  // Return only the first 3 days
  return result.slice(0, 3);
};