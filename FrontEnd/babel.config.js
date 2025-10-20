module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "expo-router/babel",
      ["module:react-native-dotenv", {
        moduleName: "@env",
        path: ".env",
        allowUndefined: true
      }]
    ]
  };
};
