import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import '@/global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* El layout raíz solo define el navegador de pantallas.
          Cada archivo de src/app/ es una ruta: index.tsx -> "/" */}
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Inicio' }} />
        <Stack.Screen name="about" options={{ title: 'Acerca de' }} />
      </Stack>
    </ThemeProvider>
  );
}
