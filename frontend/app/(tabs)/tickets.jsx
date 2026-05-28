import { useUser } from '@/hooks/useUser';
import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getUserTickets } from '@/lib/seatapi'; // Added import
import { useFocusEffect } from 'expo-router';

export default function MyTicketsScreen() {
  const { user } = useUser();

  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch tickets by userId
  useFocusEffect(
    useCallback(() => {
      const fetchTickets = async () => {
        try {
          setLoading(true);
          const userId = user?.$id || user?.id; // Get the user ID from the user object

          if (!userId) {
            setBookedSeats([]);
            setLoading(false);
            return;
          }

          const data = await getUserTickets(userId);
          
          // Assuming the response contains an array of tickets
          setBookedSeats(data);
        } catch (error) {
          console.error('Error fetching tickets:', error);
          setBookedSeats([]); // Handle error by setting an empty array
        } finally {
          setLoading(false);
        }
      }

      fetchTickets();
    }, [user])
  );

  const getBusStatus = (dateStr, timeStr) => {
    if (!dateStr || !timeStr || dateStr === 'undefined' || timeStr === 'undefined') {
      return { isPassed: false, remainingText: 'Waqtiga lama yaqaan' };
    }
    
    // Attempt to parse 'DD/MM/YYYY'
    let day = 0, month = 0, year = 0;
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      year = parseInt(parts[2], 10);
      if (year < 100) year += 2000;
    } else if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts[0].length === 4) { // YYYY-MM-DD
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        day = parseInt(parts[2], 10);
      } else { // DD-MM-YYYY
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        year = parseInt(parts[2], 10);
      }
    } else {
       return { isPassed: false, remainingText: 'Waqti Aan La Aqoonsan' };
    }

    // Parse time '10:00 AM' or '14:30'
    let hours = 0;
    let minutes = 0;
    const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM|am|pm)?/i);
    if (timeMatch) {
       hours = parseInt(timeMatch[1], 10);
       minutes = parseInt(timeMatch[2], 10);
       const modifier = timeMatch[3];
       if (modifier) {
         if (modifier.toLowerCase() === 'pm' && hours < 12) hours += 12;
         if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;
       }
    }

    const busDateTime = new Date(year, month, day, hours, minutes);
    if (isNaN(busDateTime.getTime())) {
      return { isPassed: false, remainingText: 'Waqti khaldan' };
    }

    const now = new Date();
    const diffMs = busDateTime - now;
    const isPassed = diffMs < 0;

    let remainingText = "";
    if (isPassed) {
       remainingText = "Wuu baxay";
    } else {
       const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
       const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
       if (diffHrs > 24) {
          remainingText = `${Math.floor(diffHrs / 24)} maalmood baa dhiman`;
       } else if (diffHrs > 0) {
          remainingText = `${diffHrs} saac iyo ${diffMins} daq`;
       } else {
          remainingText = `${diffMins} daqaiiqo baa dhiman`;
       }
    }

    return { isPassed, remainingText };
  };

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center mt-20">
      <View className="bg-gray-200 p-6 rounded-full mb-4">
        <Ionicons name="ticket-outline" size={64} color="#ccc" />
      </View>
      <Text className="text-gray-500 text-lg font-medium">Ma jiraan wax tikidho ah</Text>
      <Text className="text-gray-400 text-sm mt-2 text-center px-8">
        Hadda wax tikidh ah ma aadan jaran, Fadlan booqo qaybta baska si aad u jarto.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#ff5e5e', borderBottomLeftRadius: 40, borderBottomRightRadius: 40, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 48, alignItems: 'center', zIndex: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 }}>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 1 }}>My Tickets</Text>
      </View>

      <View style={{ backgroundColor: '#f8f9fc', flex: 1, marginTop: -32, paddingTop: 32 }}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#ff5e5e" />
          </View>
        ) : (
          <FlatList
            data={bookedSeats}
            keyExtractor={(item, index) => item.$id || item._id || index.toString()}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, paddingTop: 16, flexGrow: 1 }}
            ListEmptyComponent={renderEmptyState}
            renderItem={({ item: ticket }) => {
              const safeDate = (ticket.busdate && ticket.busdate !== 'undefined') ? ticket.busdate : ((ticket.busDate && ticket.busDate !== 'undefined') ? ticket.busDate : 'N/A');
              const safeTime = (ticket.bustime && ticket.bustime !== 'undefined') ? ticket.bustime : ((ticket.busTime && ticket.busTime !== 'undefined') ? ticket.busTime : 'N/A');
              const { isPassed, remainingText } = getBusStatus(safeDate, safeTime);

              return (
              <View className={`bg-white rounded-2xl mb-6 shadow-sm border overflow-hidden ${isPassed ? 'border-red-300 opacity-90' : 'border-gray-100'}`}>
                {/* Ticket Top */}
                <View className="p-5 bg-white">
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center">
                      <View className={`p-2 rounded-full mr-3 ${isPassed ? 'bg-red-100' : 'bg-[#ffe5e5]'}`}>
                        <Ionicons name="bus" size={16} color={isPassed ? "#ef4444" : "#ff5e5e"} />
                      </View>
                      <Text className="text-gray-800 font-bold text-lg">{ticket.company}</Text>
                    </View>
                    <View className={`px-3 py-1 rounded-full ${isPassed ? 'bg-red-100' : 'bg-green-100'}`}>
                      <Text className={`text-xs font-bold ${isPassed ? 'text-red-600' : 'text-green-600'}`}>
                        {isPassed ? 'Dacay (Passed)' : 'Confirmed'}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center mt-2">
                    <View className="flex-1">
                      <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">From</Text>
                      <Text className="text-gray-800 text-base font-bold whitespace-pre-line" numberOfLines={2}>
                        {ticket.from}
                      </Text>
                    </View>
                    
                    <View className="items-center px-4">
                      <Ionicons name="arrow-forward" size={20} color={isPassed ? "#ef4444" : "#ff5e5e"} />
                    </View>

                    <View className="flex-1 items-end">
                      <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">To</Text>
                      <Text className="text-gray-800 text-base font-bold whitespace-pre-line text-right" numberOfLines={2}>
                        {ticket.to}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Ticket Divider (Dashed) */}
                <View className="flex-row items-center relative h-10 w-full overflow-hidden justify-center bg-white">
                  <View className="w-5 h-5 rounded-full bg-[#f8f9fc] absolute -left-2.5 z-10" />
                  <View className="w-full border-t border-dashed border-gray-300 mx-5" />
                  <View className="w-5 h-5 rounded-full bg-[#f8f9fc] absolute -right-2.5 z-10" />
                </View>

                {/* Ticket Bottom */}
                <View className="p-5 bg-white">
                  <View className="flex-row justify-between items-center">
                    <View flex={1}>
                      <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Date</Text>
                      <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={14} color="#666" style={{ marginRight: 4 }} />
                        <Text className="text-gray-800 font-semibold">{safeDate}</Text>
                      </View>
                    </View>
                    <View flex={1} style={{ alignItems: 'center' }}>
                      <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Time</Text>
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={14} color="#666" style={{ marginRight: 4 }} />
                        <Text className="text-gray-800 font-semibold">{safeTime}</Text>
                      </View>
                    </View>
                    <View flex={1} style={{ alignItems: 'flex-end' }}>
                      <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Seat</Text>
                      <Text className={isPassed ? "text-red-500 font-extrabold text-lg" : "text-[#ff5e5e] font-extrabold text-lg"}>{ticket.seatId}</Text>
                    </View>
                  </View>

                  {/* Enhanced Remaining Time Indicator */}
                  <View className={`mt-4 pt-3 border-t border-gray-100 flex-row items-center justify-center ${isPassed ? '' : 'bg-[#fff5f5] -mx-5 -mb-5 p-5'}`}>
                    <Ionicons name={isPassed ? "alert-circle-outline" : "timer-outline"} size={16} color={isPassed ? "#ef4444" : "#f59e0b"} style={{ marginRight: 6 }} />
                    <Text className={`text-sm font-bold ${isPassed ? 'text-red-500' : 'text-amber-600'}`}>
                      {remainingText}
                    </Text>
                  </View>
                </View>

              </View>
            )}}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
