import 'expo-router/entry';
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';

import CustomButton from '../../components/CustomButton';
import Footer from '../../components/Footer';

const COLORS = {
  primary: '#1976D2',
  light: '#f5f5f5',
  card: '#ffffff',
  danger: '#d32f2f',
  text: '#333333',
  hint: '#666666',
  border: '#e0e0e0',
};

const sqlOrCodePattern =
  /(select|insert|update|delete|drop|create|alter)\b|<|>|\/\*|\*\/|--|;|["'`]|[{()}=+*\\/]/i;
const onlyLettersPattern = /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
const presAllowedPattern = /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ0-9\s\-.,/()xX]+$/;

const hasCode = (v) => sqlOrCodePattern.test(v || '');
const isOnlyLetters = (v) => onlyLettersPattern.test(v || '');
const isPresValid = (v) => presAllowedPattern.test(v || '');

const CrearProductoForm = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    producto: '',
    presentacion: '',
    categoria: '',
  });

  const [errors, setErrors] = useState({
    producto: '',
    presentacion: '',
    categoria: '',
  });

  const [productos, setProductos] = useState([]);
  const [showList, setShowList] = useState(false);
  const [nextId, setNextId] = useState(1);

  const handleHomePress = () => router.navigate('/main/adminForm');
  const handleBackPress = () => router.back();

  const validateProducto = (v) => {
    if (!v) return 'Requerido.';
    if (hasCode(v)) return 'No se permite código/SQL.';
    if (!isOnlyLetters(v)) return 'Solo letras y espacios.';
    return '';
  };
  const validatePresentacion = (v) => {
    if (!v) return 'Requerido.';
    if (hasCode(v)) return 'No se permite código/SQL.';
    if (!isPresValid(v)) return 'Use letras/números (ej. "Caja 24", "500 ml").';
    return '';
  };
  const validateCategoria = (v) => {
    if (!v) return 'Requerido.';
    if (hasCode(v)) return 'No se permite código/SQL.';
    if (!isOnlyLetters(v)) return 'Solo letras y espacios.';
    return '';
  };

  const runAllValidations = (state = form) => {
    const newErrs = {
      producto: validateProducto(state.producto),
      presentacion: validatePresentacion(state.presentacion),
      categoria: validateCategoria(state.categoria),
    };
    setErrors(newErrs);
    return !Object.values(newErrs).some((e) => e);
  };

  const onChangeField = (key, value) => {
    const next = { ...form, [key]: value };
    setForm(next);
    let e = '';
    switch (key) {
      case 'producto':
        e = validateProducto(value);
        break;
      case 'presentacion':
        e = validatePresentacion(value);
        break;
      case 'categoria':
        e = validateCategoria(value);
        break;
    }
    setErrors((prev) => ({ ...prev, [key]: e }));
  };

  const handleCreate = () => {
    const ok = runAllValidations();
    if (!ok) {
      Alert.alert('Entrada inválida', 'Hay una casilla incorrecta. Revisa los campos en rojo.');
      return;
    }

    const nuevo = {
      id: nextId,
      producto: form.producto.trim(),
      presentacion: form.presentacion.trim(),
      categoria: form.categoria.trim(),
      createdAt: new Date(),
    };

    setProductos((prev) => [nuevo, ...prev]);
    setNextId((prev) => prev + 1);

    setForm({ producto: '', presentacion: '', categoria: '' });
    setErrors({ producto: '', presentacion: '', categoria: '' });

    Alert.alert('Listo', 'Producto creado (guardado temporalmente).');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.formCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Producto</Text>
            <TextInput
              value={form.producto}
              onChangeText={(v) => onChangeField('producto', v)}
              placeholder="Nombre del producto"
              placeholderTextColor={COLORS.hint}
              style={[styles.input, errors.producto && styles.inputError]}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>
          {errors.producto ? <Text style={styles.errorText}>{errors.producto}</Text> : null}

          <View style={styles.row}>
            <Text style={styles.label}>Presentación</Text>
            <TextInput
              value={form.presentacion}
              onChangeText={(v) => onChangeField('presentacion', v)}
              placeholder='Ej. "500 ml", "Caja 24 pzas"'
              placeholderTextColor={COLORS.hint}
              style={[styles.input, errors.presentacion && styles.inputError]}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>
          {errors.presentacion ? <Text style={styles.errorText}>{errors.presentacion}</Text> : null}

          <View style={styles.row}>
            <Text style={styles.label}>Categoría</Text>
            <TextInput
              value={form.categoria}
              onChangeText={(v) => onChangeField('categoria', v)}
              placeholder="Categoría"
              placeholderTextColor={COLORS.hint}
              style={[styles.input, errors.categoria && styles.inputError]}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>
          {errors.categoria ? <Text style={styles.errorText}>{errors.categoria}</Text> : null}
        </View>

        <View style={{ gap: 10, marginBottom: 100 }}>
          <CustomButton
            title="Crear Producto"
            onPress={handleCreate}
            style={{ backgroundColor: COLORS.primary }}
            icon="check-circle-outline"
          />
          <CustomButton
            title="Ver"
            onPress={() => setShowList(true)}
            style={{ backgroundColor: '#333' }}
            icon="visibility"
          />
        </View>
      </ScrollView>

      <Footer onBackPress={handleBackPress} onHomePress={handleHomePress} />

      <Modal visible={showList} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Productos creados</Text>
              <CustomButton
                title="Cerrar"
                onPress={() => setShowList(false)}
                style={{ backgroundColor: '#666', paddingVertical: 8 }}
                icon="close"
              />
            </View>

            {productos.length === 0 ? (
              <Text style={{ color: COLORS.hint, textAlign: 'center', marginVertical: 12 }}>
                Aún no has creado productos.
              </Text>
            ) : (
              <FlatList
                data={productos}
                keyExtractor={(item) => String(item.id)}
                ItemSeparatorComponent={() => (
                  <View style={{ height: 1, backgroundColor: COLORS.border }} />
                )}
                renderItem={({ item }) => (
                  <View style={styles.productRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.productName}>{item.producto}</Text>
                      <Text style={styles.productSub}>
                        {item.presentacion} · {item.categoria}
                      </Text>
                      <Text style={styles.productId}>ID {item.id}</Text>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  content: { flex: 1, padding: 16 },

  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: 12,
    marginBottom: 16,
  },
  row: { marginBottom: 12 },
  label: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: '#ffeaea',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: -2,
    marginBottom: 6,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },

  productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  productName: { fontWeight: 'bold', color: COLORS.text, fontSize: 15 },
  productSub: { color: COLORS.hint, marginTop: 2 },
  productId: { color: COLORS.danger, fontWeight: 'bold', marginTop: 2, fontSize: 12 },
});

export default CrearProductoForm;
