import 'expo-router/entry';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  View, SafeAreaView, StatusBar, ScrollView,
  Text, TouchableOpacity, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './Estilos/alertasFormStyles.styles.js';

/**
 * Puedes inyectar datos reales por props si quieres:
 * expiring=[{ nombre, fecha }] lowStock=[{ nombre, cantidad }] overStock=[{ nombre, cantidad }]
 */
const AlertasForm = ({
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
    { nombre: 'Producto 4', cantidad: 120 },
    { nombre: 'Producto 5', cantidad: 95 },
  ],
}) => {
  const router = useRouter();
  const handleBackPress = () => router.back();
  const handleHomePress = () => router.navigate('/Index'); // si tu ruta es /index cámbiala aquí

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alertas</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card title="Productos por caducar" icon="time-outline">
          <Table
            headers={['Producto', 'Fecha']}
            rows={expiring.map((x) => ({ producto: x.nombre, meta: x.fecha }))}
            metaAlign="right"
          />
        </Card>

        <Card title="Productos bajos en almacén" icon="trending-down-outline">
          <Table
            headers={['Producto', 'Cantidad']}
            rows={lowStock.map((x) => ({ producto: x.nombre, meta: String(x.cantidad) }))}
            metaAlign="right"
          />
        </Card>

        <Card title="Productos altos en inventario" icon="trending-up-outline">
          <Table
            headers={['Producto', 'Cantidad']}
            rows={overStock.map((x) => ({ producto: x.nombre, meta: String(x.cantidad) }))}
            metaAlign="right"
          />
        </Card>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#8BC34A" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleHomePress}>
          <Ionicons name="home" size={28} color="#1976D2" />
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Image
            source={require('../../assets/images/GranjaHogarLogo.png')}
            style={{ width: 40, height: 40, resizeMode: 'contain' }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

/* ---------- UI helpers ---------- */

const Card = ({ title, icon, children }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      {icon ? <Ionicons name={icon} size={18} color="white" style={{ marginRight: 6 }} /> : null}
      <Text style={styles.cardHeaderText}>{title}</Text>
    </View>
    <View style={{ padding: 0 }}>{children}</View>
  </View>
);

/**
 * Tabla simple responsive (2 columnas: Producto + Meta)
 * rows: [{ producto: string, meta: string }]
 * headers: [string, string]
 * metaAlign: 'right' | 'left'
 */
const Table = ({ headers = ['Producto', 'Valor'], rows = [], metaAlign = 'right' }) => {
  const isEmpty = !rows || rows.length === 0;
  return (
    <View style={styles.table}>
      {/* Encabezados */}
      <View style={[styles.tr, styles.trHeader]}>
        <Text style={[styles.th, styles.cellProducto]} numberOfLines={1}>{headers[0]}</Text>
        <Text
          style={[
            styles.th,
            styles.cellMeta,
            metaAlign === 'right' ? styles.alignRight : styles.alignLeft,
          ]}
          numberOfLines={1}
        >
          {headers[1]}
        </Text>
      </View>

      {/* Filas */}
      {isEmpty ? (
        <View style={[styles.tr, styles.trEmpty]}>
          <Text style={[styles.td, styles.cellProducto, styles.muted]}>Sin datos</Text>
          <Text style={[styles.td, styles.cellMeta]} />
        </View>
      ) : (
        rows.map((r, i) => (
          <View key={i} style={[styles.tr, i % 2 ? styles.trAlt : null]}>
            <Text style={[styles.td, styles.cellProducto]} numberOfLines={1}>
              {r.producto}
            </Text>
            <Text
              style={[
                styles.td,
                styles.cellMeta,
                metaAlign === 'right' ? styles.alignRight : styles.alignLeft,
              ]}
            >
              {r.meta}
            </Text>
          </View>
        ))
      )}
    </View>
  );
};

export default AlertasForm;
