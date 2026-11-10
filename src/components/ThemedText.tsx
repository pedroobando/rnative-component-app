import { Text, type TextProps, type TextStyle } from 'react-native';

import { useResolvedColor } from '@/hooks';

/** Tipos de texto disponibles. */
export type TextType = 'normal' | 'h1' | 'h2' | 'h3' | 'semi-bold' | 'link';

export type ThemedTextProps = TextProps & {
  /** Clases de Tailwind/Uniwind (ej. "px-4 text-primary"). */
  className?: string;
  /** Variante tipográfica. Por defecto 'normal'. */
  textType?: TextType;
  /**
   * Color del texto. Acepta un token del tema ('text', 'primary', 'background'...)
   * o un color literal ('#ff0000', 'red'). Si se omite, se usa el token por
   * defecto de la variante (`text` o `primary` para 'link').
   */
  color?: string;
};

const TEXT_TYPES: Record<TextType, TextStyle> = {
  normal: { fontSize: 16, fontWeight: '400' },
  h1: { fontSize: 30, fontWeight: '700' },
  h2: { fontSize: 24, fontWeight: '700' },
  h3: { fontSize: 20, fontWeight: '600' },
  'semi-bold': { fontSize: 16, fontWeight: '600' },
  link: { fontSize: 16, fontWeight: '500' },
};

/** Token de color del tema usado por defecto en cada variante. */
const DEFAULT_COLOR_TOKENS: Record<TextType, string> = {
  normal: 'text',
  h1: 'text',
  h2: 'text',
  h3: 'text',
  'semi-bold': 'text',
  link: 'primary',
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
 * para no pisarlo con el color del tema.
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
  color,
  children,
  ...rest
}: ThemedTextProps) => {
  // Color del tema activo: se resuelve el token (o literal) con el tema actual.
  const resolvedColor = useResolvedColor(color ?? DEFAULT_COLOR_TOKENS[textType]);
  const typeStyle = TEXT_TYPES[textType];

  // Si el className ya trae un color (text-primary, text-white...), manda ese.
  const hasColor = hasTextColorClass(className);
  const textColor = hasColor ? undefined : resolvedColor;

  return (
    <Text
      {...rest}
      className={className}
      style={[typeStyle, textColor ? { color: textColor } : null, style]}
    >
      {children}
    </Text>
  );
};
