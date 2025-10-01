import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Footer = ({ onLogOutPress, onHomePress }) => {
  return (
    <>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={onLogOutPress}>
          <Ionicons name="exit-outline" size={24} color="#8BC34A" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={onHomePress}>
          <Ionicons name="home" size={28} color="#1976D2" />
        </TouchableOpacity>
      </View>

      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Image
            source={require("../assets/images/GranjaHogarLogo.png")}
            style={styles.logoImage}
          />
        </View>
      </View>
    </>
  );
};

export default Footer;

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    elevation: 8,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navButton: {
    alignItems: "center",
    padding: 8,
  },
  logoContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  logoPlaceholder: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  logoImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});
