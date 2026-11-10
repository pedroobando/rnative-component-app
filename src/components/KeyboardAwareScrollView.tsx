import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewProps,
} from 'react-native';

/** Rectángulo de un nodo, en coordenadas de ventana. */
export type MeasuredRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Mide un nodo y entrega su rectángulo en coordenadas de ventana. */
export type MeasureRect = (callback: (rect: MeasuredRect) => void) => void;

type KeyboardAwareContextValue = {
  /** Pide que el input enfocado quede visible por encima del teclado. */
  keepInputVisible: (measure: MeasureRect) => void;
};

const KeyboardAwareContext = createContext<KeyboardAwareContextValue | null>(null);

/**
 * Hook para componentes que reciben foco (inputs).
 *
 * Devuelve una función que se debe llamar en `onFocus` pasando un callback
 * que mida el nodo (normalmente con `measureInWindow`):
 *
 * ```tsx
 * const keepInputVisible = useKeyboardAwareInput();
 *
 * <View ref={containerRef}>
 *   <TextInput
 *     onFocus={() =>
 *       keepInputVisible((cb) =>
 *         containerRef.current?.measureInWindow((x, y, width, height) =>
 *           cb({ x, y, width, height })
 *         )
 *       )
 *     }
 *   />
 * </View>
 * ```
 *
 * Si no hay un `KeyboardAwareScrollView` en el árbol, no hace nada.
 */
export function useKeyboardAwareInput() {
  const context = useContext(KeyboardAwareContext);

  return useCallback(
    (measure: MeasureRect) => {
      context?.keepInputVisible(measure);
    },
    [context]
  );
}

export type KeyboardAwareScrollViewProps = Omit<ScrollViewProps, 'onScroll'> & {
  children?: ReactNode;
  /** Separación extra entre el input y el borde superior de la zona visible. */
  scrollMargin?: number;
};

/**
 * `KeyboardAwareScrollView` — `ScrollView` que sabe dónde está el teclado.
 *
 * ## El problema que resuelve
 *
 * En iOS el teclado **flota** sobre la app: no redimensiona la ventana, así que
 * termina tapando los inputs que están cerca del borde inferior. En Android la
 * ventana sí se redimensiona (`adjustResize`), pero el `ScrollView` no desplaza
 * el contenido, de modo que el input enfocado puede quedarse fuera de la zona
 * visible.
 *
 * ## Qué hace
 *
 * 1. Escucha `keyboardWillShow`/`keyboardDidShow` para saber la altura del teclado.
 * 2. Calcula la zona visible real del `ScrollView` (descuntando el teclado).
 * 3. Cuando un input pide `keepInputVisible`, mide su posición y desplaza el
 *    contenido lo justo para que quede por encima del teclado.
 *
 * Es una solución 100% JS: no necesita `react-native-keyboard-controller` ni
 * un development build, funciona en Expo Go.
 */
export function KeyboardAwareScrollView({
  children,
  contentContainerStyle,
  onContentSizeChange,
  scrollMargin = 16,
  style,
  ...props
}: KeyboardAwareScrollViewProps) {
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const containerRef = useRef<React.ComponentRef<typeof View>>(null);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  // refs para no recrear el callback en cada render
  const containerTopRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const contentHeightRef = useRef(0);
  const measureRef = useRef<MeasureRect | null>(null);
  const keyboardHeightRef = useRef(0);
  const viewportRef = useRef(viewport);

  // Sincronizamos los refs con el estado (fuera del render, como pide eslint).
  useEffect(() => {
    keyboardHeightRef.current = keyboardHeight;
  }, [keyboardHeight]);

  useEffect(() => {
    viewportRef.current = viewport;
  }, [viewport]);

  // --- Altura del teclado -------------------------------------------------
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates?.height ?? 0);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // --- Desplazar el input enfocado para que quede visible -----------------
  const scrollInputIntoView = useCallback((animated: boolean) => {
    const measure = measureRef.current;

    if (!measure) {
      return;
    }

    measure((rect) => {
      const containerTop = containerTopRef.current;
      const viewportHeight = viewportRef.current.height;

      if (!viewportHeight) {
        return;
      }

      // Altura real de pantalla (no cambia con el redimensionado de Android).
      const screenHeight = Dimensions.get('screen').height;
      const keyboardTop =
        keyboardHeightRef.current > 0 ? screenHeight - keyboardHeightRef.current : screenHeight;

      // La zona visible del ScrollView termina donde empieza el teclado.
      const containerBottom = containerTop + viewportHeight;
      const visibleBottom = Math.min(containerBottom, keyboardTop);
      const visibleHeight = Math.max(visibleBottom - containerTop, 0);

      // Posición del input dentro del contenido (coordenadas de contenido).
      const contentY = rect.y - containerTop + scrollOffsetRef.current;
      const inputTop = contentY - scrollOffsetRef.current;
      const inputBottom = inputTop + rect.height;

      const maxScroll = Math.max(0, contentHeightRef.current - viewportHeight);
      let target = scrollOffsetRef.current;

      if (inputBottom > visibleHeight) {
        // El input queda tapado por el teclado -> subimos el contenido.
        target = scrollOffsetRef.current + (inputBottom - visibleHeight) + scrollMargin;
      } else if (inputTop < scrollMargin) {
        // El input quedó muy arriba (por ejemplo, con multilinea) -> lo bajamos.
        target = contentY - scrollMargin;
      }

      target = Math.max(0, Math.min(target, maxScroll));

      if (Math.abs(target - scrollOffsetRef.current) > 4) {
        scrollRef.current?.scrollTo({ y: target, animated });
      }
    });
  }, [scrollMargin]);

  // Cuando el teclado aparece (o se va) recalculamos la zona visible.
  useEffect(() => {
    if (keyboardHeight <= 0) {
      return;
    }

    // Pequeño retardo para que el teclado termine de animarse.
    const timeout = setTimeout(() => scrollInputIntoView(true), 80);

    return () => clearTimeout(timeout);
  }, [keyboardHeight, scrollInputIntoView]);

  const keepInputVisible = useCallback(
    (measure: MeasureRect) => {
      measureRef.current = measure;
      // Si el teclado ya está abierto, ajustamos en el acto.
      scrollInputIntoView(false);
    },
    [scrollInputIntoView]
  );

  const contextValue = useMemo(() => ({ keepInputVisible }), [keepInputVisible]);

  // --- Layout / scroll ----------------------------------------------------
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setViewport({ width, height });
    containerRef.current?.measureInWindow((_x, y) => {
      containerTopRef.current = y;
    });
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
    },
    []
  );

  const handleContentSizeChange = useCallback(
    (width: number, height: number) => {
      contentHeightRef.current = height;
      onContentSizeChange?.(width, height);
    },
    [onContentSizeChange]
  );

  // En iOS el teclado no redimensiona la ventana: añadimos espacio al final
  // del contenido para que el último campo también pueda subir.
  const extraBottomPadding = Platform.OS === 'ios' ? keyboardHeight : 0;
  const flattened = StyleSheet.flatten(contentContainerStyle);

  const mergedContentStyle = {
    ...flattened,
    paddingBottom: Number(flattened?.paddingBottom ?? 0) + extraBottomPadding,
  };

  return (
    <KeyboardAwareContext.Provider value={contextValue}>
      <View ref={containerRef} style={[{ flex: 1 }, style]} onLayout={handleLayout}>
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={mergedContentStyle}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onContentSizeChange={handleContentSizeChange}
          {...props}
        >
          {children}
        </ScrollView>
      </View>
    </KeyboardAwareContext.Provider>
  );
}
