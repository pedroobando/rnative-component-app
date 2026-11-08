/**
 * `useThemeColor` — resuelve un color según el tema activo.
 *
 * Dos modos de uso:
 *
 * 1. Sin colores: toma el valor de la variable CSS del tema activo.
 *    El nombre se mapea al token `--color-<nombre>` de `src/global.css`.
 *
 *    const background = useThemeColor(undefined, 'background');
 *    // -> lee `--color-background` del tema activo (light, dark, ocean...)
 *
 * 2. Con colores: usa los que le pases y elige el de light/dark según el
 *    esquema de la app (ver `useAppColorScheme`). Si falta el color del
 *    esquema actual, cae al valor de la variable CSS con ese mismo nombre.
 *
 *    const bg = useThemeColor({ light: 'red', dark: 'indigo' }, 'background');
 *    const primary = useThemeColor({ light: '#49129c' }, 'primary');
 *
 * Se actualiza solo cuando cambia el tema (Uniwind notifica los cambios de
 * variables) o el color scheme del sistema.
 *
 * Docs: https://docs.uniwind.dev/theming/basics
 */

import { useCSSVariable } from 'uniwind';

import { useAppColorScheme } from '@/hooks/use-app-color-scheme';

export type ThemeColors = {
  light?: string;
  dark?: string;
};

export function useThemeColor(
  colors?: ThemeColors | string,
  name = 'background',
  /** Fuerza un esquema concreto (útil si la app tiene un toggle manual). */
  schemeOverride?: 'light' | 'dark' | null
): string | undefined {
  const appScheme = useAppColorScheme();
  const scheme = schemeOverride ?? appScheme;

  // Nombre del token CSS: 'background' -> '--color-background'
  const variableName = name.startsWith('--') ? name : `--color-${name}`;
  const cssValue = useCSSVariable(variableName) as string | undefined;

  // Color explícito como string plano (sin depender del tema)
  if (typeof colors === 'string') {
    return colors;
  }

  if (colors) {
    const current = scheme === 'dark' ? colors.dark : colors.light;
    const fallback = scheme === 'dark' ? colors.light : colors.dark;

    if (current) {
      return current;
    }

    return fallback ?? cssValue;
  }

  // Sin colores: se usa el valor actual de la variable del tema
  return cssValue;
}
