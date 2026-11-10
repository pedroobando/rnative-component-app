import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { useResolvedColor } from '@/hooks';
import { getContrastingColor, isDarkColor } from '@/utils/contrast';

import { ThemedText } from './ThemedText';

export interface ThemedButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  /** Contenido del botón. */
  children?: ReactNode;
  className?: string;
  /** Clases extra del texto (ej. "text-lg"). */
  textClassName?: string;
  /** Color de fondo. Token del tema ('primary'...) o literal. */
  bgColor?: string;
  /** Estilos extra del botón. */
  style?: StyleProp<ViewStyle>;
}

export const ThemedButton = ({
  children,
  className,
  textClassName,
  bgColor = 'primary',
  style,
  ...rest
}: ThemedButtonProps) => {
  const background = useResolvedColor(bgColor);
  // Color de texto legible sobre el fondo del botón.
  const fallback = isDarkColor(background) ? '#ffffff' : '#000000';
  const textColor = getContrastingColor(background, [fallback]);

  return (
    <Pressable
      className={`items-center rounded-xl px-6 py-2 active:opacity-80 ${className?.trim() ?? ''}`}
      style={[background ? { backgroundColor: background } : null, style]}
      {...rest}
    >
      <ThemedText className={textClassName} color={textColor}>
        {children}
      </ThemedText>
    </Pressable>
  );
};
