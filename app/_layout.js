import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#04538A',
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
      <Stack.Screen name="main/CocinaForm" options={{ title: 'Cocina' }} />
      <Stack.Screen name="main/ComedorForm" options={{ title: 'Comedor' }} />
      <Stack.Screen name="salida/RegistrarSalidaForm" options={{ title: 'Registrar Salida' }} />
      <Stack.Screen name="inventario/InventarioForm" options={{ title: 'Inventario' }} />
      <Stack.Screen name="inventario/DetalleProductoForm" options={{ title: 'Detalle de Producto' }} />
      <Stack.Screen name="inventario/CrearProductoForm" options={{ title: 'Crear Producto' }} />
      <Stack.Screen name="entrada/RegistrarEntradaForm" options={{ title: 'Registrar Entrada' }} />
      <Stack.Screen name="reportes/ReportesForm" options={{ title: 'Reportes' }} />
      <Stack.Screen name="alertas/AlertasForm" options={{ title: 'Alertas' }} />
      <Stack.Screen name="usuarios/UsuariosForm" options={{ title: 'Usuarios' }} />
      <Stack.Screen name="salida/SalidaForm" options={{ title: 'Salida' }} />
      <Stack.Screen name="usuarios/CrearUsuarioForm" options={{ title: 'Crear Usuario' }} />
    </Stack>
  );
}
