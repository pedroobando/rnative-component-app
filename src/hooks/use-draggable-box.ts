import { useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const DIM_OPACITY = 0.4;
const RETURN_CONFIG = { duration: 500, dampingRatio: 0.75 };

export type UseDraggableBoxOptions = {
  /** Opacidad máxima de la capa que oscurece la pantalla (0 = sin oscurecer). */
  dimOpacity?: number;
  /** Configuración del resorte con el que la caja vuelve a su sitio. */
  returnConfig?: { duration?: number; dampingRatio?: number };
  /** Duración del fundido de la capa oscura (ms). */
  dimDuration?: number;
};

/**
 * `useDraggableBox` — lógica de una caja que se arrastra con el dedo.
 *
 * - Al pulsar, la pantalla se oscurece (`dim`).
 * - Mientras está presionada, la caja sigue al dedo en ambos ejes (x, y).
 * - Al soltar, la pantalla se aclara y la caja vuelve a su posición inicial
 *   con un resorte suave.
 *
 * Todo se resuelve en la UI thread con Reanimated: no hay `setState` por frame.
 *
 * Uso:
 *   const { gesture, boxStyle, overlayStyle } = useDraggableBox();
 *   <Animated.View style={overlayStyle} />
 *   <GestureDetector gesture={gesture}>
 *     <Animated.View style={boxStyle} />
 *   </GestureDetector>
 */
export const useDraggableBox = (options: UseDraggableBoxOptions = {}) => {
  const {
    dimOpacity = DIM_OPACITY,
    returnConfig = RETURN_CONFIG,
    dimDuration = 150,
  } = options;

  // Desplazamiento de la caja respecto a su posición inicial.
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Posición desde la que empezó el gesto (evita saltos si el dedo toca la
  // caja cuando aún está volviendo a su sitio).
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  // Opacidad de la capa que oscurece la pantalla (0 = transparente).
  const dim = useSharedValue(0);

  // Clave estable para no recrear el gesto en cada render.
  const returnKey = `${returnConfig.duration ?? ''}:${returnConfig.dampingRatio ?? ''}`;

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          // Si vuelve a pulsar mientras la caja regresa, cortamos el resorte.
          cancelAnimation(translateX);
          cancelAnimation(translateY);
          startX.set(translateX.get());
          startY.set(translateY.get());
          dim.set(withTiming(1, { duration: dimDuration }));
        })
        .onUpdate((event) => {
          translateX.set(startX.get() + event.translationX);
          translateY.set(startY.get() + event.translationY);
        })
        .onFinalize(() => {
          dim.set(withTiming(0, { duration: dimDuration + 50 }));
          // Al soltar (o cancelar el gesto), la caja vuelve al centro.
          translateX.set(withSpring(0, returnConfig));
          translateY.set(withSpring(0, returnConfig));
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dim, dimDuration, returnKey, startX, startY, translateX, translateY]
  );

  // Estilo de la caja: solo `transform` (nada de re-layout).
  const boxStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.get() },
      { translateY: translateY.get() },
    ],
  }));

  // Estilo de la capa oscura.
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: dim.get() * dimOpacity,
  }));

  return { gesture, boxStyle, overlayStyle };
};
