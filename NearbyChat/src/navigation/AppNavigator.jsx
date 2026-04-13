import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import useAuthStore from '../store/authStore';
import socketService from '../services/socket.service';

export default function AppNavigator() {
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      socketService.connect(token);
    } else {
      socketService.disconnect();
    }
  }, [token]);

  return (
    <NavigationContainer>
      {token ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}