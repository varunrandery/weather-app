import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

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
      <ScrollView 
        horizontal={true} 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.detailsContainer}
      >
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>High-Low </Text>
            <Text style={styles.detailValue}>{Math.round(weather.main.temp_max)}°⁄ {Math.round(weather.main.temp_min)}°</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Humidity</Text>
            <Text style={styles.detailValue}>{weather.main.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Wind</Text>
            <Text style={styles.detailValue}>{windSpeed} kph</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Feels Like</Text>
            <Text style={styles.detailValue}>{Math.round(weather.main.feels_like)}°</Text>
          </View>
        </View>
      </ScrollView>
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
    marginBottom: 10,
    color: '#333',
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0,
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    marginBottom: 0,
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
  detailsContainer: {
    marginLeft: 0,
  },
  details: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#FEF9F4',
    borderRadius: 16,
    padding: 16,
    paddingLeft: 18,
    paddingRight: 16,
  },
  detailItem: {
    alignItems: 'center',
    width: 85,
    margin: -1,
  },
  detailTitle: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailValue: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 20,
    color: '#333',
  },
});

export default WeatherCard;