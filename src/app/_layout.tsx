import { ThemeProvider } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAppNavigationTheme } from '@/hooks/use-app-navigation-theme';
import { useThemeColor } from '@/hooks/use-theme-color';

import { AppDrawerContent } from '@/components/drawer/app-drawer-content';
import { MenuButton } from '@/components/drawer/menu-button';

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
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ backgroundColor: backgroundColor, flex: 1 }}>
      <ThemeProvider value={navigationTheme}>
        {/* El layout raíz define el navegador de pantallas.
          Es un Drawer (menu lateral): el icono de la esquina superior izquierda
          lo abre y se puede deslizar con el dedo desde el borde.
          Cada archivo de src/app/ es una ruta: index.tsx -> "/" */}
        <Drawer
          screenOptions={{
            // Header
            headerStyle: { backgroundColor },
            headerTintColor: textColor,
            headerTitleStyle: { color: textColor },
            headerTitleAlign: 'left',
            headerShadowVisible: false,
            headerLeft: () => <MenuButton tintColor={textColor} />,

            // Contenido de las pantallas
            sceneStyle: { backgroundColor },

            // Menu lateral
            drawerStyle: { backgroundColor },
            drawerActiveTintColor: '#ffffff',
            drawerInactiveTintColor: textColor,
            drawerActiveBackgroundColor: primaryColor,
            drawerLabelStyle: { fontWeight: '600' },
          }}
          drawerContent={(props) => (
            <AppDrawerContent
              {...props}
              colors={{
                background: backgroundColor ?? '#ffffff',
                primary: primaryColor ?? '#49129c',
                text: textColor ?? '#000000',
                border: borderColor ?? '#e2e2e6',
              }}
            />
          )}
        >
          {homeMenuRoutes.map((route) => (
            <Drawer.Screen
              key={route.name}
              name={route.name}
              options={{ title: route.title, drawerLabel: route.title }}
            />
          ))}

          {allRoutes.map((route) => (
            <Drawer.Screen
              key={route.name}
              name={route.name}
              options={{ title: route.title, drawerLabel: route.title }}
            />
          ))}
        </Drawer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
