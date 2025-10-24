import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';

const ConfirmationModal = ({ visible, message, onConfirm, onCancel }) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="No"
              onPress={onCancel}
              style={[styles.button, styles.cancelButton]}
            />
            <CustomButton
              title="Sí"
              onPress={onConfirm}
              style={[styles.button, styles.confirmButton]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default ConfirmationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    //elevation: 4,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    //color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    elevation: 2,
  },
  confirmButton: {
    backgroundColor: '#8BC34A',
  },
  cancelButton: {
    backgroundColor: '#8e1c1c',
  },
});