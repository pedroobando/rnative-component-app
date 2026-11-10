import { Modal, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useResolvedColor } from '@/hooks/use-resolved-color';

import { ThemedText } from './ThemedText';

/**
 * Estilo de un botón de la alerta (equivale a `AlertButtonStyle` de RN).
 * - `default`: botón normal (color de acento del tema).
 * - `cancel`: botón secundario (color de texto atenuado).
 * - `destructive`: acción destructiva (color terciario del tema).
 */
export type ThemedAlertButtonStyle = 'default' | 'cancel' | 'destructive';

export type ThemedAlertButton = {
  /** Texto del botón. */
  text: string;
  /** Callback al pulsarlo. */
  onPress?: () => void;
  /** Estilo del botón. */
  style?: ThemedAlertButtonStyle;
  /** Botón destacado (se muestra-filled). */
  isPreferred?: boolean;
};

export type ThemedAlertProps = {
  /** Visible o no. */
  visible: boolean;
  /** Título de la alerta. Si es vacío, se oculta. */
  title?: string;
  /** Mensaje opcional debajo del título. */
  message?: string;
  /** Botones. Si no se pasan, se muestra un botón "OK". */
  buttons?: ThemedAlertButton[];
  /** Se llama al cerrar el modal (fuera de la alerta o botón atrás). */
  onDismiss?: () => void;
  /** Permite cerrar tocando fuera (por defecto true, como en Android). */
  dismissOnBackdrop?: boolean;
  /** Estilos extra del contenedor de la alerta. */
  style?: StyleProp<ViewStyle>;
};

/**
 * AlertaThemed — una alerta hecha con `Modal` + tokens del tema.
 *
 * A diferencia de `Alert.alert` de React Native (que usa el diálogo nativo del
 * sistema y por lo tanto no se puede tematizar), esta versión usa los colores
 * del tema activo (light/dark/ocean/emerald/orange/frost).
 */
export function ThemedAlert({
  visible,
  title,
  message,
  buttons,
  onDismiss,
  dismissOnBackdrop = true,
  style,
}: ThemedAlertProps) {
  const background = useResolvedColor('background');
  const textColor = useResolvedColor('text');
  const borderColor = useResolvedColor('border');
  const primary = useResolvedColor('primary');
  const tertiary = useResolvedColor('tertiary');

  // Sin botones mostramos un "OK" por defecto (igual que hace React Native).
  const actions: ThemedAlertButton[] = buttons?.length
    ? buttons
    : [{ text: 'OK', onPress: onDismiss, isPreferred: true }];

  const getButtonColor = (button: ThemedAlertButton) => {
    if (button.style === 'destructive') {
      return tertiary ?? primary;
    }

    if (button.style === 'cancel') {
      return textColor;
    }

    return primary;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 p-6"
        onPress={dismissOnBackdrop ? onDismiss : undefined}
      >
        {/* `pointerEvents="none"` evita que el toque exterior cierre el diálogo
            cuando el usuario pulsa dentro de la tarjeta. */}
        <Pressable
          className="w-full max-w-sm gap-3 rounded-3xl border p-5"
          style={[
            {
              backgroundColor: background,
              borderColor,
              borderCurve: 'continuous',
            },
            style,
          ]}
          onPress={() => undefined}
        >
          {title ? (
            <ThemedText textType="h3" className="text-center">
              {title}
            </ThemedText>
          ) : null}

          {message ? (
            <ThemedText className="text-center text-sm opacity-80">{message}</ThemedText>
          ) : null}

          <View className="mt-1 flex-row flex-wrap justify-end gap-2">
            {actions.map((button) => {
              const color = getButtonColor(button);
              const filled = button.isPreferred === true;

              return (
                <Pressable
                  key={button.text}
                  accessibilityRole="button"
                  onPress={() => {
                    button.onPress?.();
                    onDismiss?.();
                  }}
                  className="rounded-xl px-4 py-2 active:opacity-70"
                  style={
                    filled
                      ? { backgroundColor: color, borderCurve: 'continuous' }
                      : { borderWidth: 1, borderColor, borderCurve: 'continuous' }
                  }
                >
                  <ThemedText
                    textType="semi-bold"
                    className="text-sm"
                    color={filled ? '#ffffff' : color}
                  >
                    {button.text}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
