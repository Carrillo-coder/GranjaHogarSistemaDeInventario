import 'expo-router/entry';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  products: '@gh_inventario_products',
  nextId: '@gh_inventario_next_id',
};

const COLORS = {
  primary: '#1976D2',
  success: '#2e7d32',
  successBg: '#e8f5e8',
  light: '#f5f5f5',
  card: '#ffffff',
  danger: '#d32f2f',
  text: '#333333',
  hint: '#666666',
  border: '#e0e0e0',
  accent: '#8BC34A',
};

const CustomButton = ({ title, onPress, style, textStyle, icon, small }) => (
  <TouchableOpacity
    style={[styles.button, small && styles.buttonSmall, style]}
    onPress={onPress}
  >
    {icon && <Ionicons name={icon} size={20} color="white" style={styles.buttonIcon} />}
    <Text style={[styles.buttonText, small && styles.buttonTextSmall, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const sqlOrCodePattern =
  /(select|insert|update|delete|drop|create|alter)\b|<|>|\/\*|\*\/|--|;|["'`]|[{()}=+*\\/]/i;
const onlyLettersPattern = /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
const presAllowedPattern = /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ0-9\s\-.,/()xX]+$/;

const hasCode = (v) => sqlOrCodePattern.test(v || '');
const isOnlyLetters = (v) => onlyLettersPattern.test(v || '');
const isPresValid = (v) => presAllowedPattern.test(v || '');
const isInt = (v) => /^\d+$/.test(String(v || ''));

const formatDate = (d) => {
  if (!d) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const toInputDate = (d) => {
  if (!d) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const CrearProductoForm = () => {
  const router = useRouter();
  const webDateRef = useRef(null);

  const [form, setForm] = useState({
    producto: '',
    presentacion: '',
    categoria: '',
    cantidad: '',
    caducidad: null,
  });

  const [errors, setErrors] = useState({
    producto: '',
    presentacion: '',
    categoria: '',
    cantidad: '',
    caducidad: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [productos, setProductos] = useState([]);
  const [showList, setShowList] = useState(false);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const [pStr, idStr] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.products),
          AsyncStorage.getItem(STORAGE_KEYS.nextId),
        ]);

        if (pStr) {
          const parsed = JSON.parse(pStr);
          const restored = Array.isArray(parsed)
            ? parsed.map((it) => ({
                ...it,
                caducidad: it.caducidad ? new Date(it.caducidad) : null,
                createdAt: it.createdAt ? new Date(it.createdAt) : new Date(),
              }))
            : [];
          setProductos(restored);
        }
        if (idStr && !Number.isNaN(Number(idStr))) {
          setNextId(Number(idStr));
        } else if (pStr) {
          const parsed = JSON.parse(pStr);
          const maxId =
            Array.isArray(parsed) && parsed.length
              ? Math.max(...parsed.map((x) => Number(x.id) || 0))
              : 0;
          setNextId(maxId + 1);
          await AsyncStorage.setItem(STORAGE_KEYS.nextId, String(maxId + 1));
        }
      } catch (e) {
        console.log('Error cargando almacenamiento:', e);
      }
    })();
  }, []);

  const handleHomePress = () => router.navigate('/Index');
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
  const validateCantidad = (v) => {
    if (v === '') return 'Requerido.';
    if (!isInt(v)) return 'Solo números enteros.';
    return '';
  };
  const validateCaducidad = (d) => (!d ? 'Seleccione una fecha.' : '');

  const runAllValidations = (state = form) => {
    const newErrs = {
      producto: validateProducto(state.producto),
      presentacion: validatePresentacion(state.presentacion),
      categoria: validateCategoria(state.categoria),
      cantidad: validateCantidad(state.cantidad),
      caducidad: validateCaducidad(state.caducidad),
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
      case 'cantidad':
        e = validateCantidad(value);
        break;
    }
    setErrors((prev) => ({ ...prev, [key]: e }));
  };

  const onSelectDate = (_, selected) => {
    setShowDatePicker(false);
    if (selected) {
      setForm((prev) => ({ ...prev, caducidad: selected }));
      setErrors((prev) => ({ ...prev, caducidad: validateCaducidad(selected) }));
    }
  };

  const openWebDate = () => {
    if (Platform.OS !== 'web') return;
    const el = webDateRef.current;
    if (el?.showPicker) el.showPicker();
    else el?.click();
  };

  const persist = async (newProducts, newNextId) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.products, JSON.stringify(newProducts)),
        AsyncStorage.setItem(STORAGE_KEYS.nextId, String(newNextId)),
      ]);
    } catch (e) {
      console.log('Error guardando almacenamiento:', e);
      Alert.alert('Aviso', 'No se pudo guardar localmente. Revisa permisos/espacio.');
    }
  };

  const handleCreate = async () => {
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
      cantidad: parseInt(form.cantidad, 10),
      caducidad: form.caducidad,
      createdAt: new Date(),
    };

    const newProducts = [nuevo, ...productos];
    const newNextId = nextId + 1;

    setProductos(newProducts);
    setNextId(newNextId);

    await persist(newProducts, newNextId);

    setForm({
      producto: '',
      presentacion: '',
      categoria: '',
      cantidad: '',
      caducidad: null,
    });
    setErrors({
      producto: '',
      presentacion: '',
      categoria: '',
      cantidad: '',
      caducidad: '',
    });

    Alert.alert('Listo', 'Producto creado (guardado localmente).');
  };

  const inputsAreInvalid = useMemo(() => Object.values(errors).some(Boolean), [errors]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Crear producto</Text>
      </View>

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
              returnKeyType="next"
            />
          </View>
          {errors.categoria ? <Text style={styles.errorText}>{errors.categoria}</Text> : null}

          <View style={styles.row}>
            <Text style={styles.label}>Cantidad</Text>
            <TextInput
              value={String(form.cantidad)}
              onChangeText={(v) => onChangeField('cantidad', v.replace(/[^\d]/g, ''))}
              placeholder="1"
              placeholderTextColor={COLORS.hint}
              keyboardType="numeric"
              style={[styles.input, errors.cantidad && styles.inputError]}
              returnKeyType="done"
            />
          </View>
          {errors.cantidad ? <Text style={styles.errorText}>{errors.cantidad}</Text> : null}

          <View style={styles.row}>
            <Text style={styles.label}>Fecha de caducidad</Text>
            <Pressable
              onPress={() =>
                Platform.OS === 'web' ? openWebDate() : setShowDatePicker(true)
              }
              style={[
                styles.input,
                styles.inputPressable,
                errors.caducidad && styles.inputError,
              ]}
            >
              <Ionicons name="calendar" size={18} color={COLORS.hint} style={{ marginRight: 8 }} />
              <Text style={form.caducidad ? styles.dateText : styles.placeholderText}>
                {form.caducidad ? formatDate(form.caducidad) : 'Seleccionar fecha'}
              </Text>

              {Platform.OS === 'web' && (
                <input
                  ref={webDateRef}
                  type="date"
                  value={form.caducidad ? toInputDate(form.caducidad) : ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    const d = v ? new Date(`${v}T00:00:00`) : null;
                    setForm((prev) => ({ ...prev, caducidad: d }));
                    setErrors((prev) => ({ ...prev, caducidad: validateCaducidad(d) }));
                  }}
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    width: 1,
                    height: 1,
                    pointerEvents: 'none',
                  }}
                />
              )}
            </Pressable>
          </View>
          {errors.caducidad ? <Text style={styles.errorText}>{errors.caducidad}</Text> : null}
        </View>

        <View style={{ gap: 10, marginBottom: 80 }}>
          <CustomButton
            title="Crear Producto"
            onPress={handleCreate}
            style={{ backgroundColor: COLORS.primary }}
            icon="checkmark-circle-outline"
          />
          <CustomButton
            title="Ver"
            onPress={() => setShowList(true)}
            style={{ backgroundColor: COLORS.text }}
            textStyle={{ color: '#fff' }}
            icon="eye-outline"
            small
          />
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={handleBackPress}>
          <Ionicons name="exit-outline" size={24} color={COLORS.accent} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={handleHomePress}>
          <Ionicons name="home" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Image
            source={require('../../assets/images/GranjaHogarLogo.png')}
            style={{ width: 40, height: 40, resizeMode: 'contain' }}
          />
          <Text style={styles.logoText}>GRAN HOGAR</Text>
        </View>
      </View>

      {showDatePicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={form.caducidad || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onSelectDate}
        />
      )}

      <Modal visible={showList} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Productos creados</Text>
              <TouchableOpacity onPress={() => setShowList(false)}>
                <Ionicons name="close" size={22} color="#333" />
              </TouchableOpacity>
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
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.productQty}>x{item.cantidad}</Text>
                      <Text style={styles.productDate}>{formatDate(item.caducidad)}</Text>
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
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: { flex: 1, padding: 16 },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonSmall: { paddingVertical: 8 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  buttonTextSmall: { fontSize: 14 },
  buttonIcon: { marginRight: 8 },

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
  row: { marginBottom: 10 },
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
  inputPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
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
  placeholderText: { color: COLORS.hint },
  dateText: { color: COLORS.text },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    elevation: 8,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navButton: { alignItems: 'center', padding: 8 },

  logoContainer: { position: 'absolute', bottom: 20, alignSelf: 'center' },
  logoPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  logoText: {
    marginLeft: 4,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.accent,
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
  productQty: { fontWeight: 'bold', color: COLORS.primary },
  productDate: { color: COLORS.hint, fontSize: 12 },
});

export default CrearProductoForm;
