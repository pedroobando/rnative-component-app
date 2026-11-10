/**
 * `useThemedAlert` — alertas adaptadas al tema de la app.
 *
 * `Alert.alert` de React Native abre el diálogo nativo del sistema, que no
 * respeta los colores del tema. Este provider renderiza una alerta propia
 * (basada en `Modal`) con los tokens del tema activo.
 *
 * Uso:
 *
 *   const { alert } = useThemedAlert();
 *   alert({
 *     title: '¿Eliminar?',
 *     message: 'Esta acción no se puede deshacer.',
 *     buttons: [
 *       { text: 'Cancelar', style: 'cancel' },
 *       { text: 'Eliminar', style: 'destructive', onPress: onDelete },
 *     ],
 *   });
 *
 * El `<ThemedAlertProvider>` debe estar montado en el layout raíz (ver
 * `src/app/_layout.tsx`).
 */

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { ThemedAlert, type ThemedAlertButton } from '@/components/themed/ThemedAlert';

export type ThemedAlertOptions = {
  /** Título de la alerta. */
  title?: string;
  /** Mensaje opcional. */
  message?: string;
  /** Botones de la alerta. Si se omiten, se muestra un "OK". */
  buttons?: ThemedAlertButton[];
  /** Permite cerrar tocando fuera de la alerta. */
  dismissOnBackdrop?: boolean;
};

type AlertState = ThemedAlertOptions & { visible: boolean };

type ThemedAlertContextValue = {
  /** Muestra una alerta tematizada. */
  alert: (options: ThemedAlertOptions) => void;
  /** Cierra la alerta visible. */
  dismiss: () => void;
};

const ThemedAlertContext = createContext<ThemedAlertContextValue | null>(null);

/** Provider: guarda el estado de la alerta y la renderiza. */
export function ThemedAlertProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AlertState>({ visible: false });

  const alert = useCallback((options: ThemedAlertOptions) => {
    setState({ ...options, visible: true });
  }, []);

  const dismiss = useCallback(() => {
    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  const value = useMemo(() => ({ alert, dismiss }), [alert, dismiss]);

  return (
    <ThemedAlertContext.Provider value={value}>
      {children}

      <ThemedAlert
        visible={state.visible}
        title={state.title}
        message={state.message}
        buttons={state.buttons}
        dismissOnBackdrop={state.dismissOnBackdrop}
        onDismiss={dismiss}
      />
    </ThemedAlertContext.Provider>
  );
}

/** Hook para lanzar alertas tematizadas desde cualquier pantalla. */
export function useThemedAlert(): ThemedAlertContextValue {
  const context = useContext(ThemedAlertContext);

  if (!context) {
    throw new Error('useThemedAlert debe usarse dentro de <ThemedAlertProvider>');
  }

  return context;
}
