import { Link } from 'expo-router';
import { View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const palette = [
  { name: 'primary', className: 'bg-primary' },
  { name: 'secondary', className: 'bg-secondary' },
  { name: 'tertiary', className: 'bg-tertiary' },
  { name: 'success', className: 'bg-success' },
];

export default function HomeScreen() {
  return (
    // <View className="flex-1 items-center justify-center gap-6 p-6">
    <ThemedView className="flex-1 items-center justify-center gap-6 p-6" safe={true}>
      <ThemedText textType="h1" className="text-primary">
        Hola Mundo
      </ThemedText>

      <ThemedText className="text-center w-10/12">
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

      <Link href="/about" className="rounded-xl bg-primary px-6 py-3">
        <ThemedText textType="semi-bold" className="text-white">
          Ir a &quot;Acerca de&quot;
        </ThemedText>
      </Link>

      <Link href="/themes" className="rounded-xl border border-border px-6 py-3">
        <ThemedText textType="semi-bold">Cambiar de tema</ThemedText>
      </Link>
    </ThemedView>
  );
}
