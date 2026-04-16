import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// Importation de MapView pour afficher Google Maps et Polygon pour dessiner des zones
import MapView, { Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
// Accès aux données globales (zones et utilisateur actuel)
import useZoneStore from '../../store/zoneStore';
// Services de communication
import { getAllZones } from '../../services/api.service';
import socketService from '../../services/socket.service';

/**
 * MapScreen : L'écran principal de l'application.
 * Affiche la position de l'utilisateur et les zones de chat à proximité.
 */
export default function MapScreen({ navigation }) {
  // Récupération des données du store global
  const { currentZone, allZones, setCurrentZone, setAllZones, userCount, setUserCount } = useZoneStore();

  /**
   * Effet initial : Charge les zones et démarre la géolocalisation.
   */
  useEffect(() => {
    let locationSub = null;
    
    // Fonction pour récupérer toutes les zones définies sur le serveur
    const fetchZones = async () => {
      try {
        const res = await getAllZones();
        // Formate les données GeoJSON du backend en format compatible avec react-native-maps
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

    // Fonction pour activer le GPS et surveiller les déplacements
    const setupLocation = async () => {
      // 1. Demande la permission à l'utilisateur
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'La localisation est nécessaire pour utiliser NearbyChat.');
        return;
      }
      
      // 2. Récupère la position initiale
      let loc = await Location.getCurrentPositionAsync({});
      // Informe immédiatement le backend de la position via WebSocket
      socketService.emit('updateLocation', { 
        latitude: loc.coords.latitude, 
        longitude: loc.coords.longitude 
      });
      
      // 3. Surveille les déplacements toutes les 5 secondes ou 10 mètres
      locationSub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 5000, distanceInterval: 10 },
        (locUp) => {
          // Met à jour la position sur le serveur pour potentiellement changer de zone
          socketService.emit('updateLocation', { 
            latitude: locUp.coords.latitude, 
            longitude: locUp.coords.longitude 
          });
        }
      );
    };

    fetchZones();
    setupLocation();

    // Nettoyage lors de la fermeture de l'écran
    return () => {
      if (locationSub) locationSub.remove();
    };
  }, []);

  /**
   * Écoute en permanence si le serveur nous assigne à une nouvelle zone.
   */
  useEffect(() => {
    const handleZoneAssigned = ({ zoneId, zoneName, userCount: newCount }) => {
      if (zoneId) {
        // Met à jour le nombre d'utilisateurs dans la zone
        setUserCount(newCount || 1);
        // Cherche les détails de la zone dans la liste locale
        const found = allZones.find(z => z.id === zoneId);
        if (found) {
          setCurrentZone(found); // L'utilisateur est entré dans une zone connue
        } else {
          // Si la zone n'existe pas localement (zone dynamique), on recharge tout
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
        // L'utilisateur est sorti de toute zone (zone neutre)
        setCurrentZone(null);
      }
    };
    
    // S'abonne à l'événement du socket
    socketService.on('zoneAssigned', handleZoneAssigned);
    
    return () => {
      socketService.off('zoneAssigned', handleZoneAssigned);
    };
  }, [allZones, setAllZones, setCurrentZone]);

  return (
    <View style={styles.container}>
      {/* Composant Carte de Google */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 34.020, // Position par défaut (ex: Rabat)
          longitude: -6.841,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
        showsUserLocation={true}    // Affiche le petit point bleu pour l'utilisateur
        showsMyLocationButton={true} // Affiche le bouton "Ma position"
      >
        {/* Dessine chaque zone enregistrée sur la carte */}
        {allZones.map((zone) => (
          <Polygon
            key={zone.id}
            coordinates={zone.coordinates}
            fillColor={zone.color + '55'} // Couleur de remplissage (semi-transparente)
            strokeColor={zone.color}       // Couleur de la bordure
            strokeWidth={3}
            tappable={true}
            onPress={() => setCurrentZone(zone)} // Sélection manuelle au clic
          />
        ))}
      </MapView>

      {/* Badge flottant qui apparaît quand l'utilisateur est dans une zone */}
      {currentZone && (
        <View style={[styles.badge, { borderLeftColor: currentZone.color }]}>
          <View style={[styles.dot, { backgroundColor: currentZone.color }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.badgeName}>{currentZone.name}</Text>
            <Text style={styles.badgeUsers}>{userCount || currentZone.userCount || 0} personnes ici</Text>
          </View>
          {/* Bouton pour aller au chat de cette zone */}
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

// Styles pour un affichage propre et moderne
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
    elevation: 8, // Ombre sur Android
    shadowColor: '#000', // Ombre sur iOS
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