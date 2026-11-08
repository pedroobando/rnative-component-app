/**
 * `useAppNavigationTheme` — tema de navegación de Expo Router sincronizado
 * con la paleta de Uniwind (`src/global.css`).
 *
 * Por defecto, Expo Router usa `DarkTheme`/`DefaultTheme` (colores del sistema),
 * que NO coinciden con el branding de la app. Este hook devuelve el tema base
 * de navegación con los colores reemplazados por los tokens de Uniwind:
 *
 *   --color-background -> colors.background / colors.card
 *   --color-text       -> colors.text
 *   --color-primary    -> colors.primary
 *   --color-border     -> colors.border
 *   --color-tertiary   -> colors.notification
 *
 * Si un token no existe, se conserva el color del tema base.
 * El tema base (claro u oscuro) se decide con `useAppColorScheme`, que tiene en
 * cuenta también los temas propios (ocean, emerald, orange).
 */

import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';

import { useAppColorScheme } from '@/hooks/use-app-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

export function useAppNavigationTheme(): Theme {
  const scheme = useAppColorScheme();
  const isDark = scheme === 'dark';
  const base = isDark ? DarkTheme : DefaultTheme;

  const background = useThemeColor(undefined, 'background');
  const text = useThemeColor(undefined, 'text');
  const primary = useThemeColor(undefined, 'primary');
  const border = useThemeColor(undefined, 'border');
  const notification = useThemeColor(undefined, 'tertiary');

  return {
    ...base,
    dark: isDark,
    colors: {
      ...base.colors,
      primary: primary ?? base.colors.primary,
      background: background ?? base.colors.background,
      card: background ?? base.colors.card,
      text: text ?? base.colors.text,
      border: border ?? base.colors.border,
      notification: notification ?? base.colors.notification,
    },
  };
}
