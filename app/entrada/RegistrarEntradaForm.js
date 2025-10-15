import 'expo-router/entry'
import {useRouter} from 'expo-router';
import React, { useState } from 'react';
import {View, StyleSheet, StatusBar, SafeAreaView, ScrollView, Text, TouchableOpacity, Pressable, Image, Modal} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../../components/Footer';

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

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductList, setShowProductList] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [products] = useState([
    { id: 1, producto: 'Arroz', presentacion: 'Bolsa 1kg', categoria: 'Granos', cantidadExistente: 50, fechaCaducidad: '2025-12-31' },
    { id: 2, producto: 'Zucaritas', presentacion: 'Caja 500g', categoria: 'Cereales', cantidadExistente: 30, fechaCaducidad: '2025-11-30' },
    { id: 3, producto: 'Leche', presentacion: 'Caja 1L', categoria: 'Lácteos', cantidadExistente: 20, fechaCaducidad: '2025-10-31' },
  ]);

  const handleCreateProduct = () => {
    console.log('Crear producto');
    router.navigate('/inventario/CrearProductoForm');
  };

  const handleConfirmPress = () => {
    if (selectedProduct) {
      setModalVisible(true);
    } else {
      alert('Agrega un producto para continuar');
    }
  };

  const handleConfirm = () => {
    console.log('Registro de producto:', selectedProduct);
    setModalVisible(false);
    router.navigate('/entrada/RegistrarEntradaForm');
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const toggleProductList = () => {
    setShowProductList(!showProductList);
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
            onPress={toggleProductList}
          >
            <Ionicons name="cube" size={20} color="#666" style={styles.listIcon} />
            <Text style={styles.userListTitle}>
              {selectedProduct ? selectedProduct.producto : "Resumen de entrada"}
            </Text>
            <Ionicons 
              name={showProductList ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>

          {showProductList && (
            <View style={styles.userList}>
              {products.map((product) => (
                <Pressable
                  key={product.id}
                  onPress={() => handleProductSelect(product)}
                  style={[
                    styles.userItem,
                    selectedProduct?.id === product.id && styles.selectedUserItem
                  ]}
                >
                  <CustomAvatar name={product.producto} size={35} />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{product.producto}</Text>
                    <Text style={styles.userRole}>{product.categoria}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#999" />
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {selectedProduct && (
          <View style={styles.selectedUserCard}>
            <Text style={styles.selectedUserTitle}>Producto Seleccionado</Text>
            <View style={styles.divider} />
            <View style={styles.selectedUserInfo}>
              <CustomAvatar name={selectedProduct.producto} size={50} />
              <View style={styles.selectedUserDetails}>
                <Text style={styles.selectedUserName}>{selectedProduct.producto}</Text>
                <Text style={styles.selectedUserRole}>Presentación: {selectedProduct.presentacion}</Text>
                <Text style={styles.selectedUserRole}>Categoría: {selectedProduct.categoria}</Text>
                <Text style={styles.selectedUserRole}>Cantidad: {selectedProduct.cantidadExistente}</Text>
                <Text style={styles.selectedUserRole}>Caducidad: {selectedProduct.fechaCaducidad}</Text>
              </View>
            </View>
          </View>
        )}

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
