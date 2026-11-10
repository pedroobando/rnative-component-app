import Ionicons from '@expo/vector-icons/Ionicons';
import { router, type Href } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { routeToPath, menuSections, type MenuRoute } from '@/constants/Routes';
import { useResolvedColor } from '@/hooks';

import { ThemedText } from '../ThemedText';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

/**
 * Menú de la app, mostrado dentro de la pantalla de inicio.
 *
 * Agrupa las rutas de `src/constants/Routes.ts` en secciones ("General",
 * "Componentes", "UI", "Animaciones") y navega con `router.push`.
 *
 * A diferencia del antiguo drawer, este componente sí vive dentro del árbol
 * de Uniwind, así que puede usar clases de Tailwind y `ThemedText`.
 */
export function AppMenu() {
  const textColor = useResolvedColor('text');
  const primaryColor = useResolvedColor('primary');

  const handlePress = (route: MenuRoute) => {
    router.push(routeToPath(route.name) as Href);
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-6 p-6 pb-12">
      {menuSections.map((section) => (
        <View key={section.title} className="gap-2">
          <ThemedText className="text-xs font-bold tracking-widest opacity-60">
            {section.title.toUpperCase()}
          </ThemedText>

          {section.routes.map((route) => (
            <Pressable
              key={route.name}
              onPress={() => handlePress(route)}
              className="flex-row items-center gap-3 rounded-2xl border border-border px-4 py-3"
            >
              <Ionicons name={route.icon as IoniconName} size={20} color={primaryColor} />

              <ThemedText textType="semi-bold" className="flex-1">
                {route.title}
              </ThemedText>

              <Ionicons name="chevron-forward" size={16} color={textColor} style={{ opacity: 0.4 }} />
            </Pressable>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
