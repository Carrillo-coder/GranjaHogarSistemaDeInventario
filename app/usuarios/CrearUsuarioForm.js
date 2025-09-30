import 'expo-router/entry'
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {View, StyleSheet, StatusBar, SafeAreaView, ScrollView, Text, TouchableOpacity, TextInput, Image, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomButton = ({ title, onPress, style, textStyle, icon }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {icon && <Ionicons name={icon} size={20} color="white" style={styles.buttonIcon} />}
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const CustomInput = ({ placeholder, value, onChangeText, secureTextEntry, style }) => {
  return (
    <View style={[styles.inputContainer, style]}>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#666"
      />
    </View>
  );
};

const RolePicker = ({ selectedRole, onRoleSelect, roles }) => {
  const [showRoles, setShowRoles] = useState(false);

  const handleRoleSelect = (role) => {
    onRoleSelect(role);
    setShowRoles(false);
  };

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity 
        style={styles.rolePickerButton}
        onPress={() => setShowRoles(!showRoles)}
      >
        <Text style={[styles.rolePickerText, !selectedRole && styles.placeholderText]}>
          {selectedRole || 'Rol'}
        </Text>
        <Ionicons 
          name={showRoles ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#666" 
        />
      </TouchableOpacity>
      
      {showRoles && (
        <View style={styles.roleDropdown}>
          {roles.map((role, index) => (
            <TouchableOpacity
              key={index}
              style={styles.roleOption}
              onPress={() => handleRoleSelect(role)}
            >
              <Text style={styles.roleOptionText}>{role}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const CrearUsuarioScreen = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    contrasena: '',
    rol: ''
  });

  const roles = ['Admin', 'Cocina', 'Comedor'];

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { nombre, apellido, usuario, contrasena, rol } = formData;
    
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return false;
    }
    
    if (!apellido.trim()) {
      Alert.alert('Error', 'El apellido es obligatorio');
      return false;
    }
    
    if (!usuario.trim()) {
      Alert.alert('Error', 'El usuario es obligatorio');
      return false;
    }
    
    if (!contrasena.trim()) {
      Alert.alert('Error', 'La contraseña es obligatoria');
      return false;
    }
    
    if (contrasena.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    if (!rol) {
      Alert.alert('Error', 'Debe seleccionar un rol');
      return false;
    }
    
    return true;
  };

  const handleGuardarUsuario = () => {
    if (validateForm()) {
      console.log('Guardando usuario:', formData);
      Alert.alert(
        'Éxito',
        `Usuario ${formData.nombre} ${formData.apellido} creado correctamente`,
        [
          {
            text: 'OK',
            onPress: () => {
              setFormData({
                nombre: '',
                apellido: '',
                usuario: '',
                contrasena: '',
                rol: ''
              });
            }
          }
        ]
      );
    }
  };

  const handleHomePress = () => {
    console.log('Ir a inicio');
    router.navigate('/Index');
  };

  const handleBackPress = () => {
    console.log('Volver atrás');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1976D2" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Usuarios</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Formulario */}
        <View style={styles.formContainer}>
          
          {/* Campo Nombre */}
          <CustomInput
            placeholder="Nombre"
            value={formData.nombre}
            onChangeText={(value) => updateField('nombre', value)}
            style={styles.inputSpacing}
          />

          {/* Campo Apellido */}
          <CustomInput
            placeholder="Apellido"
            value={formData.apellido}
            onChangeText={(value) => updateField('apellido', value)}
            style={styles.inputSpacing}
          />

          {/* Campo Usuario */}
          <CustomInput
            placeholder="Usuario"
            value={formData.usuario}
            onChangeText={(value) => updateField('usuario', value)}
            style={styles.inputSpacing}
          />

          {/* Campo Contraseña */}
          <CustomInput
            placeholder="Contraseña"
            value={formData.contrasena}
            onChangeText={(value) => updateField('contrasena', value)}
            secureTextEntry={true}
            style={styles.inputSpacing}
          />

          {/* Selector de Rol */}
          <RolePicker
            selectedRole={formData.rol}
            onRoleSelect={(role) => updateField('rol', role)}
            roles={roles}
          />

        </View>

        {/* Botón Guardar */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Guardar Usuario"
            onPress={handleGuardarUsuario}
            style={styles.saveButton}
            icon="checkmark-circle"
          />
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={handleBackPress}>
          <Ionicons name="exit-outline" size={24} color="#8BC34A" />
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
            style={styles.logoImage}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1976D2',
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
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    marginTop: 20,
  },

  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputSpacing: {
    marginBottom: 20,
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },

  rolePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rolePickerText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  placeholderText: {
    color: '#666',
  },
  roleDropdown: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    maxHeight: 150,
  },
  roleOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  roleOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },

  buttonContainer: {
    marginTop: 40,
    marginBottom: 100,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#1976D2',
  },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navButton: {
    alignItems: 'center',
    padding: 8,
  },
  
  logoContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
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
  logoImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  },
});

export default CrearUsuarioScreen;
