import { Stack } from 'expo-router';
import { TodoProvider } from '@/stores/TodoContext';

const RootLayout = () => (
  <TodoProvider>
    <Stack screenOptions={{ headerShown: false }} />
  </TodoProvider>
);
export default RootLayout;
