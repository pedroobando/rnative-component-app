import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemedAlertProvider, useAppNavigationTheme, useThemeColor } from '@/hooks';

import { allRoutes, homeMenuRoutes } from '@/constants/Routes';
import '@/global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Tema de navegación (Expo Router) sincronizado con los tokens de Uniwind
  const navigationTheme = useAppNavigationTheme();

  // Color de fondo: usa el valor del tema (--color-background).
  // También puedes pasar colores: useThemeColor({ light: 'red', dark: 'indigo' }, 'background')
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ backgroundColor: backgroundColor, flex: 1 }}>
      <ThemeProvider value={navigationTheme}>
        <ThemedAlertProvider>
          {/* El layout raíz define el navegador de pantallas.
            Es un Stack: cada archivo de src/app/ es una ruta (index.tsx -> "/")
            y el menú de secciones vive dentro de la pantalla de inicio. */}
          <Stack
            screenOptions={{
              // Header
              headerStyle: { backgroundColor },
              headerTintColor: textColor,
              headerTitleStyle: { color: textColor },
              headerTitleAlign: 'left',
              headerShadowVisible: false,

              // Contenido de las pantallas
              contentStyle: { backgroundColor },
            }}
          >
            <Stack.Screen name="index" options={{ title: 'Menú' }} />

            {homeMenuRoutes
              .filter((route) => route.name !== 'index')
              .map((route) => (
                <Stack.Screen
                  key={route.name}
                  name={route.name}
                  options={{ title: route.title }}
                />
              ))}

            {allRoutes.map((route) => (
              <Stack.Screen
                key={route.name}
                name={route.name}
                options={{ title: route.title }}
              />
            ))}
          </Stack>
        </ThemedAlertProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
