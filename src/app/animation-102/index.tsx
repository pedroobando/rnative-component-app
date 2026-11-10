import { ScrollView, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { ThemedText, ThemedView } from '@/components';
import { useDraggableBox } from '@/hooks';

const BOX_SIZE = 120;

/**
 * Caja en el centro de la pantalla que sigue al dedo mientras la arrastras.
 * - Al empezar el gesto, la pantalla se oscurece.
 * - La caja se mueve con el dedo en ambos ejes (x e y).
 * - Al soltar, la pantalla vuelve a su claridad y la caja regresa al centro.
 *
 * Toda la lógica vive en el hook `useDraggableBox`.
 */
const Animation102Screen = () => {
  const { gesture, boxStyle, overlayStyle } = useDraggableBox();

  return (
    <ThemedView className="flex-1" margin>
      <ScrollView>
        <ThemedText textType="h2">Animation 102</ThemedText>
        <ThemedText style={{ opacity: 0.7 }} className="mt-1">
          Mantén pulsada la caja y arrástrala: la pantalla se oscurece y la caja te sigue.
        </ThemedText>

        <View className="relative mt-4 flex-1 overflow-hidden rounded-2xl border border-border">
          {/* Capa que oscurece la pantalla al pulsar */}
          <Animated.View
            pointerEvents="none"
            style={[{ position: 'absolute', inset: 0, backgroundColor: '#000' }, overlayStyle]}
          />

          {/* Caja en el centro */}
          <View className="flex-1 items-center justify-center">
            <GestureDetector gesture={gesture}>
              <Animated.View
                className="rounded-2xl bg-primary"
                style={[{ width: BOX_SIZE, height: BOX_SIZE }, boxStyle]}
              />
            </GestureDetector>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default Animation102Screen;
