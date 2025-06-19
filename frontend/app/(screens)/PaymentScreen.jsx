import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { CreditCard, DollarSign } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '../../hooks/useUser';
import axios from 'axios';

const PaymentMethod = ({ icon, name, selected, onSelect }) => (
  <TouchableOpacity
    className={`flex-row items-center p-4 rounded-lg mb-4 ${
      selected ? 'bg-blue-100 border border-blue-500' : 'bg-gray-100'
    }`}
    onPress={onSelect}
  >
    {icon}
    <Text className="ml-4 text-lg font-semibold">{name}</Text>
  </TouchableOpacity>
);

const PaymentsScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState('zaad');
  const [senderNumber, setSenderNumber] = useState('');
  const router = useRouter();
  const { user } = useUser();

  const {
    from,
    to,
    busDate,
    busTime,
    company,
    seats,
    totalPrice,
    price,
  } = useLocalSearchParams();


const handlePayment = async () => {
  if (!senderNumber.trim()) {
    Alert.alert("Error", "Fadlan geli numberka lagasoo dirayo.");
    return;
  }

  const seatArray = seats.split(',');

  try {
    for (const seatId of seatArray) {
      // Changed URL to match backend route and use HTTP
      const response = await axios.post("http://192.168.11.107:3000/api/tickets", {
        userId: user?.$id,
        userName: user?.name,
        company,
        from,
        to,
        busTime,
        busDate,
        paymentMethod: selectedMethod,
        bookedNumber: senderNumber,

      });

      // Check if response is successful
      if (response.status === 201) {
        console.log("✅ Ticket created:", response.data);
      } else {
        console.warn("⚠️ Unexpected response:", response.status);
        Alert.alert("Error", "Failed to create ticket.");
        return;
      }
    }

    // All tickets created successfully
    console.log("✅ All tickets created. Redirecting...");
    router.push("/(tabs)/tickets");

  } catch (error) {
    console.error("❌ Ticket creation error:", error);
    Alert.alert("Error", "Failed to complete booking. Please try again.");
  }
};


  return (
    <ScrollView className="flex-1 bg-white">
      <View className="bg-[#FF5A5A] py-12 px-4 rounded-b-3xl">
        <View className="flex-row items-center justify-between mt-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2"
          >
            <Text className="text-5xl text-white">{'‹'}</Text>
          </TouchableOpacity>
          <Text className="text-white text-xl text-center flex-1 font-bold-">
            Payments
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </View>
      <View className="p-6">

        <View className="bg-gray-100 rounded-xl p-4 mb-6 shadow-md ">
            {/* Ticket Number Placeholder */}
            <Text className="text-gray-400 text-xs mb-2">
                Ticket Info: <Text className="text-gray-600 font-bold">{company} - {busTime}</Text>
            </Text>

            {/* Pickup & Drop Info */}
            <View className="flex-row justify-between">
                {/* From & To */}
                <View className="flex-1">
                <View className="mb-4">
                    <Text className="text-gray-500 text-xs">From</Text>
                    <Text className="text-gray-700 text-sm font-medium mt-1">{from}</Text>
                </View>

                <View>
                    <Text className="text-gray-500 text-xs">To</Text>
                    <Text className="text-gray-700 text-sm font-medium mt-1">{to}</Text>
                </View>
                </View>

                {/* Time & Date */}
                <View className="items-end ml-4">
                <View className="mb-6">
                    <Text className="text-black font-bold">{busTime}</Text>
                    <Text className="text-gray-500 text-xs">{busDate}</Text>
                </View>
                </View>
                </View>

                {/* Bus Info */}
                <View className="mt-4 flex-row justify-between items-center">
                    <Text className="text-black font-semibold">{company}</Text>
                    <Text className="text-gray-600 text-sm">Seat: {seats} </Text>
                </View>
                <Text className="text-gray-400 text-xs mt-1">2x1 (30) A/C SLEEPER</Text>
                </View>


        {/* Payment Method */}
        <Text className="text-xl font-semibold mb-4">Select Payment Method</Text>
        <PaymentMethod
          icon={<CreditCard size={24} color={selectedMethod === 'zaad' ? '#3B82F6' : '#6B7280'} />}
          name="Zaad"
          selected={selectedMethod === 'zaad'}
          onSelect={() => setSelectedMethod('zaad')}
        />
        <PaymentMethod
          icon={<DollarSign size={24} color={selectedMethod === 'edahab' ? '#3B82F6' : '#6B7280'} />}
          name="Edahab"
          selected={selectedMethod === 'edahab'}
          onSelect={() => setSelectedMethod('edahab')}
        />

        {/* Input */}
        <Text className="text-xl font-semibold mb-4 mt-6">Number</Text>
        <TextInput
          className="bg-gray-100 p-4 rounded-lg mb-4"
          placeholder="Numberka lagasoo dirayo"
          placeholderTextColor={'grey'}
          keyboardType="numeric"
          value={senderNumber}
          onChangeText={setSenderNumber}
        />

        {/* Summary */}
        <View className="mt-6">
          <Text className="text-xl font-semibold mb-4">Payment Summary</Text>
          <View className="bg-gray-100 p-4 rounded-lg">
            <View className="flex-row justify-between mb-2">
              <Text>Subtotal</Text>
              <Text>${price}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text>Total</Text>
              <Text className="font-bold">${totalPrice}</Text>
            </View>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          onPress={handlePayment}
          className="bg-[#FF8C42] p-4 rounded-lg mt-6"
        >
          <Text className="text-white text-center text-lg font-bold">
            Confirm Payment
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PaymentsScreen;
