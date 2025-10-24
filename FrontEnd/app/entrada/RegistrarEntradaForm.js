import 'expo-router/entry'
import {useRouter, useLocalSearchParams} from 'expo-router';
import React, { useState, useEffect } from 'react';
import {View, StyleSheet, StatusBar, SafeAreaView, ScrollView, Text, TouchableOpacity, Pressable, Image, Modal, TextInput}from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../../components/Footer';
import { LoteVO } from '../../valueobjects/LoteVO';
import useLotes from '../../hooks/useLotes';
import useEntradas from '../../hooks/useEntradas';

const CustomAvatar = ({ name, size = 40 }) => {
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '';
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

const ConfirmationModal = ({ visible, onConfirm, onCancel, message }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{message}</Text>
          <View style={styles.modalButtons}>
            <CustomButton title="No" onPress={onCancel} style={[styles.modalButton, styles.cancelButtonModal]} />
            <CustomButton title="Sí" onPress={onConfirm} style={[styles.modalButton, styles.confirmButtonModal]} />
          </View>
        </View>
      </View>
    </Modal>
  );
};


const RegistrarEntradaForm = () => {
  const router = useRouter();
  console.log('RegistrarEntradaForm render');

  const getLoteDisplayName = (lote) => {
    if (!lote) return '';
    return (
      lote.nombre ??
      (lote.producto && lote.producto.nombre) ??
      lote.nombreProducto ??
      (lote.idProducto ? `Producto ${lote.idProducto}` : (lote.idLote ? `Lote ${lote.idLote}` : 'Lote'))
    );
  };

  const [selectedLote, setSelectedLote] = useState(null);
  const [showLoteList, setShowLoteList] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [provider, setProvider] = useState('');
  const [notes, setNotes] = useState('');
  const [lotes, setLotes] = useState([
    // new LoteVO({ idLote: 1, cantidad: 10, caducidad: '21-10-2025', idProducto: 101, nombre: 'Arroz' }),
    // new LoteVO({ idLote: 2, cantidad: 5, caducidad: '01-11-2025', idProducto: 102, nombre: 'Zucaritas' }),
    // new LoteVO({ idLote: 3, cantidad: 20, caducidad: '15-12-2025', idProducto: 103, nombre: 'Leche' })
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { createLote } = useLotes();
  const { createEntrada } = useEntradas();
  const params = useLocalSearchParams();
  const loteParam = params.lote;

useEffect(() => {
  if (params.lote) {
    try {
      const nuevoLote = JSON.parse(params.lote);
      setLotes((prevLotes) => [...prevLotes, nuevoLote]); // acumula los lotes
      console.log('Lote agregado desde params:', nuevoLote);
      console.log('Lotes actuales:', [...lotes, nuevoLote]);
    } catch (error) {
      console.error('Error al parsear lote recibido:', error);
    }
  }
}, [params.lote]);



  const handleCreateProduct = () => {
    console.log('Crear producto');
    // Redirect to the AgregarProductoForm screen under the entrada folder
    router.navigate('/entrada/AgregarProductoForm');
  };

  const handleConfirmPress = () => {
    // allow confirming if there is at least one lote in the list
    if (Array.isArray(lotes) && lotes.length > 0) {
      setModalVisible(true);
      // ensure list is visible so user can see what's being sent
      setShowLoteList(true);
    } else {
      alert('Agrega un lote para continuar');
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    setModalVisible(false);
    
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleLoteSelect = (lote) => {
    setSelectedLote(lote);
  };

  const toggleLoteList = () => {
    setShowLoteList(!showLoteList);
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />

      <ConfirmationModal
        visible={modalVisible}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={loading ? "Enviando..." : "¿Estás seguro que quieres continuar?"}
      />
      {error ? (
        <View style={{ padding: 10, backgroundColor: '#ffd2d2', borderRadius: 8, margin: 10 }}>
          <Text style={{ color: '#b71c1c' }}>{error}</Text>
        </View>
      ) : null}

      <ScrollView style={styles.content}>
        <CustomButton
          title="Agregar producto"
          onPress={handleCreateProduct}
          style={styles.createButton}
          icon="add-circle-outline"
        />

        <View style={styles.userListCard}>
          <TouchableOpacity 
            style={styles.userListHeader} 
            onPress={toggleLoteList}
          >
            <Ionicons name="cube" size={20} color="#666" style={styles.listIcon} />
            <Text style={styles.userListTitle}>
              {selectedLote ? getLoteDisplayName(selectedLote) : "Resumen de entrada"}
            </Text>
            <Ionicons 
              name={showLoteList ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
          {showLoteList && (
            <View style={styles.userList}>
              {lotes.map((lote, idx) => (
                <Pressable
                  key={lote.idLote ?? idx}
                  onPress={() => handleLoteSelect(lote)}
                  style={[
                    styles.userItem,
                    selectedLote?.idLote === lote.idLote && styles.selectedUserItem
                  ]}
                >
                  <CustomAvatar name={getLoteDisplayName(lote)} size={35} />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{getLoteDisplayName(lote)}</Text>
                    <Text style={styles.userRole}>Cantidad: {lote.cantidad ?? '-'}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#999" />
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {selectedLote && (
          <View style={styles.selectedUserCard}>
            <Text style={styles.selectedUserTitle}>Lote Seleccionado</Text>
            <View style={styles.divider} />
            <View style={styles.selectedUserInfo}>
              <CustomAvatar name={getLoteDisplayName(selectedLote)} size={50} />
              <View style={styles.selectedUserDetails}>
                <Text style={styles.selectedUserName}>{getLoteDisplayName(selectedLote)}</Text>
                <Text style={styles.selectedUserRole}>ID Producto: {selectedLote.idProducto ?? '-'}</Text>
                <Text style={styles.selectedUserRole}>Cantidad: {selectedLote.cantidad ?? '-'}</Text>
                <Text style={styles.selectedUserRole}>Caducidad: {selectedLote.caducidad ?? '-'}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Campos adicionales: Proveedor y Notas */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Proveedor:</Text>
          <TextInput
            value={provider}
            onChangeText={setProvider}
            placeholder="Nombre del proveedor"
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Notas:</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notas adicionales"
            style={[styles.textInput, styles.notesInput]}
            multiline={true}
            numberOfLines={3}
          />
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <CustomButton
            title="Confirmar"
            onPress={handleConfirmPress}
            style={styles.confirmButton}
            icon="checkmark-circle-outline"
          />
        </View>
      </ScrollView>
      <Footer
        onLogOutPress={() => router.replace('/')}
        onHomePress={() => router.replace('/main/adminForm')}
      />
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#04538A',
    marginBottom: 20,
  },

  avatar: {
    backgroundColor: '#04538A',
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
  confirmButton: {
    backgroundColor: '#8BC34A',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 10,
  },
  confirmButtonModal: {
    backgroundColor: '#04538A',
  },
  cancelButtonModal: {
    backgroundColor: '#8e1c1cff',
  },
});

export default RegistrarEntradaForm;

