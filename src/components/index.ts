/**
 * Barril de componentes de la app.
 *
 * Permite importar todo desde una sola ruta:
 *   import { ThemedText, ThemedView } from '@/components';
 */

export { AppMenu } from './menu/app-menu';
export { ThemedButton } from './ThemedButton';
export { ThemedText } from './ThemedText';
export { ThemedView } from './ThemedView';

// Tipos públicos
export type { ThemedButtonProps } from './ThemedButton';
export type { ThemedTextProps, TextType } from './ThemedText';
export type { ThemedViewProps, ThemedViewEdge } from './ThemedView';
