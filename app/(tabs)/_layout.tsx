import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.interactive.activeTint,
        tabBarInactiveTintColor: Colors.interactive.inactiveTint,
        tabBarStyle: {
          backgroundColor: Colors.background.secondary,
          borderTopColor: Colors.border.default,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'DHD',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="keypad" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cartouche"
        options={{
          title: 'Cartouche',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="list" color={color} />,
        }}
      />
    </Tabs>
  );
}
