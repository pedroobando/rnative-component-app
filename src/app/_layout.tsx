import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAppNavigationTheme } from '@/hooks/use-app-navigation-theme';
import { useThemeColor } from '@/hooks/use-theme-color';

import { allRoutes } from '@/constants/Routes';
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
        {/* El layout raíz solo define el navegador de pantallas.
          Cada archivo de src/app/ es una ruta: index.tsx -> "/" */}
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor },
            headerStyle: { backgroundColor },
            headerTintColor: textColor,
            headerTitleStyle: { color: textColor },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Inicio' }} />
          <Stack.Screen name="about" options={{ title: 'Acerca de' }} />

          {allRoutes.map((route) => (
            <Stack.Screen key={route.name} name={route.name} options={{ title: route.title }} />
          ))}
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
