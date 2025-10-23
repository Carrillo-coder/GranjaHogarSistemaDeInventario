import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Footer = ({ onLogout, onHomePress, logoSource }) => {
  const router = useRouter();

  const handleLogout = React.useCallback(async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("rol");

    console.log("Sesión cerrada, token y rol eliminados de AsyncStorage");
    
    if (typeof onLogout === "function") {
      onLogout();
    } else {
      router.replace('/');
    }
  }, [onLogout, router]);

  const handleHome = React.useCallback(async () => {
    if (typeof onHomePress === "function") {
      await AsyncStorage.getItem("rol").then((rol) => {
        router.replace('/main/' + (rol === 'Administrador' ? 'adminForm' : rol === 'Cocina' ? 'CocinaForm' : 'ComedorForm'));
      });
    }
  }, [onHomePress, router]);

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={handleLogout}
        accessibilityRole="button"
        accessibilityLabel="Cerrar Sesión"
      >
        <Ionicons name="exit-outline" size={28} color="#8BC34A" />
      </TouchableOpacity>

      <View style={styles.logoWrapper}>
        <Image
          source={logoSource ?? require("../assets/images/GranjaHogarLogo.png")}
          style={styles.logoImage}
        />
      </View>

      <TouchableOpacity
        style={styles.navButton}
        onPress={handleHome}
        accessibilityRole="button"
        accessibilityLabel="Inicio"
      >
        <Ionicons name="home" size={28} color="#1976D2" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  navButton: { padding: 8 },
  logoWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  logoImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});

export default Footer;