import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import MapScreen from '../screens/map/MapScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const icon = (emoji) => () => <Text style={{ fontSize: 22 }}>{emoji}</Text>;

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1A1A1A', borderTopColor: '#2A2A2A' },
        tabBarActiveTintColor: '#0A84FF',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Carte', tabBarIcon: icon('🗺️') }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat', tabBarIcon: icon('💬') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil', tabBarIcon: icon('👤') }} />
    </Tab.Navigator>
  );
}
