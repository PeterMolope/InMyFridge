// // metro.config.js
// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");

// // Windows-safe: just use __dirname with CommonJS
// const config = getDefaultConfig(__dirname);

// module.exports = withNativeWind(config, {
//   input: "./global.css", // your Tailwind entry file
// });
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { pathToFileURL } = require("url");

const config = getDefaultConfig(pathToFileURL(__dirname));

module.exports = withNativeWind(config, { input: "./global.css" });
