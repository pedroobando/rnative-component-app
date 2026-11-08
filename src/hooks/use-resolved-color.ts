/**
 * `useResolvedColor` — resuelve un color que puede ser:
 *
 *  - un **token del tema**: 'primary', 'background', 'text', 'border', ...
 *    -> devuelve el valor activo de ese token (cambia con el tema)
 *  - un **color literal**: '#ff0000', 'red', 'rgba(0,0,0,.5)'
 *    -> se devuelve tal cual
 *
 * Si no se pasa nada, devuelve undefined (el componente decide).
 */

import { themeColorTokens } from '@/constants/themes';
import { useThemeColor } from '@/hooks/use-theme-color';

export function useResolvedColor(value?: string): string | undefined {
  const isToken = value !== undefined && (themeColorTokens as readonly string[]).includes(value);

  // Se llaman los dos hooks siempre (regla de hooks); solo uno aporta el valor.
  const tokenColor = useThemeColor(undefined, isToken ? value : 'background');
  const literalColor = useThemeColor(!isToken ? value : undefined, 'background');

  if (!value) {
    return undefined;
  }

  return isToken ? tokenColor : literalColor;
}
