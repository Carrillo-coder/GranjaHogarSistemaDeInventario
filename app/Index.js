// app/index.jsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import 'expo-router/entry'
import { router } from 'expo-router'; 

export default function LoginScreen() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');


  const handleLogin = () => {
    if (usuario && contrasena) {
      Alert.alert('Inicio de Sesión Exitoso', 'Redirigiendo a la pantalla principal...');
      if (usuario == "admin"){
        router.replace('/main/adminForm')
      }
      else if(usuario == "cocina"){
        router.replace('/main/CocinaForm')
      }
      else if(usuario == "comdedor"){
        router.replace('/main/ComdedorForm')

      }

    } else {
      Alert.alert('Error', 'Por favor, introduce tu usuario y contraseña.');
    }
  };

  return (
    <View style={styles.container}>
      

      <View style={styles.logoContainer}>
       
        <Image 
          source={require('../assets/images/GranjaHogarLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>GRANJA HOGAR</Text>
      </View>
      

      <View style={styles.formContainer}>
        
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
        />
        
 
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={contrasena}
          onChangeText={setContrasena}
        />
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
          activeOpacity={0.7}
        >
            <Text style={styles.buttonText}>Iniciar sesión</Text>
            <Text style={styles.arrowIcon}>»</Text> 
            <Text style={styles.arrowIcon}>»</Text>

        </TouchableOpacity>
        
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by</Text>
        <Text style={styles.footerText}>Tecnológico de Monterrey</Text>
        <Text style={styles.footerText}>©ITESM 2025</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingVertical: 50, 
  },
  

  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  logo: {
    width: 150, 
    height: 150, 
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#04538A', 
    marginBottom: 50,
  },
  
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 25, 
    fontSize: 18,
  },
  

  button: {
    width: '60%',
    height: 55,
    borderRadius: 30, 
    backgroundColor: '#04538A', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 5,
  },
  arrowIcon: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: -5, 
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto', 
  },
  footerText: {
    fontSize: 12,
    color: 'gray',
  },
});
