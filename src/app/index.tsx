import { AppMenu, ThemedView } from '@/components';

export default function HomeScreen() {
  return (
    <ThemedView className="flex-1 bg-background">
      <AppMenu />
    </ThemedView>
  );
}
