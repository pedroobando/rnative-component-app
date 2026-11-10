import { Animated } from 'react-native';

import { ThemedButton, ThemedText, ThemedView } from '@/components';
import { useAnimation } from '@/hooks';

const BOX_SIZE = 150;

const Animation101Screen = () => {
  const { opacity, translateY, fadeIn, fadeOut, drop } = useAnimation();

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
