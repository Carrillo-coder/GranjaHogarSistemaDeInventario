import 'expo-router/entry'
import { useRouter, useLocalSearchParams } from 'expo-router'
import React, { useState, useEffect } from 'react'
import {View, StyleSheet, StatusBar, SafeAreaView, ScrollView, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Footer from '../../components/Footer'
import { useUsuarios } from '../../hooks/useUsuarios'
import { useRoles } from '../../hooks/useRoles'

const showAlert = (title, message, onPress) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`)
    if (onPress) onPress()
  } else {
    Alert.alert(title, message, [{ text: 'OK', onPress }])
  }
}

const CustomButton = ({ title, onPress, style, textStyle, icon, disabled }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, style, disabled && styles.buttonDisabled]} 
      onPress={onPress}
      disabled={disabled}
    >
      {icon && <Ionicons name={icon} size={20} color="white" style={styles.buttonIcon} />}
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}

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
  )
}

const RolePicker = ({ selectedRole, onRoleSelect, roles, loading }) => {
  const [showRoles, setShowRoles] = useState(false)

  const handleRoleSelect = (role) => {
    onRoleSelect(role)
    setShowRoles(false)
  }

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity 
        style={styles.rolePickerButton}
        onPress={() => setShowRoles(!showRoles)}
        disabled={loading}
        activeOpacity={0.7}
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
          {loading ? (
            <View style={styles.loadingRoles}>
              <ActivityIndicator size="small" color="#04538A" />
            </View>
          ) : roles.length === 0 ? (
            <View style={styles.emptyRoles}>
              <Text style={styles.emptyText}>No hay roles disponibles</Text>
            </View>
          ) : (
            roles.map((role) => (
              <TouchableOpacity
                key={role.idRol}
                style={styles.roleOption}
                onPress={() => handleRoleSelect(role)}
                activeOpacity={0.7}
              >
                <Text style={styles.roleOptionText}>{role.nombre}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
    </View>
  )
}

const CrearUsuarioScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  
  const isEditMode = params.editMode === 'true'
  const userId = params.userId
  
  const { handleCreateUsuario, handleUpdateUsuario, loading: usuarioLoading } = useUsuarios()
  const { roles, loading: rolesLoading, fetchRoles } = useRoles()

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    nombreUsuario: '',
    password: '',
    idRol: null,
    rolNombre: ''
  })

  useEffect(() => {
    fetchRoles()
  }, []) 

  useEffect(() => {
    if (isEditMode && params.nombreCompleto) {
      setFormData({
        nombreCompleto: params.nombreCompleto || '',
        nombreUsuario: params.nombreUsuario || '',
        password: '', 
        idRol: params.idRol ? parseInt(params.idRol) : null,
        rolNombre: params.rolNombre || ''
      })
    }
  }, []) 

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      idRol: role.idRol,
      rolNombre: role.nombre
    }))
  }

  const validateForm = () => {
    const { nombreCompleto, nombreUsuario, password, idRol } = formData
    
    if (!nombreCompleto.trim()) {
      showAlert('Error', 'El nombre completo es obligatorio')
      return false
    }
    
    if (!nombreUsuario.trim()) {
      showAlert('Error', 'El nombre de usuario es obligatorio')
      return false
    }

    if (!isEditMode && !password.trim()) {
      showAlert('Error', 'La contraseña es obligatoria')
      return false
    }
    
    if (password && password.length < 6) {
      showAlert('Error', 'La contraseña debe tener al menos 6 caracteres')
      return false
    }
    
    if (!idRol) {
      showAlert('Error', 'Debe seleccionar un rol')
      return false
    }
    
    return true
  }

  const handleGuardarUsuario = async () => {
    if (!validateForm()) return

    const userData = {
      nombreCompleto: formData.nombreCompleto.trim(),
      nombreUsuario: formData.nombreUsuario.trim(),
      idRol: formData.idRol
    }

    if (formData.password.trim()) {
      userData.password = formData.password.trim()
    }

    let result
    if (isEditMode) {
      result = await handleUpdateUsuario(userId, userData)
      
      if (result.success) {
        Alert.alert(
          'Éxito',
          `Usuario "${formData.nombreCompleto}" actualizado correctamente`,
          [
            {
              text: 'OK',
              onPress: () => {
                router.back()
              }
            }
          ]
        )
      } else {
        Alert.alert('Error', result.message || 'No se pudo actualizar el usuario')
      }
    } else {
      result = await handleCreateUsuario(userData)
      
      if (result.success) {
        Alert.alert(
          'Éxito',
          `Usuario "${formData.nombreCompleto}" creado correctamente`,
          [
            {
              text: 'OK',
              onPress: () => {
                router.back()
              }
            }
          ]
        )
      } else {
        Alert.alert('Error', result.message || 'No se pudo crear el usuario')
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1976D2" barStyle="light-content" />
      

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          
          {/* Campo Nombre Completo */}
          <CustomInput
            placeholder="Nombre Completo"
            value={formData.nombreCompleto}
            onChangeText={(value) => updateField('nombreCompleto', value)}
            style={styles.inputSpacing}
          />

          {/* Campo Usuario */}
          <CustomInput
            placeholder="Nombre de Usuario"
            value={formData.nombreUsuario}
            onChangeText={(value) => updateField('nombreUsuario', value)}
            style={styles.inputSpacing}
          />

          {/* Campo Contraseña */}
          <CustomInput
            placeholder={isEditMode ? "Contraseña (dejar vacío para no cambiar)" : "Contraseña"}
            value={formData.password}
            onChangeText={(value) => updateField('password', value)}
            secureTextEntry={true}
            style={styles.inputSpacing}
          />

          {/* Selector de Rol */}
          <RolePicker
            selectedRole={formData.rolNombre}
            onRoleSelect={handleRoleSelect}
            roles={roles}
            loading={rolesLoading}
          />

          {isEditMode && (
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#04538A" />
              <Text style={styles.infoText}>
                Modo edición: Deja la contraseña vacía si no deseas cambiarla
              </Text>
            </View>
          )}

        </View>

        {/* Botón Guardar */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={
              usuarioLoading 
                ? (isEditMode ? "Actualizando..." : "Guardando...") 
                : (isEditMode ? "Actualizar Usuario" : "Guardar Usuario")
            }
            onPress={handleGuardarUsuario}
            style={[styles.saveButton, usuarioLoading && styles.buttonDisabled]}
            icon={usuarioLoading ? null : (isEditMode ? "checkmark-done" : "checkmark-circle")}
            disabled={usuarioLoading}
          />
          
          {usuarioLoading && (
            <ActivityIndicator style={styles.loadingIndicator} size="large" color="#8BC34A" />
          )}
        </View>

      </ScrollView>
      <Footer
        onLogOutPress={() => router.replace('/')}
        onHomePress={() => router.replace('/main/adminForm')}    
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#04538A',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
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
    maxHeight: 200,
    overflow: 'scroll',
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
  loadingRoles: {
    padding: 20,
    alignItems: 'center',
  },
  emptyRoles: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#04538A',
    flex: 1,
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
  buttonDisabled: {
    backgroundColor: '#ccc',
    elevation: 0,
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
    backgroundColor: '#8BC34A',
  },
  loadingIndicator: {
    marginTop: 20,
  },
})

export default CrearUsuarioScreen