import 'expo-router/entry'
import { StyleSheet, View } from 'react-native';

import {useRouter} from 'expo-router';
import { Button, Stack as MaterialStack, Text, TextInput } from "@react-native-material/core";
import { router } from 'expo-router'; 


export default function loginPage() {
    const router = useRouter();
    
    
    return (
        <MaterialStack>
            <View style={styles.buttonContainer}>
               <Button title="Go to Login" style={styles.formButton} onPress={() => router.replace('/')} />;
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
