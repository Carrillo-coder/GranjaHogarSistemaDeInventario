import 'expo-router/entry';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  View, SafeAreaView, StatusBar, ScrollView,
  Text, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './Estilos/alertasFormStyles.styles.js';
import Footer from '../../components/Footer.js';
import useAlertas from '../../hooks/useAlertas';

const AlertasForm = () => {
  const router = useRouter();

  const alertasOpts = useMemo(() => ({
    dias: 10, umbralBajo: 10, umbralAlto: 100
  }), []);

  const { expiring, lowStock, overStock, loading, error, refresh } = useAlertas(alertasOpts);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Banner dinámico (solo si hay alertas) */}
      <SummaryBanner
        expiringCount={expiring.length}
        lowCount={lowStock.length}
        overCount={overStock.length}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            colors={['#04538A']}
          />
        }
      >
        {expiring.length > 0 && (
          <Card title="Productos por caducar" icon="time-outline">
            <Table
              headers={['Producto', 'Fecha']}
              rows={expiring.map((x) => ({ producto: x.nombre, meta: x.fecha || '' }))}
              metaAlign="right"
            />
          </Card>
        )}

        {lowStock.length > 0 && (
          <Card title="Productos bajos en almacén" icon="trending-down-outline">
            <Table
              headers={['Producto', 'Cantidad']}
              rows={lowStock.map((x) => ({ producto: x.nombre, meta: String(x.cantidad ?? 0) }))}
              metaAlign="right"
            />
          </Card>
        )}

        {overStock.length > 0 && (
          <Card title="Productos altos en inventario" icon="trending-up-outline">
            <Table
              headers={['Producto', 'Cantidad']}
              rows={overStock.map((x) => ({ producto: x.nombre, meta: String(x.cantidad ?? 0) }))}
              metaAlign="right"
            />
          </Card>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <Footer
        onLogOutPress={() => router.replace('/')}
        onHomePress={() => router.replace('/main/adminForm')}
      />
    </SafeAreaView>
  );
};

const SummaryBanner = ({ expiringCount = 0, lowCount = 0, overCount = 0 }) => {
  const parts = [];
  if (expiringCount > 0) parts.push(expiringCount === 1 ? '1 producto por caducar' : `${expiringCount} productos por caducar`);
  if (lowCount > 0) parts.push(lowCount === 1 ? '1 producto bajo en stock' : `${lowCount} productos bajos en stock`);
  if (overCount > 0) parts.push(overCount === 1 ? '1 producto alto en inventario' : `${overCount} productos altos en inventario`);
  if (parts.length === 0) return null;

  const text = parts.length === 1
    ? `Tienes ${parts[0]}.`
    : parts.length === 2
      ? `Tienes ${parts[0]} y ${parts[1]}.`
      : `Tienes ${parts[0]}, ${parts[1]} y ${parts[2]}.`;

  return (
    <View style={{
      marginHorizontal: 16, marginTop: 12, marginBottom: 6,
      backgroundColor: '#FFF7E6', borderColor: '#FFD28A', borderWidth: 1,
      borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12,
      flexDirection: 'row', alignItems: 'center'
    }}>
      <Ionicons name="alert-circle" size={18} color="#C77D00" style={{ marginRight: 8 }} />
      <Text style={{ color: '#6B4000', fontWeight: '600', flex: 1 }}>{text}</Text>
    </View>
  );
};

const Card = ({ title, icon, children }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      {icon ? <Ionicons name={icon} size={18} color="white" style={{ marginRight: 6 }} /> : null}
      <Text style={styles.cardHeaderText}>{title}</Text>
    </View>
    <View style={{ padding: 0 }}>{children}</View>
  </View>
);

const Table = ({ headers = ['Producto', 'Valor'], rows = [], metaAlign = 'right' }) => {
  const isEmpty = !rows || rows.length === 0;
  if (isEmpty) {
    return (
      <View style={styles.table}>
        <View style={[styles.tr, styles.trEmpty]}>
          <Text style={[styles.td, styles.cellProducto, styles.muted]}>Sin datos</Text>
          <Text style={[styles.td, styles.cellMeta]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.table}>
      <View style={[styles.tr, styles.trHeader]}>
        <Text style={[styles.th, styles.cellProducto]} numberOfLines={1}>{headers[0]}</Text>
        <Text
          style={[
            styles.th, styles.cellMeta,
            metaAlign === 'right' ? styles.alignRight : styles.alignLeft,
          ]}
          numberOfLines={1}
        >
          {headers[1]}
        </Text>
      </View>
      {rows.map((r, i) => (
        <View key={i} style={[styles.tr, i % 2 ? styles.trAlt : null]}>
          <Text style={[styles.td, styles.cellProducto]} numberOfLines={1}>
            {r.producto}
          </Text>
          <Text
            style={[
              styles.td, styles.cellMeta,
              metaAlign === 'right' ? styles.alignRight : styles.alignLeft,
            ]}
          >
            {r.meta}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default AlertasForm;
