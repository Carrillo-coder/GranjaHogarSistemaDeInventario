import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';

function TitleBar({ title }) {
  return (
    <View style={styles.titleBar}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

/**
 * Props opcionales:
 * - hasExpiring: boolean → si hay productos por caducar para mostrar la alerta.
 * - hasLowStock: boolean → si hay productos con bajo stock para mostrar la alerta.
 * - hasHighStock: boolean → si hay productos con stock alto para mostrar la alerta.
 */
export default function MainForm({ hasExpiring = true, hasLowStock = false, hasHighStock = false }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TitleBar title="Administrador" />

      {hasExpiring && (
        <Pressable style={styles.alert} onPress={() => router.push('/alertas')}>
          <Text style={styles.alertIcon}>⚠️</Text>
          <Text style={styles.alertText}>
            Tienes un producto por caducar. <Text style={styles.alertLink}>Pulsa para ver.</Text>
          </Text>
        </Pressable>
      )}

      {hasLowStock && (
        <Pressable style={styles.alert} onPress={() => router.push('/alertas/AlertasForm')}>
          <Text style={styles.alertIcon}>⚠️</Text>
          <Text style={styles.alertText}>
            Tienes productos con bajo stock. <Text style={styles.alertLink}>Pulsa para ver.</Text>
          </Text>
        </Pressable>
      )}

      {hasHighStock && (
        <Pressable style={styles.alert} onPress={() => router.push('/alertas/AlertasForm')}>
          <Text style={styles.alertIcon}>⚠️</Text>
          <Text style={styles.alertText}>
            Tienes productos con alto stock. <Text style={styles.alertLink}>Pulsa para ver.</Text>
          </Text>
        </Pressable>
      )}

      <View style={styles.grid2}>
        <Pressable style={styles.btnPrimary} onPress={() => router.push('/entrada/RegistrarEntradaForm')}>
          <Text style={styles.btnText}>Registrar entrada</Text>
        </Pressable>
        <Pressable style={styles.btnPrimary} onPress={() => router.push('/salida/RegistrarSalidaForm')}>
          <Text style={styles.btnText}>Registrar salida</Text>
        </Pressable>
      </View>

      <Pressable style={styles.btnPrimary} onPress={() => router.push('/inventario/InventarioForm')}>
        <Text style={styles.btnText}>Ver inventario</Text>
      </Pressable>

      <Pressable style={styles.btnPrimary} onPress={() => router.push('/reportes/ReportesForm')}>
        <Text style={styles.btnText}>Reportes</Text>
      </Pressable>

      <Pressable style={styles.btnPrimary} onPress={() => router.push('/usuarios/UsuariosForm')}>
        <Text style={styles.btnText}>Usuarios</Text>
      </Pressable>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  titleBar: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 18,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: { color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '700' },

  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  alertIcon: { fontSize: 18, marginRight: 8 },
  alertText: { flex: 1, fontSize: 14, color: '#111827' },
  alertLink: { textDecorationLine: 'underline', fontWeight: '600' },

  grid2: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#1e40af',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnText: { color: '#fff', fontWeight: '700' },
});
