import 'expo-router/entry'
import {useRouter, useLocalSearchParams} from 'expo-router';
import React, { useState, useEffect } from 'react';
import {View, StyleSheet, StatusBar, SafeAreaView, ScrollView, Text, TouchableOpacity, Pressable, Image, Modal, TextInput} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../../components/Footer';
import { LoteVO } from '../../valueobjects/LoteVO';

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

  const [selectedLote, setSelectedLote] = useState(null);
  const [showLoteList, setShowLoteList] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [provider, setProvider] = useState('');
  const [notes, setNotes] = useState('');
  const [lotes, setLotes] = useState([
    new LoteVO({ idLote: 1, cantidad: 10, caducidad: '21-10-2025', idProducto: 101, nombre: 'Arroz' }),
    new LoteVO({ idLote: 2, cantidad: 5, caducidad: '01-11-2025', idProducto: 102, nombre: 'Zucaritas' }),
    // new LoteVO({ idLote: 3, cantidad: 20, caducidad: '15-12-2025', idProducto: 103, nombre: 'Leche' })
  ]);
  const params = useLocalSearchParams();
  const loteParam = params.lote;

  useEffect(() => {
    if (!loteParam) return;
    try {
      // loteParam expected to be encoded JSON
      const parsed = JSON.parse(decodeURIComponent(loteParam));
      const newLote = LoteVO.fromApi(parsed);
      setLotes(prev => {
        if (newLote.idLote == null) return [...prev, newLote];
        if (prev.some(l => l.idLote === newLote.idLote)) return prev;
        return [...prev, newLote];
      });
    } catch (e) {
      console.warn('Failed parsing lote param', e);
    }
  }, [loteParam]);

  const handleCreateProduct = () => {
    console.log('Crear producto');
    router.navigate('/inventario/CrearProductoForm');
  };

  const handleConfirmPress = () => {
    if (selectedLote) {
      setModalVisible(true);
    } else {
      alert('Agrega un lote para continuar');
    }
  };

  const handleConfirm = () => {
    console.log('Registro de lote:', selectedLote);
    console.log('Proveedor:', provider);
    console.log('Notas:', notes);
    setModalVisible(false);
    router.navigate('/entrada/RegistrarEntradaForm');
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

  const handleHomePress = () => {
    console.log('Ir a inicio');
    router.navigate('/');
  };

  const handleBackPress = () => {
    console.log('Volver atrás');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#04538A" barStyle="light-content" />

      <ConfirmationModal
        visible={modalVisible}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message="¿Estás seguro que quieres continuar?"
      />

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
              {selectedLote
                ? (selectedLote.nombre || `Lote #${selectedLote.idLote ?? selectedLote.idProducto}`)
                : "Resumen de entrada"}
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
                  <CustomAvatar name={lote.nombre || String(lote.idProducto ?? lote.idLote ?? '')} size={35} />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{lote.nombre || `Lote ${lote.idLote ?? idx}`}</Text>
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
              <CustomAvatar name={selectedLote.nombre || String(selectedLote.idProducto ?? selectedLote.idLote)} size={50} />
              <View style={styles.selectedUserDetails}>
                <Text style={styles.selectedUserName}>{selectedLote.nombre || `Lote ${selectedLote.idLote ?? ''}`}</Text>
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
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 14,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
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

// ¿Qué es mejor hacer primero? Construir los proxys necesarios en base a los endpoints del backend de POST entradas y POST lote, o integrar el loteVO y realizar ajustes en la lógica del formulario para que utilice los loteVO que va recibiendo desde el backend y finalmente enviarlos a la base de datos cuando se le de confirmar?
// // Mi recomendación es integrar primero el LoteVO en la lógica del formulario. Esto te permitirá asegurarte de que los datos que estás manejando en el frontend están correctamente estructurados y validados antes de enviarlos al backend. Una vez que tengas el LoteVO funcionando correctamente en el formulario, puedes proceder a construir los proxys para los endpoints de POST entradas y POST lote, sabiendo que los datos que enviarás estarán en el formato correcto. Esto también facilitará la depuración y el mantenimiento del código a largo plazo.
// Vale, muchas gracias. 

// 