/**
 * Componentes "themed": los que resuelven sus colores con el tema activo
 * (Uniwind) en lugar de colores literales.
 *
 * Todos viven en `src/components/themed/` y se importan desde aquí:
 *   import { ThemedText, ThemedView } from '@/components/themed';
 */

export { ThemedAlert } from './ThemedAlert';
export { ThemedButton } from './ThemedButton';
export { ThemedInputText } from './ThemedInputText';
export { ThemedInputTextV2 } from './ThemedInputTextV2';
export { ThemedSwitch, ThemedSwitchRow } from './ThemedSwitch';
export { ThemedText } from './ThemedText';
export { ThemedView } from './ThemedView';

// Tipos públicos
export type {
  ThemedAlertButton,
  ThemedAlertButtonStyle,
  ThemedAlertProps,
} from './ThemedAlert';
export type { ThemedButtonProps } from './ThemedButton';
export type { ThemedInputTextProps } from './ThemedInputText';
export type { ThemedInputTextV2Props } from './ThemedInputTextV2';
export type { ThemedSwitchProps, ThemedSwitchRowProps } from './ThemedSwitch';
export type { ThemedTextProps, TextType } from './ThemedText';
export type { ThemedViewProps, ThemedViewEdge } from './ThemedView';
