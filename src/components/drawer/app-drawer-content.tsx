import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter, type Href } from 'expo-router';
import { DrawerItem, type DrawerContentComponentProps } from 'expo-router/drawer';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { routeToPath, drawerSections, type MenuRoute } from '@/constants/Routes';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export type DrawerColors = {
  background: string;
  primary: string;
  text: string;
  border: string;
};

type AppDrawerContentProps = DrawerContentComponentProps & {
  /** Colores del tema activo (los resuelve el layout raíz). */
  colors: DrawerColors;
};

/**
 * Contenido del menú lateral (drawer).
 *
 * Se pinta a mano (en vez de usar el `DrawerItemList` por defecto) para poder
 * agrupar las rutas en secciones ("General", "Componentes", "UI", "Animaciones")
 * y aplicar los colores del tema activo.
 *
 * Los colores se reciben por props porque el contenido del drawer se renderiza
 * fuera del árbol de Uniwind: leerlos aquí con `useThemeColor` devolvería
 * `undefined` y el texto quedaría invisible.
 */
export function AppDrawerContent({ navigation, state, colors }: AppDrawerContentProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { background, primary, text, border } = colors;

  // Ruta que está visible ahora mismo (para marcar el ítem activo).
  const focusedRouteName = state.routes[state.index]?.name;

  const handlePress = (route: MenuRoute) => {
    router.push(routeToPath(route.name) as Href);
    navigation.closeDrawer();
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View
        style={[
          styles.header,
          {
            borderBottomColor: border,
            // Respeta la zona segura (notch / status bar) para que la cabecera
            // quede a la misma altura que el boton que abre el menu.
            paddingTop: insets.top + 8,
          },
        ]}
      >
        <View style={[styles.logo, { backgroundColor: primary }]}>
          <Ionicons name="rocket-outline" size={22} color="#ffffff" />
        </View>

        <View style={styles.headerText}>
          <Text style={[styles.title, { color: text }]}>Component App</Text>
          <Text style={[styles.subtitle, { color: text }]}>Curso de React Native</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {drawerSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>{section.title.toUpperCase()}</Text>

            {section.routes.map((route) => {
              const focused = focusedRouteName === route.name;

              return (
                <DrawerItem
                  key={route.name}
                  label={route.title}
                  focused={focused}
                  onPress={() => handlePress(route)}
                  activeTintColor="#ffffff"
                  inactiveTintColor={text}
                  activeBackgroundColor={primary}
                  inactiveBackgroundColor="transparent"
                  labelStyle={styles.label}
                  icon={({ color, size }) => (
                    <Ionicons name={route.icon as IoniconName} size={size} color={color as string} />
                  )}
                />
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  content: {
    paddingTop: 12,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    opacity: 0.5,
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
