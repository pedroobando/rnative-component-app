import { Text, type TextProps, type TextStyle } from 'react-native';

import { useResolvedColor } from '@/hooks/use-resolved-color';
import { getContrastingColor, isDarkColor } from '@/utils/contrast';

/** Tipos de texto disponibles. */
export type TextType = 'normal' | 'h1' | 'h2' | 'h3' | 'semi-bold' | 'link';

export type ThemedTextProps = TextProps & {
  /** Clases de Tailwind/Uniwind (ej. "px-4 text-primary"). */
  className?: string;
  /** Variante tipográfica. Por defecto 'normal'. */
  textType?: TextType;
};

const TEXT_TYPES: Record<TextType, TextStyle> = {
  normal: { fontSize: 16, fontWeight: '400' },
  h1: { fontSize: 30, fontWeight: '700' },
  h2: { fontSize: 24, fontWeight: '700' },
  h3: { fontSize: 20, fontWeight: '600' },
  'semi-bold': { fontSize: 16, fontWeight: '600' },
  link: { fontSize: 16, fontWeight: '500' },
};

// Utilidades `text-*` que NO son colores: tamaños, alineación, wrap, etc.
// Si una de estas aparece en el className, no se aplica el color inline.
const NON_COLOR_TEXT_CLASSES = new Set([
  // tamaños
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  // alineación
  'left',
  'center',
  'right',
  'justify',
  'start',
  'end',
  // otros
  'wrap',
  'nowrap',
  'balance',
  'pretty',
  'ellipsis',
  'clip',
]);

/**
 * Detecta si el className ya define un color de texto (text-primary, text-white...)
 * para no pisarlo con el color calculado por contraste.
 */
function hasTextColorClass(className?: string): boolean {
  if (!className) {
    return false;
  }

  return className.split(/\s+/).some((token) => {
    if (!token.startsWith('text-')) {
      return false;
    }

    const value = token.slice('text-'.length);
    return value.length > 0 && !NON_COLOR_TEXT_CLASSES.has(value);
  });
}

export const ThemedText = ({
  style,
  className,
  textType = 'normal',
  children,
  ...rest
}: ThemedTextProps) => {
  const primary = useResolvedColor('primary');
  const themeText = useResolvedColor('text');
  const background = useResolvedColor('background');
  const typeStyle = TEXT_TYPES[textType];
  const hasColor = hasTextColorClass(className);

  // Color de respaldo según el tono del fondo (blanco sobre oscuro, negro sobre claro).
  const fallback = isDarkColor(background) ? '#ffffff' : '#000000';

  // Sin color explícito en el className, el color se calcula contra el fondo
  // activo del tema para garantizar contraste:
  // - 'link' -> color primario del tema
  // - resto  -> token 'text' del tema
  const color = hasColor
    ? undefined
    : textType === 'link'
      ? getContrastingColor(background, [primary, themeText, fallback])
      : getContrastingColor(background, [themeText, fallback]);

  return (
    <Text
      {...rest}
      className={className}
      style={[typeStyle, color ? { color } : null, style]}
    >
      {children}
    </Text>
  );
};
