/**
 * Componentes "themed": los que resuelven sus colores con el tema activo
 * (Uniwind) en lugar de colores literales.
 *
 * Todos viven en `src/components/themed/` y se importan desde aquí:
 *   import { ThemedText, ThemedView } from '@/components/themed';
 */

export { ThemedButton } from './ThemedButton';
export { ThemedSwitch, ThemedSwitchRow } from './ThemedSwitch';
export { ThemedText } from './ThemedText';
export { ThemedView } from './ThemedView';

// Tipos públicos
export type { ThemedButtonProps } from './ThemedButton';
export type { ThemedSwitchProps, ThemedSwitchRowProps } from './ThemedSwitch';
export type { ThemedTextProps, TextType } from './ThemedText';
export type { ThemedViewProps, ThemedViewEdge } from './ThemedView';
