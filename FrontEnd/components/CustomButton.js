import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Si quieres íconos opcionales

const CustomButton = ({ title, onPress, style, icon, disabled }) => {
  return (
    <TouchableOpacity style={[styles.button, style, disabled ? styles.buttonDisabled : null]} onPress={disabled ? null : onPress}>
      <View style={styles.content}>
        {icon ? <MaterialIcons name={icon} size={20} color="white" style={styles.icon}/> : null}
        <Text style={[styles.text, disabled ? styles.textDisabled : null]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#04538A",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    backgroundColor: "#A9A9A9",
  },
  textDisabled: {
    color: "#E0E0E0",
  },
});