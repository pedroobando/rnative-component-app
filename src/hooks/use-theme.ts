/**
 * Tema actual de la app (Uniwind).
 *
 * - `theme`: 'light' | 'dark' (el tema `system` se resuelve al que marca el SO)
 *
 * La paleta vive en `src/global.css` como variables `--color-*` y se usa con
 * clases (`bg-primary`, `text-text`). Si alguna vez necesitas el valor en JS
 * (StatusBar, gradientes, `tintColor`...), lee la variable directamente:
 *
 *   import { useCSSVariable } from 'uniwind';
 *   const primary = useCSSVariable('--color-primary');
 *
 * https://docs.uniwind.dev/theming/basics
 */

import { useUniwind } from 'uniwind';

export function useTheme() {
  const { theme } = useUniwind();

  return { theme };
}
