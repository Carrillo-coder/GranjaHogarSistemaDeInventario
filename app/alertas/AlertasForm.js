import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function TitleBar({ title }) {
  return (
    <View style={styles.titleBar}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={{ gap: 6 }}>{children}</View>
    </View>
  );
}

/**
 * Props opcionales para inyectar datos reales:
 * - expiring: [{ nombre, fecha }]
 * - lowStock: [{ nombre, cantidad }]
 * - overStock: [{ nombre, cantidad }]
 */
export default function AlertasForm({
  expiring = [
    { nombre: 'Producto 1', fecha: '2025-10-15' },
    { nombre: 'Producto 2', fecha: '2025-10-20' },
    { nombre: 'Producto 3', fecha: '2025-11-02' },
  ],
  lowStock = [
    { nombre: 'Producto 1', cantidad: 2 },
    { nombre: 'Producto 2', cantidad: 1 },
    { nombre: 'Producto 3', cantidad: 4 },
  ],
  overStock = [
    { nombre: 'Producto 1', cantidad: 120 },
    { nombre: 'Producto 2', cantidad: 95 },
    { nombre: 'Producto 3', cantidad: 80 },
  ],
}) {
  return (
    <View style={styles.screen}>
      <TitleBar title="Alertas" />

      <Section title="Productos por caducar">
        {expiring.map((p, i) => (
          <Text key={`exp-${i}`} style={styles.item}>
            {p.nombre} — {p.fecha}
          </Text>
        ))}
      </Section>

      <Section title="Productos bajos en almacén">
        {lowStock.map((p, i) => (
          <Text key={`low-${i}`} style={styles.item}>
            {p.nombre} — {p.cantidad}
          </Text>
        ))}
      </Section>

      <Section title="Productos altos en inventario">
        {overStock.map((p, i) => (
          <Text key={`over-${i}`} style={styles.item}>
            {p.nombre} — {p.cantidad}
          </Text>
        ))}
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  titleBar: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 18,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: { color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: '700' },

  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionHeader: {
    backgroundColor: '#1e40af',
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  sectionTitle: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  item: { fontSize: 14, color: '#111827' },
});
