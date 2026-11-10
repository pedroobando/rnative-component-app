import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useRef, useState } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';

import { useKeyboardAwareInput } from '@/components/KeyboardAwareScrollView';
import { useResolvedColor } from '@/hooks';
import { withOpacity } from '@/utils/contrast';
import {
  applyTemplateChange,
  isValidEmail,
  maskText,
  sanitizeByVariant,
  type InputVariant,
} from '@/utils/input-mask';

import { ThemedText } from './ThemedText';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

/**
 * `ThemedInputText` — campo de texto con los colores del tema activo (Uniwind)
 * y con filtrado/máscara según el tipo de dato.
 *
 * ## Variantes
 *
 * | variant        | Qué permite                                        | Teclado            |
 * |----------------|----------------------------------------------------|--------------------|
 * | `text`         | Texto libre (por defecto)                          | `default`          |
 * | `numeric`      | Solo dígitos                                       | `number-pad`       |
 * | `decimal`      | Dígitos con un separador decimal                   | `decimal-pad`      |
 * | `alphanumeric` | Letras y dígitos                                   | `default`          |
 * | `email`        | Email (validación automática)                      | `email-address`    |
 * | `phone`        | Teléfono (dígitos, `+`, `-`, `(`, `)`, espacios)   | `phone-pad`        |
 * | `password`     | Contraseña (con botón mostrar/ocultar)             | `default`          |
 * | `template`     | Texto con plantilla/máscara (`template`)           | `default`          |
 *
 * ## Plantillas (máscaras)
 *
 * En la variante `template` la prop `template` describe el formato:
 *  - `X` -> carácter alfanumérico
 *  - `9` o `#` -> carácter numérico
 *  - `A` -> letra
 *  - cualquier otro carácter -> separador literal
 *
 * ```tsx
 * <ThemedInputText
 *   label="RFC"
 *   variant="template"
 *   template="XXX-XXXX-X"
 *   placeholder="XXX-XXXX-X"
 *   value={rfc}
 *   onChangeText={setRfc}
 * />
 * ```
 *
 * Todas las props nativas de `TextInput` (`placeholder`, `autoComplete`,
 * `autoCapitalize`, `keyboardType`, `inputMode`, `textContentType`,
 * `returnKeyType`, `onSubmitEditing`, `maxLength`...) se pueden pasar: el
 * componente solo pone valores por defecto sensatos según la variante.
 *
 * ```tsx
 * <ThemedInputText
 *   label="Email"
 *   variant="email"
 *   placeholder="tu@email.com"
 *   autoComplete="email"
 *   value={email}
 *   onChangeText={setEmail}
 * />
 * ```
 */
export type ThemedInputTextProps = Omit<
  TextInputProps,
  'style' | 'className' | 'value' | 'onChangeText' | 'children'
> & {
  /** Valor del campo (controlado). Si se omite, el campo gestiona su estado. */
  value?: string;
  /** Se dispara con el texto ya filtrado/formateado. */
  onChangeText?: (text: string) => void;
  /** Tipo de dato que se captura. Por defecto 'text'. */
  variant?: InputVariant;
  /** Plantilla/máscara (obligatoria con `variant="template"`). Ej: 'XXX-XXXX-X'. */
  template?: string;
  /** Etiqueta encima del campo. */
  label?: string;
  /** Texto de ayuda debajo del campo. */
  helperText?: string;
  /** Error explícito (muestra el estado de error y sustituye al texto de ayuda). */
  error?: string;
  /** Marca el campo como obligatorio (añade un asterisco). */
  required?: boolean;
  /** Muestra el contador de caracteres (necesita `maxLength`). */
  showCounter?: boolean;
  /** Número máximo de decimales en la variante `decimal`. */
  decimalPlaces?: number;
  /** Fuerza a mayúsculas (útil con plantillas tipo RFC/CURP). */
  forceUppercase?: boolean;
  /** Valida el email mientras se escribe (por defecto activo en `email`). */
  autoValidate?: boolean;
  /** Icono a la izquierda del campo. */
  leftIcon?: IoniconName;
  /** Icono a la derecha del campo. */
  rightIcon?: IoniconName;
  /** Callback al pulsar el icono de la derecha. */
  onRightIconPress?: () => void;
  /** Oculta el botón de mostrar/ocultar contraseña. */
  hidePasswordToggle?: boolean;
  /** Clases extra del contenedor (label + campo + ayuda). */
  containerClassName?: string;
  /** Clases extra del `TextInput`. */
  inputClassName?: string;
};

