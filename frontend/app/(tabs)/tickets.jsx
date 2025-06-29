import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList } from 'react-native';

export default function MyTicketsScreen() {
  const { user } = useUser();

  const [bookedSeats, setBookedSeats] = useState([]); // <-- Add this line

  // fetch tickets by userId
  useEffect(() => {
    const fetchTickets = async () => {
      try {
      const userId = user?.$id; // Get the user ID from the user object

      const response = await fetch(`http://192.168.11.107:3000/api/tickets?userId=${userId}`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Assuming the response contains an array of tickets
        setBookedSeats(data);


      } catch (error) {
        console.error('Error fetching tickets:', error);
        setBookedSeats([]); // Handle error by setting an empty array
      }

    }
    fetchTickets();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="bg-[#ff5e5e] rounded-b-3xl px-4 pt-16 pb-2 mt-0 items-center">
        <Text className="text-white text-xl font-bold mb-11 mt-0">My Tickets</Text>
      </View>

      <View className="bg-white -mt-4 rounded-t-3xl px-4 pt-4 pb-8 flex-1">
        <FlatList
          data={bookedSeats}
          keyExtractor={(item) => item.$id }
          renderItem={({ item: ticket }) => (
            <View className="bg-gray-100 rounded-xl p-4 mb-6 shadow-md">
              {/* PNR */}
              <Text className="text-gray-400 text-xs mb-2">
                PNR/Ticket Info : <Text className="text-gray-600 font-bold">{ticket.company}</Text>
              </Text>
              {/* Pickup & Drop Info */}
              <View className="flex-row justify-between">
                {/* Left: Boarding & Drop */}
                <View className="flex-1">
                  <View className="mb-4">
                    <Text className="text-gray-500 text-xs">Boarding Point</Text>
                    <Text className="text-gray-700 text-sm font-medium mt-1 whitespace-pre-line">{ticket.from}</Text>
                  </View>
                  <View>
                    <Text className="text-gray-500 text-xs">Drop Point</Text>
                    <Text className="text-gray-700 text-sm font-medium mt-1 whitespace-pre-line">{ticket.to}</Text>
                  </View>
                </View>
                {/* Right: Time & Date */}
                <View className="items-end ml-4">
                  <View className="mb-6">
                    <Text className="text-black font-bold">{ticket.bustime}</Text>
                    <Text className="text-gray-500 text-xs">{ticket.busdate}</Text>
                    <Text className="text-[#FF5A5A] text-xs font-bold mt-1">TO</Text>
                  </View>
                  {/* If you have dropTime/dropDate, add here */}
                </View>
              </View>
              {/* Bus Info */}
              <View className="mt-4 flex-row justify-between items-center">
                <Text className="text-black font-semibold">{ticket.company}</Text>
                <Text className="text-gray-600 text-sm">Seat: {ticket.seatId}</Text>
              </View>
              <Text className="text-gray-400 text-xs mt-1">2x1 (30) A/C SLEEPER</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
