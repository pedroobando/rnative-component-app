import { Link, router } from 'expo-router';
import { View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const palette = [
  { name: 'primary', className: 'bg-primary' },
  { name: 'secondary', className: 'bg-secondary' },
  { name: 'tertiary', className: 'bg-tertiary' },
  { name: 'success', className: 'bg-success' },
];

export default function AboutScreen() {
  // Vuelve a la pantalla anterior del stack; si no hay historial, al inicio.
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <ThemedView className="flex-1 items-center justify-center gap-6 p-6" safe>
      <ThemedText textType="h1">Acerca de</ThemedText>

      <ThemedText className="w-10/12 text-center">
        Paleta definida en el tema de Uniwind (src/global.css)
      </ThemedText>

      <View className="flex-row gap-4">
        {palette.map((color) => (
          <View key={color.name} className={`h-16 w-16 rounded-2xl ${color.className}`} />
        ))}
      </View>

      <ThemedText className="text-sm">
        bg-primary · bg-secondary · bg-tertiary · bg-success
      </ThemedText>

      <Link href="/themes" className="rounded-xl bg-primary px-6 py-3">
        <ThemedText textType="semi-bold" className="text-white">
          Cambiar de tema
        </ThemedText>
      </Link>

      <ThemedText
        onPress={goBack}
        className="rounded-xl border border-border px-6 py-3"
        textType="semi-bold"
      >
        Volver atrás
      </ThemedText>
    </ThemedView>
  );
}
