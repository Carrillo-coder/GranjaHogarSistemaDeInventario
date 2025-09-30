import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

export const CustomDropdown = ({ label, data, value, onValueChange,
    placeholder, isFocused, onFocus, onBlur, disabled = false, style, ...props
}) => {
    const handleFocus = () => {
        if (!disabled && onFocus) {
            onFocus();
        }
    };

    const handleBlur = () => {
        if (!disabled && onBlur) {
            onBlur();
        }
    };

    const handleChange = (item) => {
        if (!disabled) {
            onValueChange(item.value);
            onBlur();
        }
    };

    return (
        <View style={[styles.fieldContainer, style]}>
            <Text style={[styles.fieldLabel, disabled && styles.disabledLabel]}>{label}</Text>
            <Dropdown
                style={[
                    styles.dropdown, 
                    isFocused && !disabled && styles.dropdownFocused,
                    disabled && styles.dropdownDisabled
                ]}
                placeholderStyle={[styles.placeholderStyle, disabled && styles.disabledText]}
                selectedTextStyle={[styles.selectedTextStyle, disabled && styles.disabledText]}
                iconStyle={styles.iconStyle}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={placeholder}
                value={value}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                disable={disabled}
                renderRightIcon={() => (
                    <AntDesign style={styles.dropdownIcon} color={disabled ? "#ccc" : "black"} name="down" size={16}/>
                )}
                {...props}
            />
        </View>
    );
};

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
    dropdown: {
        height: 48,
        borderColor: '#D0D0D0',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 12,
        backgroundColor: 'white',
    },
    dropdownFocused: {
        borderColor: '#2196F3',
    },
    dropdownDisabled: {
        backgroundColor: '#f5f5f5',
        borderColor: '#e0e0e0',
        opacity: 0.6,
    },
    disabledLabel: {
        color: '#999',
    },
    disabledText: {
        color: '#ccc',
    },
    dropdownIcon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 14,
        color: '#666',
    },
    selectedTextStyle: {
        fontSize: 14,
        color: '#333',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
});