import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomDropdown = ({ label, data, value, onValueChange, placeholder, disabled = false, style, }) => {
    const [showList, setShowList] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const toggleList = () => {
        if (!disabled) {
            setShowList(!showList);
            setIsFocused(!showList);
        }
    };

    const handleSelect = (item) => {
        onValueChange(item.value);
        setShowList(false);
        setIsFocused(false);
    };

    return (
        <View style={[styles.fieldContainer, style]}>
            <Text style={[styles.fieldLabel, disabled && styles.disabledLabel]}>{label}</Text>
            <TouchableOpacity
                style={[
                    styles.inputBox,
                    isFocused && !disabled && styles.inputBoxFocused,
                    disabled && styles.inputBoxDisabled,
                ]}
                onPress={toggleList}
   
            >
                <Text
                    style={[value ? styles.selectedText : styles.placeholderText, disabled && styles.disabledPlaceholder]}
                    numberOfLines={1}
                >
                    {value
                        ? data.find((item) => item.value === value)?.label
                        : placeholder || 'Selecciona una opción...'}
                </Text>
                <Ionicons
                    name={showList ? "chevron-up-outline" : "chevron-down-outline"}
                    size={20}
                    color={disabled ? "#ccc" : "#000"}
                />
            </TouchableOpacity>

            {showList && (
                <View style={styles.dropdownList}>
                    {data.map((item) => (
                        <Pressable
                            key={item.value}
                            onPress={() => handleSelect(item)}
                            style={[
                                styles.dropdownItem,
                                value === item.value && styles.selectedItem,
                            ]}
                        >
                            <Text style={styles.itemText}>{item.label}</Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
};

export default CustomDropdown;

const styles = StyleSheet.create({
    fieldContainer: {
        marginBottom: 20,
    },
    fieldLabel: {
        fontSize: 16, 
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
    },
    inputBoxFocused: {
        borderColor: '#04538A',
        backgroundColor: '#c6dded84',
    },
    inputBoxDisabled: {
        backgroundColor: '#f5f5f5',
        borderColor: '#e0e0e0',
        opacity: 0.6,
    },
    selectedText: {
        fontSize: 16,
        color: '#000',
    },
    placeholderText: {
        fontSize: 16,
        color: '#999',
    },
    disabledPlaceholder: {
        color: '#ccc',
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderTopWidth: 0,
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 2,
        backgroundColor: '#fff',
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    selectedItem: {
        backgroundColor: '#c6dded84',
    },
    itemText: {
        fontSize: 16,
    },
    disabledLabel: {
        color: '#999',
    },
});