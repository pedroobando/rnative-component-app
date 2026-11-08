import { Link, router } from 'expo-router';
import { Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-6 p-6">
      <Text className="text-2xl font-bold text-text">Acerca de</Text>
      <Text className="text-center text-text">
        Esta es la ruta /about. El layout raíz (src/app/_layout.tsx) solo dibuja el Stack.
      </Text>

      {/* Navegación declarativa */}
      <Link href="/" className="rounded-xl bg-secondary px-6 py-3 font-semibold text-white">
        Volver al inicio (Link)
      </Link>

      {/* Navegación imperativa */}
      <Text
        onPress={() => router.push('/')}
        className="rounded-xl bg-tertiary px-6 py-3 font-semibold text-white"
      >
        Volver al inicio (router.push)
      </Text>
    </View>
  );
}
