import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { clearRecentLocations } from '../services/storageUtils';

const SettingsScreen = () => {
  
  const handleClearRecentLocations = () => {
    Alert.alert(
      "Clear Recently Viewed",
      "Are you sure you want to clear your recently viewed places?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: async () => {
            const success = await clearRecentLocations();
            if (success) {
              // Notify the app that recent locations have been cleared
              if (global.recentLocationsClearedCallback) {
                global.recentLocationsClearedCallback();
              }
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>      
      <View style={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your weather experience</Text>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={22} color="#0070f3" />
            <Text style={styles.sectionTitle}>Places</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleClearRecentLocations}
          >
            <Text style={styles.actionButtonText}>Clear Recently Viewed Places</Text>
            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={22} color="#0070f3" />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Weather version 1.0.0
            </Text>
            <Text style={styles.infoSubtext}>
              Developed with Expo, React Native and the OpenWeatherMap API.
            </Text>
          </View>
        </View>
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
    padding: 20,
  },
  header: {
    marginBottom: 30,
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
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 20,
    marginLeft: 8,
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  infoSubtext: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 16,
    color: '#333',
  },
});

export default SettingsScreen;