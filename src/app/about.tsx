import { Link, router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AboutScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center gap-6 p-6" safe>
      <ThemedText textType="h1">Acerca de</ThemedText>

      <ThemedText className="w-10/12 text-center">
        Esta es la ruta /about. El layout raíz (src/app/_layout.tsx) solo dibuja el Stack.
      </ThemedText>

      {/* Navegación declarativa */}
      <Link href="/" className="rounded-xl bg-secondary px-6 py-3">
        <ThemedText textType="semi-bold" className="text-white">
          Volver al inicio (Link)
        </ThemedText>
      </Link>

      {/* Navegación imperativa */}
      <ThemedText
        onPress={() => router.push('/')}
        className="rounded-xl bg-tertiary px-6 py-3 text-white"
        textType="semi-bold"
      >
        Volver al inicio (router.push)
      </ThemedText>
    </ThemedView>
  );
}
