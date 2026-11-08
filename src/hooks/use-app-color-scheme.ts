/**
 * `useAppColorScheme` — esquema (claro/oscuro) **de la app**.
 *
 * No usa `useColorScheme()` de React Native, sino el tema activo de Uniwind,
 * porque al elegir un tema propio (ocean, emerald, orange) el Appearance del
 * sistema pasa a "unspecified" y `useColorScheme()` puede devolver null.
 *
 * - Tema 'light'  -> 'light'
 * - Tema 'dark'   -> 'dark'
 * - Tema propio   -> el esquema definido en `customThemeSchemes`
 */

import { useUniwind } from 'uniwind';

import { customThemeSchemes } from '@/constants/themes';

export function useAppColorScheme(): 'light' | 'dark' {
  const { theme } = useUniwind();

  if (theme === 'dark') {
    return 'dark';
  }

  if (theme === 'light') {
    return 'light';
  }

  return customThemeSchemes[theme] ?? 'light';
}
