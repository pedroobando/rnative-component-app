import { Text, type TextProps, type TextStyle } from 'react-native';

import { useResolvedColor } from '@/hooks/use-resolved-color';

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

// `text-3xl`, `text-sm`... son tamaños de fuente: no cuentan como color.
const SIZE_CLASS_NAMES = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];

/**
 * Detecta si el className ya define un color de texto (text-primary, text-white...)
 * para no pisarlo con el color por defecto del tipo.
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
    return value.length > 0 && !SIZE_CLASS_NAMES.includes(value);
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
  const typeStyle = TEXT_TYPES[textType];
  const hasColor = hasTextColorClass(className);

  // Sin color explícito en el className: 'link' usa el primario y el resto el
  // token 'text' del tema activo.
  const color = hasColor ? undefined : textType === 'link' ? primary : themeText;

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
