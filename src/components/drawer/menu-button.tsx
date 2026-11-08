import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router';
import { DrawerActions } from 'expo-router/react-navigation';
import { Pressable } from 'react-native';

type MenuButtonProps = {
  /** Color del icono. Por defecto toma el tinte del header. */
  tintColor?: string;
};

/**
 * Botón de la esquina superior izquierda del header.
 *
 * Abre/cierra el menú lateral despachando la acción del drawer.
 */
export function MenuButton({ tintColor }: MenuButtonProps) {
  const navigation = useNavigation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Abrir menú"
      hitSlop={12}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
    >
      <Ionicons name="menu" size={26} color={tintColor} />
    </Pressable>
  );
}
