import { Link } from 'expo-router';
import { Pressable, ScrollView } from 'react-native';
import { Uniwind, useUniwind } from 'uniwind';

import { ThemedText, ThemedView } from '@/components';
import { appThemes, type UniwindThemeName } from '@/constants/themes';
import { useResolvedColor } from '@/hooks';

export default function ThemesScreen() {
  const { theme, hasAdaptiveThemes } = useUniwind();
  const background = useResolvedColor('background');

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 p-6 pb-12">
      <ThemedView className="gap-4">
        <ThemedView className="gap-2">
          <ThemedText textType="h2">
            Temas
          </ThemedText>
          <ThemedText className="text-sm opacity-70">
            {hasAdaptiveThemes ? 'Siguiendo el tema del sistema' : `Tema activo: ${theme}`}
          </ThemedText>
        </ThemedView>

        <ThemedView className="gap-3">
          {appThemes.map((item) => {
            const isActive = item.name === theme;
            // Sobre el color primario, los temas oscuros necesitan texto claro.
            const activeColor = item.scheme === 'dark' ? background : '#ffffff';

            return (
              <Pressable
                key={item.name}
                onPress={() => Uniwind.setTheme(item.name as UniwindThemeName)}
                className={`flex-row items-center gap-4 rounded-2xl border border-border p-4 ${
                  isActive ? 'bg-primary' : 'bg-background'
                }`}
              >
                <ThemedText textType="h3">{item.icon}</ThemedText>

                <ThemedView className="flex-1">
                  <ThemedText
                    textType="semi-bold"
                    style={isActive ? { color: activeColor } : undefined}
                  >
                    {item.label}
                  </ThemedText>
                  <ThemedText
                    className={isActive ? 'text-sm opacity-80' : 'text-sm opacity-60'}
                    style={isActive ? { color: activeColor } : undefined}
                  >
                    {item.scheme === 'dark' ? 'Fondo oscuro' : 'Fondo claro'} · {item.name}
                  </ThemedText>
                </ThemedView>

                {isActive ? (
                  <ThemedText textType="semi-bold" style={{ color: activeColor }}>
                    ✓
                  </ThemedText>
                ) : null}
              </Pressable>
            );
          })}
        </ThemedView>

        <Link href="/" className="rounded-xl bg-primary px-6 py-3 text-center">
          <ThemedText textType="semi-bold" className="text-white">
            Volver al inicio
          </ThemedText>
        </Link>
      </ThemedView>
    </ScrollView>
  );
}
