import { useCallback, useState } from 'react';
import { Animated, Easing } from 'react-native';

const DROP_HEIGHT = 300; // distancia desde la que cae la caja
const DROP_OVERSHOOT = 24; // cuánto se pasa del punto final antes de rebotar

/**
 * Encapsula la lógica de animación de la caja:
 * - fadeIn / fadeOut: opacidad 0 <-> 1
 * - drop: caída con aceleración + rebote, y asegura que la caja sea visible
 */
export const useAnimation = () => {
  // Valor animado (0 = invisible, 1 = visible). Se crea una sola vez por montaje.
  const [opacity] = useState(() => new Animated.Value(0));
  // 0 = en su sitio. Al pulsar "Down" se teletransporta arriba y cae.
  const [translateY] = useState(() => new Animated.Value(0));

  const fadeIn = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const fadeOut = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  // Caída desde arriba (acelerando como la gravedad) + rebote al tocar el suelo.
  const drop = useCallback(() => {
    translateY.setValue(-DROP_HEIGHT);

    Animated.parallel([
      Animated.sequence([
        // 1. Caída: de -300 hasta pasar un poco el punto final.
        Animated.timing(translateY, {
          toValue: DROP_OVERSHOOT,
          duration: 320,
          easing: Easing.bezier(0.4, 0, 1, 1),
          useNativeDriver: true,
        }),
        // 2. Rebote: el resorte pasa de largo y vuelve a su sitio.
        Animated.spring(translateY, {
          toValue: 0,
          speed: 12,
          bounciness: 12,
          useNativeDriver: true,
        }),
      ]),
      // La caja debe ser visible para ver la caída.
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  return { opacity, translateY, fadeIn, fadeOut, drop };
};
