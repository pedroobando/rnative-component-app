import { useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

import { ThemedButton, ThemedText, ThemedView } from '@/components';

const BOX_SIZE = 150;
const DROP_HEIGHT = 300; // distancia desde la que cae la caja
const DROP_OVERSHOOT = 24; // cuánto se pasa del punto final antes de rebotar

const Animation101Screen = () => {
  // Valor animado (0 = invisible, 1 = visible). Se crea una sola vez por montaje.
  const [opacity] = useState(() => new Animated.Value(0));
  // 0 = en su sitio. Al pulsar "Down" se teletransporta arriba y cae.
  const [translateY] = useState(() => new Animated.Value(0));
  const animateTop = useRef(new Animated.Value(-100)).current;

  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  // Caída desde arriba (acelerando como la gravedad) + rebote al tocar el suelo.
  const drop = () => {
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
  };

  return (
    <ThemedView margin>
      <ThemedText textType="h2" className="mb-4">
        Animation101Screen
      </ThemedText>

      <Animated.View
        style={{
          width: BOX_SIZE,
          height: BOX_SIZE,
          backgroundColor: '#f97316',
          borderRadius: 12,
          marginBottom: 24,

          opacity,
          transform: [{ translateY }],
        }}
      />

      <ThemedButton className="mb-5" onPress={fadeIn}>
        FadeIn
      </ThemedButton>

      <ThemedButton className="mb-5" onPress={fadeOut}>
        FadeOut
      </ThemedButton>

      <ThemedButton className="mb-5" onPress={drop}>
        Down
      </ThemedButton>
    </ThemedView>
  );
};
export default Animation101Screen;
