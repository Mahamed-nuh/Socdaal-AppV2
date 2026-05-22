import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import '@/global.css';
import { UserProvider } from '../context/UserContext';
import { TicketProvider } from '@/context/TicketContext';
import { BookingProvider } from '@/context/BookingContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null; // Optional: show splash/loading screen here
  }

  return (
      
    <UserProvider>  
      <TicketProvider>
        <BookingProvider>
          <Stack screenOptions={{ headerShown: false }}>
            {/* expo-router will auto handle (auth) and (tabs)/tabs.jsx */}
          </Stack>
          <StatusBar style="auto" />
        </BookingProvider>
      </TicketProvider>
    </UserProvider>
  );
}
