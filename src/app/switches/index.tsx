import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Uniwind, useUniwind } from 'uniwind';

import { ThemedSwitch, ThemedSwitchRow, ThemedText, ThemedView } from '@/components';
import { useResolvedColor } from '@/hooks';

export default function SwitchesScreen() {
  const { theme } = useUniwind();
  const background = useResolvedColor('background');

  // Switch simple.
  const [notifications, setNotifications] = useState(true);
  // Switch deshabilitado.
  const [locked, setLocked] = useState(false);
  // Switch con colores propios.
  const [wifi, setWifi] = useState(false);
  // Switch con color literal.
  const [priceAlerts, setPriceAlerts] = useState(false);
  // Switch que controla el tema de la app.
  const isDark = theme === 'dark';
  const [darkMode, setDarkMode] = useState(isDark);

  const toggleDarkMode = (value: boolean) => {
    setDarkMode(value);
    Uniwind.setTheme(value ? 'dark' : 'light');
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-6 p-6 pb-12"
      style={background ? { backgroundColor: background } : undefined}
    >
      <ThemedView className="gap-2">
        <ThemedText textType="h2">Switches</ThemedText>
        <ThemedText className="text-sm opacity-70">
          El <ThemedText className="text-sm">Switch</ThemedText> de React Native es un
          componente controlado: recibe `value` y notifica los cambios con `onValueChange`.
        </ThemedText>
      </ThemedView>

      {/* Switch básico */}
      <ThemedView className="gap-3 rounded-2xl border border-border p-4">
        <ThemedText textType="h3">Básico</ThemedText>

        <ThemedSwitchRow
          title="Notificaciones"
          description={notifications ? 'Recibes notificaciones' : 'Notificaciones silenciadas'}
          value={notifications}
          onValueChange={setNotifications}
        />

        <ThemedView className="h-px bg-border" />

        <ThemedText className="text-sm opacity-60">
          Estado actual: <ThemedText className="text-sm">{String(notifications)}</ThemedText>
        </ThemedText>
      </ThemedView>

      {/* Fila con el switch alineado a la derecha */}
      <ThemedView className="gap-1 rounded-2xl border border-border p-4">
        <ThemedText textType="h3">Con etiqueta</ThemedText>
        <ThemedText className="mb-2 text-sm opacity-60">
          Pulsa la fila entera para alternar el switch.
        </ThemedText>

        <ThemedSwitchRow
          title="Modo oscuro"
          description="Cambia el tema de la app al instante"
          value={darkMode}
          onValueChange={toggleDarkMode}
        />
      </ThemedView>

      {/* Deshabilitado y colores personalizados */}
      <ThemedView className="gap-3 rounded-2xl border border-border p-4">
        <ThemedText textType="h3">Estados y colores</ThemedText>

        <ThemedSwitchRow
          title="Wi-Fi"
          description="Switch con color propio (success)"
          value={wifi}
          onValueChange={setWifi}
          activeColor="success"
        />

        <ThemedView className="h-px bg-border" />

        <ThemedSwitchRow
          title="Opción bloqueada"
          description="No se puede cambiar (disabled)"
          value={locked}
          onValueChange={setLocked}
          disabled
        />
      </ThemedView>

      {/* Switch con color literal */}
      <ThemedView className="gap-3 rounded-2xl border border-border p-4">
        <ThemedText textType="h3">Color literal</ThemedText>
        <ThemedText className="text-sm opacity-60">
          `activeColor` y `inactiveColor` aceptan tokens del tema o colores sueltos.
        </ThemedText>

        <View className="flex-row items-center gap-4 py-2">
          <ThemedText className="flex-1 text-sm">Alertas de precio</ThemedText>
          <ThemedSwitch
            value={priceAlerts}
            onValueChange={setPriceAlerts}
            activeColor="#ef2967"
            inactiveColor="#e2e2e6"
          />
        </View>
      </ThemedView>
    </ScrollView>
  );
}
