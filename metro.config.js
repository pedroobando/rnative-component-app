const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withUniwindConfig(config, {
  cssEntryFile: './src/global.css',
  dtsFile: './src/uniwind-types.d.ts',
  // Temas propios de la app (definidos como @variant en src/global.css).
  // Sin esto, Uniwind.setTheme('ocean') fallaría con "theme not registered".
  extraThemes: ['ocean', 'emerald', 'orange', 'tokyo'],
});
