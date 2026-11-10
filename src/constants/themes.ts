/**
 * Temas de la app (Uniwind).
 *
 * `light` y `dark` vienen built-in en Uniwind. `ocean`, `emerald`, `orange` y
 * `frost` son temas propios, definidos como `@variant` en `src/global.css` y
 * registrados en `metro.config.js` -> `extraThemes`.
 *
 * `scheme` indica si el tema es de fondo claro u oscuro. Sirve para:
 *  - elegir el tema base de navegación de Expo Router (DarkTheme/DefaultTheme)
 *  - decidir qué color de un par { light, dark } usar en `useThemeColor`
 */

export type AppThemeName = 'light' | 'dark' | 'ocean' | 'emerald' | 'orange' | 'frost';

/**
 * Uniwind solo conoce los tipos de tema si `src/uniwind-types.d.ts` fue
 * regenerado con los `extraThemes` de metro.config.js. Ese archivo lo genera
 * el bundler, asi que puede estar desactualizado: por eso el cast.
 */
export type UniwindThemeName = Parameters<typeof import('uniwind').Uniwind.setTheme>[0];

export type AppTheme = {
  name: AppThemeName;
  label: string;
  icon: string;
  scheme: 'light' | 'dark';
};

export const appThemes: AppTheme[] = [
  { name: 'light', label: 'Claro', icon: '☀️', scheme: 'light' },
  { name: 'dark', label: 'Oscuro', icon: '🌙', scheme: 'dark' },
  { name: 'ocean', label: 'Ocean', icon: '🌊', scheme: 'light' },
  { name: 'emerald', label: 'Emerald', icon: '💚', scheme: 'light' },
  { name: 'orange', label: 'Orange', icon: '🧡', scheme: 'light' },
  { name: 'frost', label: 'Frost', icon: '❄️', scheme: 'light' },
];

/** Tokens de color disponibles en todos los temas (ver src/global.css). */
export const themeColorTokens = [
  'primary',
  'secondary',
  'tertiary',
  'success',
  'text',
  'background',
  'border',
] as const;

export type ThemeColorToken = (typeof themeColorTokens)[number];

/** Temas propios: a qué esquema (claro/oscuro) equivalen. */
export const customThemeSchemes: Record<string, 'light' | 'dark'> = {
  ocean: 'light',
  emerald: 'light',
  orange: 'light',
  frost: 'light',
};
