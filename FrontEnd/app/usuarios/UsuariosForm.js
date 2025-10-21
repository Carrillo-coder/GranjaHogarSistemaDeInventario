import 'expo-router/entry'
import { useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { View, StyleSheet, StatusBar, SafeAreaView, ScrollView, Text, TouchableOpacity, Pressable, Alert, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Footer from '../../components/Footer'
import CustomButton from '../components/CustomButton'
import CustomAvatar from '../../components/CustomAvatar'
import { useUsuarios } from '../../hooks/useUsuarios'

const UsuariosForm = () => {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserList, setShowUserList] = useState(false)
  
  const { usuarios, loading, error, fetchUsuarios, handleDeleteUsuario } = useUsuarios()

  useEffect(() => {
    fetchUsuarios()
  }, []) 

  const handleCreateUser = () => {
    console.log('Crear usuario')
    router.push('/usuarios/CrearUsuarioForm')
  }

  const handleModifyUser = () => {
    if (selectedUser) {
      console.log('Modificar usuario:', selectedUser)

      router.push({
        pathname: '/usuarios/CrearUsuarioForm',
        params: {
          editMode: 'true',
          userId: selectedUser.idUsuario.toString(),
          nombreUsuario: selectedUser.nombreUsuario,
          nombreCompleto: selectedUser.nombreCompleto,
          idRol: selectedUser.idRol.toString(),
          rolNombre: selectedUser.rol?.nombre || '',
        }
      })
    } else {
      Alert.alert('Error', 'Selecciona un usuario para modificar')
    }
  }

  const handleDeleteUser = async () => {
    if (selectedUser) {
      Alert.alert(
        'Confirmar eliminación',
        `¿Estás seguro de desactivar a ${selectedUser.nombreCompleto}?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Sí, desactivar',
            onPress: async () => {
              const result = await handleDeleteUsuario(selectedUser.idUsuario)
              if (result.success) {
                Alert.alert('Éxito', 'Usuario desactivado correctamente')
                setSelectedUser(null)
              } else {
                Alert.alert('Error', result.message || 'No se pudo desactivar el usuario')
              }
            },
            style: 'destructive',
          },
        ]
      )
    } else {
      Alert.alert('Error', 'Selecciona un usuario para desactivar')
    }
  }

  const handleUserSelect = (user) => {
    setSelectedUser(user)
  }

  const toggleUserList = () => {
    setShowUserList(!showUserList)
  }

  if (loading && usuarios.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#04538A" />
          <Text style={styles.loadingText}>Cargando usuarios...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />
      <ScrollView style={styles.content}>
        <CustomButton
          title="Crear Usuario"
          onPress={handleCreateUser}
          style={styles.createButton}
          icon="person-add"
        />

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.userListCard}>
          <TouchableOpacity 
            style={styles.userListHeader} 
            onPress={toggleUserList}
          >
            <Ionicons name="people" size={20} color="#666" style={styles.listIcon} />
            <Text style={styles.userListTitle}>
              {selectedUser ? selectedUser.nombreCompleto : "Lista de usuarios"}
            </Text>
            <Ionicons 
              name={showUserList ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>

          {showUserList && (
            <ScrollView style={styles.userList} nestedScrollEnabled={true}>
              {usuarios.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="people-outline" size={48} color="#ccc" />
                  <Text style={styles.emptyText}>No hay usuarios disponibles</Text>
                </View>
              ) : (
                usuarios.map((user) => (
                  <Pressable
                    key={user.idUsuario}
                    onPress={() => {
                      handleUserSelect(user)
                      setShowUserList(false) 
                    }}
                    style={[
                      styles.userItem,
                      selectedUser?.idUsuario === user.idUsuario && styles.selectedUserItem
                    ]}
                  >
                    <CustomAvatar name={user.nombreCompleto} size={35} />
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{user.nombreCompleto}</Text>
                      <Text style={styles.userRole}>{user.rol?.nombre || 'Sin rol'}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#999" />
                  </Pressable>
                ))
              )}
            </ScrollView>
          )}
        </View>

        {selectedUser && (
          <View style={styles.selectedUserCard}>
            <Text style={styles.selectedUserTitle}>Usuario Seleccionado</Text>
            <View style={styles.divider} />
            <View style={styles.selectedUserInfo}>
              <CustomAvatar name={selectedUser.nombreCompleto} size={50} />
              <View style={styles.selectedUserDetails}>
                <Text style={styles.selectedUserName}>{selectedUser.nombreCompleto}</Text>
                <Text style={styles.selectedUserRole}>Rol: {selectedUser.rol?.nombre || 'Sin rol'}</Text>
                <Text style={styles.selectedUserUsername}>Usuario: {selectedUser.nombreUsuario}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.actionButtons}>
          <CustomButton
            title="Modificar"
            onPress={handleModifyUser}
            style={styles.modifyButton}
            icon="create-outline"
          />
          
          <CustomButton
            title="Desactivar"
            onPress={handleDeleteUser}
            style={styles.deleteButton}
            icon="trash-outline"
          />
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  createButton: {
    backgroundColor: '#04538A',
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  userListCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 16,
  },
  userListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listIcon: {
    marginRight: 12,
  },
  userListTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  userList: {
    maxHeight: 250,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedUserItem: {
    backgroundColor: '#e3f2fd',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#04538A',
    fontWeight: '500',
  },
  selectedUserCard: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedUserTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#c8e6c9',
    marginBottom: 12,
  },
  selectedUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedUserDetails: {
    marginLeft: 12,
    flex: 1,
  },
  selectedUserName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  selectedUserRole: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '500',
  },
  selectedUserUsername: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 80,
    gap: 12,
  },
  modifyButton: {
    backgroundColor: '#04538A',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    flex: 1,
  },
})

export default UsuariosForm