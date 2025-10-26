import 'expo-router/entry';
import React, { useState } from 'react';
import {
  View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView,
  Text, StatusBar, Pressable, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Footer from '../../components/Footer';
import { useSalidas } from '../../hooks/useSalidas';
import useProductosLista from '../../hooks/useProductosLista';
import useDepartamentos from '../../hooks/useDepartamentos';
import useTiposSalidas from '../../hooks/useTiposSalidas';

const SalidaForm = () => {
  const router = useRouter();
  const { agregarSalida } = useSalidas();

  const { productos, loading: loadingProductos, error: errorProductos, reload: reloadProductos } = useProductosLista();
  const { departamentos, loading: loadingDeptos, error: errorDeptos, reload: reloadDeptos } = useDepartamentos();
  const { tipos, loading: loadingTipos, error: errorTipos, reload: reloadTipos } = useTiposSalidas();

  const [showProductoList, setShowProductoList] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);

  const [showTipoList, setShowTipoList] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState(null);

  const [showDeptoList, setShowDeptoList] = useState(false);
  const [selectedDepto, setSelectedDepto] = useState(null);

  const [cantidad, setCantidad] = useState('');
  const [notas, setNotas] = useState('');

  const toggleProductoList = () => setShowProductoList(v => !v);
  const toggleTipoList = () => setShowTipoList(v => !v);
  const toggleDeptoList = () => setShowDeptoList(v => !v);

  const handleProductoSelect = (p) => { setSelectedProducto(p); setShowProductoList(false); };
  const handleTipoSelect = (t) => { setSelectedTipo(t); setShowTipoList(false); };
  const handleDeptoSelect = (d) => { setSelectedDepto(d); setShowDeptoList(false); };

  const handleOnAgregar = () => {
    if (!selectedProducto || !cantidad || !selectedTipo || !selectedDepto) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }
    const cantidadNum = parseInt(cantidad, 10);
    if (!/^\d+$/.test(cantidad) || cantidadNum <= 0) {
      Alert.alert('Error', 'La cantidad debe ser un entero positivo.');
      return;
    }
    if ((selectedProducto.cantidadTotal ?? 0) < cantidadNum) {
      Alert.alert('Stock insuficiente', `Disponible: ${selectedProducto.cantidadTotal}`);
      return;
    }

    // Tipos VO suelen traer idTipoS; mapeamos a idTipo (FK en Salidas)
    const idTipo = selectedTipo.idTipoS ?? selectedTipo.id ?? selectedTipo.idTipo ?? null;

    agregarSalida({
      idProducto: selectedProducto.idProducto,
      nombre: selectedProducto.nombre,             // solo UI
      cantidad: cantidadNum,
      idTipo,
      tipoNombre: selectedTipo.nombre,             // solo UI
      idDepartamento: selectedDepto.idDepartamento ?? selectedDepto.id,
      deptoNombre: selectedDepto.nombre,           // solo UI
      notas
    });

    Alert.alert('Agregado', 'Producto agregado al resumen de salida.');
    router.back();
  };

  const anyLoading = loadingProductos || loadingDeptos || loadingTipos;
  const anyError = errorProductos || errorDeptos || errorTipos;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Detalles de la salida</Text>

        {anyLoading && (
          <View style={styles.center}>
            <ActivityIndicator color="#04538A" />
            <Text>Cargando datos...</Text>
          </View>
        )}

        {!!anyError && !anyLoading && (
          <View style={styles.center}>
            {!!errorProductos && <Text style={styles.errText}>Productos: {errorProductos}</Text>}
            {!!errorDeptos && <Text style={styles.errText}>Departamentos: {errorDeptos}</Text>}
            {!!errorTipos && <Text style={styles.errText}>Tipos: {errorTipos}</Text>}
            <TouchableOpacity onPress={() => { reloadProductos(); reloadDeptos(); reloadTipos(); }} style={styles.retryButton}>
              <Text style={{ color: '#fff' }}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        {!anyLoading && !anyError && (
          <>
            {/* Producto */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Producto</Text>
              <TouchableOpacity style={styles.inputBox} onPress={toggleProductoList}>
                <Text style={selectedProducto ? styles.selectedText : styles.placeholderText}>
                  {selectedProducto ? `${selectedProducto.nombre} (${selectedProducto.presentacion})` : 'Selecciona producto...'}
                </Text>
                <Ionicons name={showProductoList ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color="#000" />
              </TouchableOpacity>
              {selectedProducto && (
                <Text style={styles.stockText}>Stock: {selectedProducto.cantidadTotal}</Text>
              )}
              {showProductoList && (
                <View style={styles.dropdownList}>
                  {productos.map((p) => (
                    <Pressable
                      key={p.idProducto}
                      onPress={() => handleProductoSelect(p)}
                      style={[styles.dropdownItem, selectedProducto?.idProducto === p.idProducto && styles.selectedItem]}
                    >
                      <Text style={styles.itemText}>
                        {p.nombre} ({p.presentacion}) — Stock: {p.cantidadTotal ?? 0}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Cantidad */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Cantidad</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Cantidad..."
                value={cantidad}
                onChangeText={(t) => { if (/^\d*$/.test(t)) setCantidad(t); }}
                keyboardType="numeric"
                placeholderTextColor="#666"
              />
            </View>

            {/* Notas */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Notas (opcional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Escribe alguna nota..."
                value={notas}
                onChangeText={setNotas}
                multiline numberOfLines={3}
                placeholderTextColor="#666"
              />
            </View>

            {/* Tipo de salida */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tipo de salida</Text>
              <TouchableOpacity style={styles.inputBox} onPress={toggleTipoList}>
                <Text style={selectedTipo ? styles.selectedText : styles.placeholderText}>
                  {selectedTipo ? selectedTipo.nombre : 'Selecciona tipo...'}
                </Text>
                <Ionicons name={showTipoList ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color="#000" />
              </TouchableOpacity>
              {showTipoList && (
                <View style={styles.dropdownList}>
                  {tipos.map((t) => (
                    <Pressable
                      key={t.idTipoS ?? t.id}
                      onPress={() => handleTipoSelect(t)}
                      style={[styles.dropdownItem, (selectedTipo?.idTipoS ?? selectedTipo?.id) === (t.idTipoS ?? t.id) && styles.selectedItem]}
                    >
                      <Text style={styles.itemText}>{t.nombre}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Departamento */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Departamento</Text>
              <TouchableOpacity style={styles.inputBox} onPress={toggleDeptoList}>
                <Text style={selectedDepto ? styles.selectedText : styles.placeholderText}>
                  {selectedDepto ? selectedDepto.nombre : 'Selecciona departamento...'}
                </Text>
                <Ionicons name={showDeptoList ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color="#000" />
              </TouchableOpacity>
              {showDeptoList && (
                <View style={styles.dropdownList}>
                  {departamentos.map((d) => (
                    <Pressable
                      key={d.idDepartamento}
                      onPress={() => handleDeptoSelect(d)}
                      style={[styles.dropdownItem, selectedDepto?.idDepartamento === d.idDepartamento && styles.selectedItem]}
                    >
                      <Text style={styles.itemText}>{d.nombre}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleOnAgregar}>
              <Text style={styles.submitButtonText}>Agregar al resumen</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <Footer onLogOutPress={() => router.replace('/')} onHomePress={() => router.replace('/main/adminForm')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, padding: 16, paddingBottom: 150 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 14, marginBottom: 6, fontWeight: '500', color: '#333' },
  textInput: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16, color: '#333' },
  inputBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 12, backgroundColor: '#fff' },
  selectedText: { fontSize: 16, color: '#000' },
  placeholderText: { fontSize: 16, color: '#999' },
  dropdownList: { borderWidth: 1, borderColor: '#ccc', borderTopWidth: 0, borderRadius: 8, overflow: 'hidden', marginTop: 2, backgroundColor: '#fff' },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 12 },
  selectedItem: { backgroundColor: '#e0f2f1' },
  itemText: { fontSize: 16 },
  submitButton: { backgroundColor: '#8BC34A', paddingVertical: 14, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  stockText: { marginTop: 8, fontSize: 14, color: '#04538A', fontWeight: '600', textAlign: 'right' },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 30 },
  errText: { color: '#b91c1c', marginBottom: 6, textAlign: 'center' },
  retryButton: { backgroundColor: '#04538A', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, marginTop: 8 },
});

export default SalidaForm;
