import { Pressable, Switch, View, type SwitchProps } from 'react-native';

import { useResolvedColor } from '@/hooks';

import { ThemedText } from './ThemedText';

/**
 * `ThemedSwitch` — wrapper del `Switch` nativo de React Native con los
 * colores del tema activo (Uniwind).
 *
 * - `trackColor` usa `primary` cuando está encendido y `border` cuando está apagado.
 * - El pulgar (`thumb`) es blanco en iOS y Android.
 * - `ios_backgroundColor` evita el gris por defecto de iOS en estado apagado.
 *
 * ```tsx
 * <ThemedSwitch value={on} onValueChange={setOn} />
 * ```
 */
export type ThemedSwitchProps = Omit<
  SwitchProps,
  'value' | 'onValueChange' | 'trackColor' | 'thumbColor'
> & {
  /** Estado actual del switch (componente controlado). */
  value: boolean;
  /** Se dispara cuando el usuario cambia el valor. */
  onValueChange: (value: boolean) => void;
  /** Color del track encendido. Token del tema o color literal. Por defecto 'primary'. */
  activeColor?: string;
  /** Color del track apagado. Token del tema o color literal. Por defecto 'border'. */
  inactiveColor?: string;
  /** Color del pulgar. Token del tema o color literal. Por defecto blanco. */
  thumbColor?: string;
};

export const ThemedSwitch = ({
  value,
  onValueChange,
  activeColor = 'primary',
  inactiveColor = 'border',
  thumbColor = '#ffffff',
  disabled = false,
  ...rest
}: ThemedSwitchProps) => {
  const active = useResolvedColor(activeColor);
  const inactive = useResolvedColor(inactiveColor);
  const thumb = useResolvedColor(thumbColor);

  return (
    <Switch
      {...rest}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: inactive, true: active }}
      thumbColor={thumb}
      ios_backgroundColor={inactive}
    />
  );
};

/**
 * `ThemedSwitchRow` — fila con etiqueta (y descripción opcional) a la izquierda
 * y el switch a la derecha. Al pulsar la fila entera también se alterna el
 * switch, patrón habitual en la pantalla de Ajustes de iOS.
 *
 * ```tsx
 * <ThemedSwitchRow title="Notificaciones" value={on} onValueChange={setOn} />
 * ```
 */
export type ThemedSwitchRowProps = {
  /** Texto principal de la fila. */
  title: string;
  /** Texto secundario (opcional). */
  description?: string;
  /** Estado actual del switch (componente controlado). */
  value: boolean;
  /** Se dispara cuando el usuario cambia el valor. */
  onValueChange: (value: boolean) => void;
  /** Desactiva la fila y su switch. */
  disabled?: boolean;
  /** Color del track encendido. Token del tema o color literal. */
  activeColor?: string;
  /** Color del track apagado. Token del tema o color literal. */
  inactiveColor?: string;
  /** Color del pulgar. Token del tema o color literal. */
  thumbColor?: string;
};

export const ThemedSwitchRow = ({
  title,
  description,
  value,
  onValueChange,
  disabled = false,
  activeColor,
  inactiveColor,
  thumbColor,
}: ThemedSwitchRowProps) => {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      className="flex-row items-center gap-4 py-3 active:opacity-70"
    >
      <View className="flex-1 gap-1">
        <ThemedText textType="semi-bold" className={disabled ? 'opacity-50' : undefined}>
          {title}
        </ThemedText>
        {description ? (
          <ThemedText className="text-sm opacity-60">{description}</ThemedText>
        ) : null}
      </View>

      <ThemedSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
        thumbColor={thumbColor}
      />
    </Pressable>
  );
};
