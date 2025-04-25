import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
  // Convert m/s to km/h for display
  const windSpeed = Math.round(weather.wind.speed * 3.6);
  
  return (
    <View style={styles.card}>
      <Text style={styles.city}>{weather.name}</Text>
      <View style={styles.mainInfo}>
        <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
      </View>
      <View style={styles.conditionContainer}>
        <Image 
          source={{ uri: iconUrl }} 
          style={styles.icon} 
        />
        <Text style={styles.description}>
          {weather.weather[0].description}
        </Text>
      </View>
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Humidity</Text>
          <Text style={styles.detailValue}>{weather.main.humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Wind</Text>
          <Text style={styles.detailValue}>{windSpeed} km/h</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailTitle}>Feels Like</Text>
          <Text style={styles.detailValue}>{Math.round(weather.main.feels_like)}°C</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    marginVertical: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  city: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    marginBottom: 10,
  },
  icon: {
    width: 50,
    height: 50,
    marginLeft: -16,
    marginRight: -16,
  },
  temp: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 64,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Geist_400Regular',
    fontSize: 24,
    textTransform: 'capitalize',
    color: '#555',
    marginLeft: 20,
    marginRight: -4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 16,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailTitle: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailValue: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 18,
    color: '#333',
  },
});

export default WeatherCard;