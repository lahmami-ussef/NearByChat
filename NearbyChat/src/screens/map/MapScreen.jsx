import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import useZoneStore from '../../store/zoneStore';
import { getAllZones } from '../../services/api.service';
import socketService from '../../services/socket.service';

// Default map style corresponds to standard white UI


export default function MapScreen({ navigation }) {
  const { currentZone, allZones, setCurrentZone, setAllZones, userCount, setUserCount } = useZoneStore();

  useEffect(() => {
    let locationSub = null;
    
    const fetchZones = async () => {
      try {
        const res = await getAllZones();
        const formattedZones = res.data.map(z => ({
          ...z,
          coordinates: z.polygon.coordinates[0].map(coord => ({
            longitude: coord[0],
            latitude: coord[1]
          }))
        }));
        setAllZones(formattedZones);
      } catch (e) {
        console.error('Failed to fetch zones', e);
      }
    };

    const setupLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'La localisation est nécessaire pour utiliser NearbyChat.');
        return;
      }
      
      let loc = await Location.getCurrentPositionAsync({});
      socketService.emit('updateLocation', { latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      
      locationSub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 5000, distanceInterval: 10 },
        (locUp) => {
          socketService.emit('updateLocation', { latitude: locUp.coords.latitude, longitude: locUp.coords.longitude });
        }
      );
    };

    fetchZones();
    setupLocation();

    return () => {
      if (locationSub) locationSub.remove();
    };
  }, []);

  // Listen for zone assignments separately so it plays nicely with allZones
  useEffect(() => {
    const handleZoneAssigned = ({ zoneId, zoneName, userCount: newCount }) => {
      if (zoneId) {
        setUserCount(newCount || 1); // Set the updated global user format
        const found = allZones.find(z => z.id === zoneId);
        if (found) {
          setCurrentZone(found);
        } else {
          // Dynamic zone was created! Re-fetch to display it
          getAllZones()
            .then(res => {
              const formattedZones = res.data.map(z => ({
                ...z,
                coordinates: z.polygon.coordinates[0].map(coord => ({
                  longitude: coord[0],
                  latitude: coord[1]
                }))
              }));
              setAllZones(formattedZones);
              const newlyFound = formattedZones.find(z => z.id === zoneId);
              if (newlyFound) setCurrentZone(newlyFound);
            })
            .catch(e => console.error(e));
        }
      } else {
        setCurrentZone(null);
      }
    };
    
    socketService.on('zoneAssigned', handleZoneAssigned);
    return () => {
      socketService.off('zoneAssigned', handleZoneAssigned);
    };
  }, [allZones, setAllZones, setCurrentZone]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 34.020,
          longitude: -6.841,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {allZones.map((zone) => (
          <Polygon
            key={zone.id}
            coordinates={zone.coordinates}
            fillColor={zone.color + '55'}
            strokeColor={zone.color}
            strokeWidth={3}
            tappable={true}
            onPress={() => setCurrentZone(zone)}
          />
        ))}
      </MapView>

      {/* Zone badge en bas */}
      {currentZone && (
        <View style={[styles.badge, { borderLeftColor: currentZone.color }]}>
          <View style={[styles.dot, { backgroundColor: currentZone.color }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.badgeName}>{currentZone.name}</Text>
            <Text style={styles.badgeUsers}>{userCount || currentZone.userCount || 0} personnes ici</Text>
          </View>
          <TouchableOpacity
            style={styles.chatBtn}
            onPress={() => navigation.navigate('Chat')}
          >
            <Text style={styles.chatBtnText}>Chat →</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  badge: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 5,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  dot: { width: 14, height: 14, borderRadius: 7 },
  badgeName: { color: '#111', fontWeight: '700', fontSize: 16 },
  badgeUsers: { color: '#888', fontSize: 12, marginTop: 2 },
  chatBtn: {
    backgroundColor: '#0A84FF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chatBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});