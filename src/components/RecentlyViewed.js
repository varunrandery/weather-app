import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RecentlyViewed = ({ locations = [], onSelectLocation }) => {
  if (!locations || locations.length === 0) return null;

  const renderLocation = ({ item }) => (
    <TouchableOpacity 
      style={styles.locationItem}
      onPress={() => onSelectLocation(item.lat, item.lon, item)}
    >
      <View style={styles.locationContent}>
        <Ionicons name="location-outline" size={18} color="#0070f3" style={styles.locationIcon} />
        <View>
          <Text style={styles.locationName}>{item.name}</Text>
          {item.state && <Text style={styles.locationState}>{item.state}, {item.country}</Text>}
          {!item.state && <Text style={styles.locationState}>{item.country}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward-outline" size={18} color="#aaa" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recently Viewed</Text>
      </View>
      <FlatList
        data={locations}
        renderItem={renderLocation}
        keyExtractor={(item, index) => `recent-${index}-${item.lat}-${item.lon}`}
        scrollEnabled={true}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 16,
    color: '#333',
  },
  list: {
    borderRadius: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 12,
    marginLeft: 4,
  },
  locationName: {
    fontFamily: 'Geist_400Regular',
    fontSize: 16,
    color: '#333',
  },
  locationState: {
    fontFamily: 'Geist_400Regular',
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
});

export default RecentlyViewed;