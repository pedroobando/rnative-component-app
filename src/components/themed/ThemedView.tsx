import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useResolvedColor } from '@/hooks';

export type ThemedViewEdge = 'top' | 'bottom' | 'left' | 'right';

export type ThemedViewProps = ViewProps & {
  /** Clases de Tailwind/Uniwind (ej. "flex-1 rounded-2xl bg-background p-4"). */
  className?: string;
  /** Aplica un margen exterior estándar (16). */
  margin?: boolean;
  /**
   * Aplica el padding de las safe areas (notch, status bar, home indicator).
   * Por defecto omite 'top' porque el header de Expo Router ya reserva ese
   * espacio (si lo pones, el contenido baja de más).
   */
  safe?: boolean;
  /** Insets concretos a aplicar cuando `safe` está activo. */
  edges?: ThemedViewEdge[];
  /**
   * Color de fondo. Acepta un token del tema ('primary', 'background', 'text'...)
   * o un color literal ('#ff0000', 'red'). Si se omite, no se fuerza ninguno.
   */
  bgColor?: string;
};

const SPACING = 16;
const DEFAULT_EDGES: ThemedViewEdge[] = ['bottom', 'left', 'right'];

export const ThemedView = ({
  style,
  className,
  margin = false,
  safe = false,
  edges = DEFAULT_EDGES,
  bgColor,
  children,
  ...rest
}: ThemedViewProps) => {
  const insets = useSafeAreaInsets();
  const backgroundColor = useResolvedColor(bgColor);

  return (
    <View
      {...rest}
      className={className}
      style={[
        margin && { margin: SPACING },
        safe && {
          ...(edges.includes('top') ? { paddingTop: insets.top } : null),
          ...(edges.includes('bottom') ? { paddingBottom: insets.bottom } : null),
          ...(edges.includes('left') ? { paddingLeft: insets.left } : null),
          ...(edges.includes('right') ? { paddingRight: insets.right } : null),
        },
        backgroundColor ? { backgroundColor } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
};
