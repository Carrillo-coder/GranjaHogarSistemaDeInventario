import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      initialRouteName="Index"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: true,
        headerBackVisible: true, // Ensures back button is visible
        gestureEnabled: true, // Enables swipe back gesture
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Inicio de sesión' }} />
      <Stack.Screen name="main/adminForm" options={{ title: 'Inicio' }} />
      <Stack.Screen name="main/CocinaForm" options={{ title: 'Inicio' }} />
      <Stack.Screen name="main/ComedorForm" options={{ title: 'Inicio' }} />
      
      <Stack.Screen name="reportes/ReportesForm" options={{ title: 'Reportes' }} />
    </Stack>
  );
}
