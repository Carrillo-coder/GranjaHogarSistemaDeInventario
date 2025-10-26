module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-paper|@react-native|@react-native-async-storage|expo-router|@react-navigation|expo|@expo)/)',
  ],
};