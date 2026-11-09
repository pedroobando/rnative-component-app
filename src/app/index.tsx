import { ThemedView } from '@/components/ThemedView';
import { AppMenu } from '@/components/menu/app-menu';

export default function HomeScreen() {
  return (
    <ThemedView className="flex-1 bg-background">
      <AppMenu />
    </ThemedView>
  );
}