/** Keyboard por defecto de cada variante. */
const VARIANT_KEYBOARD: Record<InputVariant, TextInputProps['keyboardType']> = {
  text: 'default',
  numeric: 'number-pad',
  decimal: 'decimal-pad',
  alphanumeric: 'default',
  email: 'email-address',
  phone: 'phone-pad',
  password: 'default',
  template: 'default',
};

/** `inputMode` por defecto de cada variante (ayuda al teclado del navegador/web). */
const VARIANT_INPUT_MODE: Record<InputVariant, TextInputProps['inputMode']> = {
  text: 'text',
  numeric: 'numeric',
  decimal: 'decimal',
  alphanumeric: 'text',
  email: 'email',
  phone: 'tel',
  password: 'text',
  template: 'text',
};

/** `autoComplete` por defecto de cada variante. */
const VARIANT_AUTO_COMPLETE: Record<InputVariant, TextInputProps['autoComplete']> = {
  text: 'off',
  numeric: 'off',
  decimal: 'off',
  alphanumeric: 'off',
  email: 'email',
  phone: 'tel',
  password: 'password',
  template: 'off',
};

/** `textContentType` por defecto de cada variante (iOS). */
const VARIANT_TEXT_CONTENT_TYPE: Record<InputVariant, TextInputProps['textContentType']> = {
  text: 'none',
  numeric: 'none',
  decimal: 'none',
  alphanumeric: 'none',
  email: 'emailAddress',
  phone: 'telephoneNumber',
  password: 'password',
  template: 'none',
};

/** Variantes donde no queremos mayúsculas ni autocorrección. */
const NO_CAPS_VARIANTS: InputVariant[] = [
  'numeric',
  'decimal',
  'alphanumeric',
  'email',
  'phone',
  'template',
];

