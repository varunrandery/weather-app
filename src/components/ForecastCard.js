import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ForecastCard = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;
  
  // Format date to display as day of week
  const formatDate = (dateString) => {
    const options = { weekday: 'long' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View style={styles.card}>
      <View style={styles.forecastContainer}>
        {forecast.map((day, index) => (
          <View 
            key={day.date} 
            style={[
              styles.dayContainer,
              index < forecast.length - 1 && styles.dayDivider
            ]}
          >
            <Text style={styles.dayText}>{formatDate(day.date)}</Text>
            <View style={styles.iconContainer}>
              <Image 
                source={{ uri: `https://openweathermap.org/img/wn/${day.icon}@2x.png` }} 
                style={styles.icon} 
              />
            </View>
            <Text style={styles.tempText}>{day.avgTemp}°C</Text>
            <Text style={styles.descriptionText}>{day.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  dayDivider: {
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  dayText: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  iconContainer: {
    marginVertical: 4,
  },
  icon: {
    width: 50,
    height: 50,
  },
  tempText: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 22,
    color: '#333',
    marginVertical: 4,
  },
  descriptionText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 12,
    color: '#555',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
});

export default ForecastCard;