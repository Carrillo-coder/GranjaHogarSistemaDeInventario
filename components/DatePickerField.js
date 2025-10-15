import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';

export const DatePickerField = ({ label, value, onPress, formatDate, showPicker,
  onDateChange, disabled = false, placeholder = 'xx/xx/xxxx', style, ...props
}) => {
  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  return (
    <>
      <View style={[styles.dateField, style]}>
        <Text style={[styles.fieldLabel, disabled && styles.disabledLabel]}>{label}</Text>
        <TouchableOpacity 
          style={[
            styles.dateInput, 
            disabled && styles.dateInputDisabled
          ]} 
          onPress={handlePress}
          disabled={disabled}
        >
          <Text style={[
            styles.dateText, 
            value && styles.selectedDateText,
            disabled && styles.disabledText
          ]}>
            {value ? formatDate(value) : placeholder}
          </Text>
          <AntDesign 
            name="calendar" 
            size={16} 
            color={disabled ? "#ccc" : "#666"} 
          />
        </TouchableOpacity>
      </View>

      {showPicker && !disabled && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
          {...props}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  dateField: {
    flex: 0.48,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dateInput: {
    height: 48,
    borderColor: '#D0D0D0',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  dateInputDisabled: {
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
  dateText: {
    fontSize: 14,
    color: '#999',
  },
  selectedDateText: {
    color: '#333',
  },
});