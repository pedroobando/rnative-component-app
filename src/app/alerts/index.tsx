import { Alert, ScrollView, View } from 'react-native';

import { ThemedButton, ThemedText, ThemedView } from '@/components';
import { useThemedAlert } from '@/hooks';

/**
 * Pantalla de alertas.
 *
 * `Alert.alert` (React Native) usa el diálogo nativo del sistema: no se puede
 * teñir con los colores del tema. Aquí se comparan ambas opciones:
 *
 *  - "Nativa"  -> `Alert.alert` (respeta el tema del SO, no el de la app).
 *  - "Themed"  -> `useThemedAlert()` (usa los tokens del tema activo).
 */
export default function AlertsScreen() {
  const { alert } = useThemedAlert();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-6 p-6 pb-12"
      contentInsetAdjustmentBehavior="automatic"
    >
      <ThemedView className="gap-2">
        <ThemedText textType="h2">Alertas</ThemedText>
        <ThemedText className="text-sm opacity-70">
          La alerta tematizada usa los colores del tema activo (light, dark, ocean…).
        </ThemedText>
      </ThemedView>

      <ThemedView className="gap-3">
        <ThemedText textType="semi-bold">Themed (usa el tema de la app)</ThemedText>

        <ThemedButton
          onPress={() =>
            alert({
              title: 'Alerta simple',
              message: 'Esta alerta está construida con los tokens del tema.',
            })
          }
        >
          Simple
        </ThemedButton>

        <ThemedButton
          onPress={() =>
            alert({
              title: 'Confirmar',
              message: '¿Quieres continuar con la acción?',
              buttons: [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Continuar', isPreferred: true },
              ],
            })
          }
        >
          Con botones
        </ThemedButton>

        <ThemedButton
          onPress={() =>
            alert({
              title: 'Eliminar elemento',
              message: 'Esta acción no se puede deshacer.',
              buttons: [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', isPreferred: true },
              ],
            })
          }
        >
          Destructiva
        </ThemedButton>

        <ThemedButton
          onPress={() =>
            alert({
              title: 'Solo título',
              dismissOnBackdrop: false,
              buttons: [{ text: 'Entendido', isPreferred: true }],
            })
          }
        >
          Sin mensaje
        </ThemedButton>
      </ThemedView>

      <ThemedView className="gap-3">
        <ThemedText textType="semi-bold">Nativa (Alert de React Native)</ThemedText>

        <View className="gap-3">
          <ThemedButton
            onPress={() =>
              Alert.alert('Alerta simple', 'Esta es la alerta nativa del sistema.')
            }
          >
            Simple
          </ThemedButton>

          <ThemedButton
            onPress={() =>
              Alert.alert('Confirmar', '¿Quieres continuar con la acción?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Continuar' },
              ])
            }
          >
            Con botones
          </ThemedButton>
        </View>
      </ThemedView>
    </ScrollView>
  );
}
