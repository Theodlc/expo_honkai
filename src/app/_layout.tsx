import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#48bfe3',
        tabBarInactiveTintColor: '#777',
        tabBarStyle: {
          backgroundColor: '#161a2e',
          borderTopWidth: 0,
        },
        headerStyle: {
          backgroundColor: '#161a2e',
        },
        headerTintColor: '#fff',
      }}
    >
      {/* Aba 1: Lobby / Principal */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Lobby',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Aba 2: Explorar */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="compass"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Aba 3: Equipe */}
      <Tabs.Screen
        name="team"
        options={{
          title: 'Equipe',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="shield-checkmark"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Aba 4: Editor */}
      <Tabs.Screen
        name="editor"
        options={{
          title: 'Editor',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="images"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}