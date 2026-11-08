import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useThemeColor } from '@/hooks/use-theme-color';

import '@/global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // Color de fondo: usa el valor del tema (--color-background).
  // También puedes pasar colores: useThemeColor({ light: 'red', dark: 'indigo' }, 'background')
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ backgroundColor: backgroundColor, flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* El layout raíz solo define el navegador de pantallas.
          Cada archivo de src/app/ es una ruta: index.tsx -> "/" */}
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Inicio' }} />
          <Stack.Screen name="about" options={{ title: 'Acerca de' }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
