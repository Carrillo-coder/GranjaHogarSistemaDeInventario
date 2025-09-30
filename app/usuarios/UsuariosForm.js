import 'expo-router/entry'
import {useRouter} from 'expo-router';
import React, { useState } from 'react';
import {View, StyleSheet, StatusBar, SafeAreaView, ScrollView, Text, TouchableOpacity, Pressable, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomAvatar = ({ name, size = 40 }) => {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const CustomButton = ({ title, onPress, style, textStyle, icon }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {icon && <Ionicons name={icon} size={20} color="white" style={styles.buttonIcon} />}
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const UsuariosForm = () => {
  const router = useRouter();

  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserList, setShowUserList] = useState(false);
  const [users] = useState([
    { id: 1, name: 'Juan Pérez', role: 'Admin' },
    { id: 2, name: 'María González', role: 'Cocina' },
    { id: 3, name: 'Carlos López', role: 'Cocina' },
    { id: 4, name: 'Ana Martínez', role: 'Comedor' },
  ]);

  const handleCreateUser = () => {
    console.log('Crear usuario');
    router.navigate('/usuarios/CrearUsuarioForm')
  };

  const handleModifyUser = () => {
    if (selectedUser) {
      console.log('Modificar usuario:', selectedUser);
      router.navigate('/usuarios/CrearUsuarioForm')
    } else {
      alert('Selecciona un usuario para modificar');
    }
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      console.log('Borrar usuario:', selectedUser);
      alert(`¿Estás seguro de borrar a ${selectedUser.name}?`);
    } else {
      alert('Selecciona un usuario para borrar');
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const toggleUserList = () => {
    setShowUserList(!showUserList);
  };

  const handleHomePress = () => {
    console.log('Ir a inicio');
    router.replace('/');
  };

  const handleBackPress = () => {
    console.log('Volver atrás');
    router.back()
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1976D2" barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Usuarios</Text>
      </View>

      <ScrollView style={styles.content}>
        <CustomButton
          title="Crear Usuario"
          onPress={handleCreateUser}
          style={styles.createButton}
          icon="person-add"
        />

        <View style={styles.userListCard}>
          <TouchableOpacity 
            style={styles.userListHeader} 
            onPress={toggleUserList}
          >
            <Ionicons name="people" size={20} color="#666" style={styles.listIcon} />
            <Text style={styles.userListTitle}>
              {selectedUser ? selectedUser.name : "Lista de usuarios"}
            </Text>
            <Ionicons 
              name={showUserList ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>

          {showUserList && (
            <View style={styles.userList}>
              {users.map((user) => (
                <Pressable
                  key={user.id}
                  onPress={() => handleUserSelect(user)}
                  style={[
                    styles.userItem,
                    selectedUser?.id === user.id && styles.selectedUserItem
                  ]}
                >
                  <CustomAvatar name={user.name} size={35} />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userRole}>{user.role}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#999" />
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {selectedUser && (
          <View style={styles.selectedUserCard}>
            <Text style={styles.selectedUserTitle}>Usuario Seleccionado</Text>
            <View style={styles.divider} />
            <View style={styles.selectedUserInfo}>
              <CustomAvatar name={selectedUser.name} size={50} />
              <View style={styles.selectedUserDetails}>
                <Text style={styles.selectedUserName}>{selectedUser.name}</Text>
                <Text style={styles.selectedUserRole}>Rol: {selectedUser.role}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <CustomButton
            title="Modificar"
            onPress={handleModifyUser}
            style={styles.modifyButton}
            icon="create-outline"
          />
          
          <CustomButton
            title="Borrar"
            onPress={handleDeleteUser}
            style={styles.deleteButton}
            icon="trash-outline"
          />
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={handleBackPress}>
          <Ionicons name="exit-outline" size={24} color="#8BC34A" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton} onPress={handleHomePress}>
          <Ionicons name="home" size={28} color="#1976D2" />
        </TouchableOpacity>
      </View>

        <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
                <Image 
                    source={require('../../assets/images/GranjaHogarLogo.png')} 
                    style={{
                        width: 40,
                        height: 40,
                        resizeMode: 'contain'
                    }}
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
    padding: 16,
  },

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
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
  createButton: {
    backgroundColor: '#1976D2',
    marginBottom: 20,
  },

  avatar: {
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
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
    maxHeight: 300,
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
    color: '#1976D2',
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

  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 80,
    gap: 12,
  },
  modifyButton: {
    backgroundColor: '#1976D2',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    flex: 1,
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
  logoText: {
    marginLeft: 4,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4caf50',
  },
});

export default UsuariosForm;
