import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Footer = ({ onBackPress, onHomePress, logoSource }) => {
  const router = useRouter();

  const handleBack = React.useCallback(() => {
    if (typeof onBackPress === "function") return onBackPress();
    router.back();
  }, [onBackPress, router]);

  const handleHome = React.useCallback(() => {
    if (typeof onHomePress === "function") return onHomePress();
    // Ajusta navigate/push/replace según tu flujo
    router.replace("/index");
  }, [onHomePress, router]);

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={handleBack}
        accessibilityRole="button"
        accessibilityLabel="Volver"
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
    width: "100%",
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
    paddingVertical: 4,
  },
  logoImage: { width: 40, height: 40, resizeMode: "contain" },
});

export default Footer;
