const CustomInput = ({ placeholder, value, onChangeText, secureTextEntry, style }) => {
  return (
    <View style={[styles.inputContainer, style]}>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#666"
      />
    </View>
  );
};
