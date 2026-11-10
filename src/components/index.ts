/**
 * Barril de componentes de la app.
 *
 * Permite importar todo desde una sola ruta:
 *   import { ThemedText, ThemedView } from '@/components';
 *
 * Los componentes que resuelven sus colores con el tema activo viven en
 * `src/components/themed/` y también se pueden importar directamente:
 *   import { ThemedText } from '@/components/themed';
 */

export { AppMenu } from './menu/app-menu';

export { KeyboardAwareScrollView, useKeyboardAwareInput } from './KeyboardAwareScrollView';

export {
  ThemedButton,
  ThemedInputText,
  ThemedInputTextV2,
  ThemedSwitch,
  ThemedSwitchRow,
  ThemedText,
  ThemedView,
} from './themed';

// Tipos públicos
export type { KeyboardAwareScrollViewProps } from './KeyboardAwareScrollView';
export type { ThemedButtonProps } from './themed';
export type { ThemedInputTextProps } from './themed';
export type { ThemedInputTextV2Props } from './themed';
export type { ThemedSwitchProps, ThemedSwitchRowProps } from './themed';
export type { ThemedTextProps, TextType } from './themed';
export type { ThemedViewProps, ThemedViewEdge } from './themed';
