import 'expo-router/entry';
import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ProductosServiceProxy from '../../proxies/ProductosServiceProxy';
import Footer from '../../components/Footer';

const COLORS = {
  primary: '#1976D2',
  light: '#f5f5f5',
  card: '#ffffff',
  danger: '#d32f2f',
  text: '#333333',
  hint: '#666666',
  border: '#e0e0e0',
  accent: '#8BC34A',
};

const CustomButton = ({ title, onPress, style, textStyle, icon, disabled }) => (
  <TouchableOpacity
    style={[
      styles.button,
      style,
      disabled && { opacity: 0.6 },
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    {icon && <Ionicons name={icon} size={20} color="white" style={styles.buttonIcon} />}
    <Text style={[styles.buttonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

// Validaciones
const sqlOrCodePattern =
  /(select|insert|update|delete|drop|create|alter)\b|<|>|\/\*|\*\/|--|;|["'`]|[{()}=+*\\/]/i;
const onlyLettersPattern = /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
const presAllowedPattern = /^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ0-9\s\-.,/()xX]+$/;

const hasCode = (v) => sqlOrCodePattern.test(v || '');
const isOnlyLetters = (v) => onlyLettersPattern.test(v || '');
const isPresValid = (v) => presAllowedPattern.test(v || '');

const CrearProductoForm = () => {
  const router = useRouter();
  const api = useMemo(() => ProductosServiceProxy(), []);
  const [loading, setLoading] = useState(false);

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
    setForm((prev) => ({ ...prev, [key]: value }));
    let e = '';
    if (key === 'producto') e = validateProducto(value);
    if (key === 'presentacion') e = validatePresentacion(value);
    if (key === 'categoria') e = validateCategoria(value);
    setErrors((prev) => ({ ...prev, [key]: e }));
  };

  const handleBackPress = () => router.back();

  const handleCreate = async () => {
    if (loading) return;
    const ok = runAllValidations();
    if (!ok) {
      Alert.alert('Entrada inválida', 'Hay una casilla incorrecta. Revisa los campos en rojo.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nombre: form.producto.trim(),
        presentacion: form.presentacion.trim(),
        categoria: form.categoria.trim(),
      };

      const resp = await api.crearProducto(payload);

      Alert.alert(
        'Éxito',
        resp?.message || 'Producto creado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              setForm({ producto: '', presentacion: '', categoria: '' });
              setErrors({ producto: '', presentacion: '', categoria: '' });
            },
          },
        ],
        { cancelable: false }
      );
    } catch (e) {
      const rawMsg = (e && e.message) ? String(e.message) : 'No se pudo crear el producto';
      const msg = rawMsg.trim();
      const lower = msg.toLowerCase();
      const isDuplicate =
        e?.status === 400 ||
        lower.includes('existe') ||
        lower.includes('duplic') ||
        lower.includes('ya existe');

      if (isDuplicate) {
        Alert.alert('Advertencia', msg || 'Este producto ya existe en el inventario.');
      } else {
        Alert.alert('Error', msg || 'No se pudo crear el producto. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
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
            />
            {errors.producto ? <Text style={styles.errorText}>{errors.producto}</Text> : null}
          </View>

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
            />
            {errors.presentacion ? <Text style={styles.errorText}>{errors.presentacion}</Text> : null}
          </View>

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
            />
            {errors.categoria ? <Text style={styles.errorText}>{errors.categoria}</Text> : null}
          </View>
        </View>

        <View style={{ gap: 10, marginBottom: 80 }}>
          <CustomButton
            title={loading ? 'Creando...' : 'Crear Producto'}
            onPress={handleCreate}
            style={{ backgroundColor: '#8BC34A' }}
            icon="checkmark-circle-outline"
            disabled={loading}
          />
          {loading && (
            <View style={{ marginTop: 8, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#1976D2" />
            </View>
          )}
        </View>
      </ScrollView>

      <Footer
        onBackPress={() => router.replace('/')}
        onHomePress={() => router.replace('/main/adminForm')}
      />
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
    marginTop: 6,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonIcon: { marginRight: 8 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default CrearProductoForm;
