/**
 * `ThemedInputTextV2` — campo de texto mínimo con los colores del tema activo
 * (Uniwind) y **todas las props nativas de `TextInput`** de React Native.
 *
 * A diferencia de `ThemedInputText` (que trae label, máscaras, iconos,
 * contador...), esta versión es solo el `TextInput` pelado con el tema
 * resuelto: texto, placeholder y (opcionalmente) fondo y borde.
 *
 * ```tsx
 * <ThemedInputTextV2
 *   placeholder="Escribe aquí"
 *   value={value}
 *   onChangeText={setValue}
 * />
 * ```
 *
 * El color del texto es el token `text` del tema. Se puede cambiar con
 * `color` (token o literal) y el placeholder se deriva de él.
 *
 * ```tsx
 * <ThemedInputTextV2 color="primary" placeholder="Buscar" />
 * ```
 *
 * Si necesitas clases de Tailwind/Uniwind, usa `className`:
 *
 * ```tsx
 * <ThemedInputTextV2 className="rounded-xl border border-border bg-background px-3" />
 * ```
 */

import { TextInput, type TextInputProps } from 'react-native';

import { useResolvedColor } from '@/hooks';
import { withOpacity } from '@/utils/contrast';

export type ThemedInputTextV2Props = Omit<TextInputProps, 'style'> & {
  /** Clases de Tailwind/Uniwind (ej. "rounded-xl border border-border px-3"). */
  className?: string;
  /** Estilos del `TextInput` (se aplican al final, ganan a los del tema). */
  style?: TextInputProps['style'];
  /**
   * Color del texto. Acepta un token del tema ('text', 'primary', ...) o un
   * color literal ('#ff0000'). Por defecto usa el token `text`.
   */
  color?: string;
  /**
   * Color del placeholder. Acepta token o literal; por defecto se deriva del
   * color del texto con 40% de opacidad.
   */
  placeholderColor?: string;
  /**
   * Opacidad del placeholder cuando se deriva del color del texto (0-1).
   * Por defecto 0.4.
   */
  placeholderOpacity?: number;
};

export function ThemedInputTextV2({
  className,
  style,
  color = 'text',
  placeholderColor,
  placeholderOpacity = 0.4,
  placeholderTextColor,
  ...rest
}: ThemedInputTextV2Props) {
  const textColor = useResolvedColor(color);
  const resolvedPlaceholderColor = useResolvedColor(placeholderColor);

  return (
    <TextInput
      {...rest}
      className={className}
      placeholderTextColor={
        placeholderTextColor ??
        resolvedPlaceholderColor ??
        withOpacity(textColor, placeholderOpacity)
      }
      style={[{ color: textColor }, style]}
    />
  );
}
