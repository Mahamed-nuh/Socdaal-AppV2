import { View, Text, TextInput, TouchableOpacity, Image, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useUser } from '../../hooks/useUser';  

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Only call useUser once and destructure all needed values
  const { login, logout } = useUser();

  // Function to handle login
  const handleSubmit = async () => {
    setError(null); // Reset error state

    try {
      await login(email, password);
      router.push('/(tabs)/home'); // Redirect to home page after successful login
    } catch (error) {
      setError(error.message); // Set error message if login fails
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-white justify-center px-6">
          {/* Back button in top left corner using Tailwind CSS */}
          <TouchableOpacity
            className="absolute top-10 left-5 z-10"
            onPress={() => router.back()}
          >
            <Text className="text-l text-gray-800">Back</Text>
          </TouchableOpacity>
          <Image
            source={require('../../assets/images/Bus-Booking-Engine.png')}
            className="w-56 h-56 self-center mb-6 mt-0"
            resizeMode="contain"
          />
          <Text className="text-xl font-bold text-center mt-4 ">Welcome</Text>
          <Text className="text-sm text-center text-gray-500 mb-6">kusoo dhowoow Socdaal Transportation</Text>

          <TextInput 
            placeholder="Email" 
            keyboardType='email-address'
            className="border px-4 py-2 rounded mb-4" 
            placeholderTextColor={'grey'}
            onChangeText={setEmail}
            value={email}
          />
          <TextInput 
            placeholder="Password" 
            className="border px-4 py-2 rounded mb-6"
            secureTextEntry 
            placeholderTextColor={'grey'}
            onChangeText={setPassword}
            value={password}
          />

          <TouchableOpacity className="bg-orange-400 py-3 rounded-full mb-3" onPress={handleSubmit}>
            <Text className="text-white text-center font-bold">Login</Text>
          </TouchableOpacity>
          
          {error && <Text className="text-red-500 text-center mb-4">{error}</Text>}

          <Text className="text-center">
            Don’t have an account?{' '}
            <Text className="text-orange-400" onPress={() => router.push('/(auth)/signup')}>
              Create here
            </Text>
          </Text>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
