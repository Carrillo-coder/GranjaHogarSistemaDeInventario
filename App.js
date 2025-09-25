import { SafeAreaView, StyleSheet } from 'react-native';
import { AppBar } from "@react-native-material/core";
import ConvertTemperatureForm from './app/ConvertTemperatureForm'

export default function App() {
  return (
    <SafeAreaView spacing={5} style={styles.container}>
      <AppBar title="Convertidor" />
      <ConvertTemperatureForm/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});