export function ThemedInputText({
  value,
  onChangeText,
  variant = 'text',
  template,
  label,
  helperText,
  error,
  required = false,
  showCounter = false,
  decimalPlaces,
  forceUppercase = false,
  autoValidate,
  leftIcon,
  rightIcon,
  onRightIconPress,
  hidePasswordToggle = false,
  containerClassName,
  inputClassName,
  placeholder,
  keyboardType,
  inputMode,
  autoComplete,
  autoCapitalize,
  autoCorrect,
  spellCheck,
  textContentType,
  maxLength,
  multiline = false,
  editable = true,
  secureTextEntry,
  onFocus,
  onBlur,
  ...rest
}: ThemedInputTextProps) {
  const [internalValue, setInternalValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const containerRef = useRef<React.ComponentRef<typeof View>>(null);
  const keepInputVisible = useKeyboardAwareInput();

  const borderColor = useResolvedColor('border');
  const primaryColor = useResolvedColor('primary');
  const tertiaryColor = useResolvedColor('tertiary');
  const textColor = useResolvedColor('text');

  const isTemplate = variant === 'template' && Boolean(template);
  const currentValue = value !== undefined ? value : internalValue;

  // El texto que se ve: en la variante `template` siempre lleva la máscara.
  const displayValue = useMemo(() => {
    if (isTemplate && template) {
      return maskText(currentValue, template);
    }

    return currentValue;
  }, [currentValue, isTemplate, template]);

  const handleChangeText = (text: string) => {
    let next = text;

    if (isTemplate && template) {
      next = applyTemplateChange(text, displayValue, template);
    } else {
      next = sanitizeByVariant(text, variant);

      if (variant === 'decimal' && decimalPlaces !== undefined) {
        const [integer = '', decimals] = next.split('.');

        next = decimals === undefined ? integer : `${integer}.${decimals.slice(0, decimalPlaces)}`;
      }
    }

    if (forceUppercase) {
      next = next.toUpperCase();
    }

    setInternalValue(next);
    onChangeText?.(next);
  };

  // Validación automática (solo email de momento).
  const shouldValidate = autoValidate ?? variant === 'email';
  const validationError =
    shouldValidate && variant === 'email' && currentValue.length > 0 && !isValidEmail(currentValue)
      ? 'El email no tiene un formato válido'
      : undefined;

  const errorMessage = error ?? validationError;
  const isInvalid = Boolean(errorMessage);

  const borderColorValue = isInvalid ? tertiaryColor : focused ? primaryColor : borderColor;
  const iconColor = isInvalid ? tertiaryColor : withOpacity(textColor, 0.5);
  const placeholderColor = withOpacity(textColor, 0.4);

  const resolvedPlaceholder = placeholder ?? (isTemplate && template ? template : undefined);
  const resolvedKeyboardType = keyboardType ?? VARIANT_KEYBOARD[variant];
  const resolvedInputMode = inputMode ?? VARIANT_INPUT_MODE[variant];
  const resolvedAutoComplete = autoComplete ?? VARIANT_AUTO_COMPLETE[variant];
  const resolvedAutoCapitalize =
    autoCapitalize ?? (NO_CAPS_VARIANTS.includes(variant) ? 'none' : 'sentences');
  const resolvedAutoCorrect = autoCorrect ?? !NO_CAPS_VARIANTS.includes(variant);
  const resolvedSpellCheck = spellCheck ?? !NO_CAPS_VARIANTS.includes(variant);
  const resolvedTextContentType = textContentType ?? VARIANT_TEXT_CONTENT_TYPE[variant];

  const isPassword = variant === 'password';

  return (
    <View ref={containerRef} className={`w-full gap-1.5 ${containerClassName?.trim() ?? ''}`}>
      {label ? (
        <View className="flex-row items-center gap-1">
          <ThemedText textType="semi-bold" className="text-sm">
            {label}
          </ThemedText>

          {required ? (
            <ThemedText className="text-sm" color="tertiary">
              *
            </ThemedText>
          ) : null}
        </View>
      ) : null}

      <View
        className={`flex-row gap-2 rounded-xl border bg-background px-3 ${
          multiline ? 'py-2.5' : 'py-2'
        }`}
        style={{
          borderColor: borderColorValue,
          borderWidth: focused || isInvalid ? 1.5 : 1,
          opacity: editable ? 1 : 0.6,
          minHeight: multiline ? 96 : 46,
          alignItems: multiline ? 'flex-start' : 'center',
        }}
      >
        {leftIcon ? <Ionicons name={leftIcon} size={18} color={iconColor} /> : null}

        <TextInput
          {...rest}
          value={displayValue}
          onChangeText={handleChangeText}
          editable={editable}
          multiline={multiline}
          maxLength={maxLength}
          placeholder={resolvedPlaceholder}
          placeholderTextColor={placeholderColor}
          keyboardType={resolvedKeyboardType}
          inputMode={resolvedInputMode}
          autoComplete={resolvedAutoComplete}
          autoCapitalize={resolvedAutoCapitalize}
          autoCorrect={resolvedAutoCorrect}
          spellCheck={resolvedSpellCheck}
          textContentType={resolvedTextContentType}
          secureTextEntry={isPassword ? !passwordVisible : secureTextEntry}
          accessibilityLabel={rest.accessibilityLabel ?? label}
          className={`flex-1 text-base ${inputClassName?.trim() ?? ''}`}
          style={{
            color: textColor,
            ...(multiline ? { textAlignVertical: 'top' } : null),
          }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);

            // Le pedimos al ScrollView que nos mantenga visibles: el teclado
            // no debe tapar el campo enfocado.
            keepInputVisible((measure) => {
              containerRef.current?.measureInWindow((x, y, width, height) => {
                measure({ x, y, width, height });
              });
            });
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
        />

        {isPassword && !hidePasswordToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            hitSlop={8}
            onPress={() => setPasswordVisible((visible) => !visible)}
          >
            <Ionicons
              name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={iconColor}
            />
          </Pressable>
        ) : null}

        {rightIcon ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Icono del campo"
            hitSlop={8}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <Ionicons name={rightIcon} size={18} color={iconColor} />
          </Pressable>
        ) : null}
      </View>

      {errorMessage || helperText || (showCounter && maxLength) ? (
        <View className="flex-row items-start justify-between gap-2">
          <ThemedText
            className="flex-1 text-xs"
            color={isInvalid ? 'tertiary' : undefined}
            style={isInvalid ? undefined : { opacity: 0.6 }}
          >
            {errorMessage ?? helperText ?? ''}
          </ThemedText>

          {showCounter && maxLength ? (
            <ThemedText className="text-xs" style={{ opacity: 0.5 }}>
              {`${displayValue.length}/${maxLength}`}
            </ThemedText>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
