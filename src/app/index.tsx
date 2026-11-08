import { Link } from 'expo-router';
import { Text, View } from 'react-native';

const palette = [
  { name: 'primary', className: 'bg-primary' },
  { name: 'secondary', className: 'bg-secondary' },
  { name: 'tertiary', className: 'bg-tertiary' },
  { name: 'success', className: 'bg-success' },
];

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-6 p-6">
      <Text className="text-3xl font-bold text-primary">Hola Mundo</Text>
      <Text className="text-center text-text">
        Paleta definida en el tema de Uniwind (src/global.css)
      </Text>

      <View className="flex-row gap-4">
        {palette.map((color) => (
          <View key={color.name} className={`h-16 w-16 rounded-2xl ${color.className}`} />
        ))}
      </View>

      <Text className="text-sm text-text">
        bg-primary · bg-secondary · bg-tertiary · bg-success
      </Text>

      <Link href="/about" className="rounded-xl bg-primary px-6 py-3 font-semibold text-white">
        Ir a &quot;Acerca de&quot;
      </Link>
    </View>
  );
}
