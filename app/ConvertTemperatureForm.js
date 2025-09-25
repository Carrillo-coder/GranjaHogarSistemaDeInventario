import { StyleSheet, View } from 'react-native';

import { Button, Stack as MaterialStack, Text, TextInput } from "@react-native-material/core";

import useTemperatureConverter from '../hooks/useTemperatureConverterter';

export default function ConvertTemperatureForm() {
    const { celsius, setCelsius, fahrenheit, convertTemperature } = useTemperatureConverter();

    return (
        <MaterialStack>
            <View style={styles.headline}>
                <Text variant="h6">Convertidor de Temperaturas</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text variant="body1" style={styles.fieldLabel}>Grados Celsius:</Text>
                <TextInput variant="standard" value={celsius} onChangeText={(text) => setCelsius(text)} />
            </View>
            <View style={styles.inputContainer}>
                <Text variant="body1" style={styles.fieldLabel}>Grados Fahrenheit:</Text>
                <View style={styles.resultContainer}>
                    <Text style={styles.resultLabel}>{fahrenheit}</Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Button title="CONVERTIR" style={styles.formButton} onPress={convertTemperature} />
            </View>
        </MaterialStack>
    )
}

const styles = StyleSheet.create({
    headline: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginTop: 20,
        marginRight: 10,
        marginLeft: 10,
        fontSize: 15,
    },
    resultContainer: {
        marginTop: 30,
        borderBottomColor: '#999999',
        borderBottomWidth: 2,
    },
    buttonContainer: {
        marginTop: 20,
        marginRight: 80,
        marginLeft: 80,
    },
    fieldLabel: {
        color: '#666666',
    },
    resultLabel: {
        color: '#000000',
    },
    formButton: {
        shadowOffset: 0,
    }
});
