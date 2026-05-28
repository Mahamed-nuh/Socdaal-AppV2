import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, Pressable, ActivityIndicator, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router"; 
import { Ionicons } from "@expo/vector-icons";
import { getBuses } from "@/lib/busApi";

export default function BusSelectionScreen() {
  const { from, to, date } = useLocalSearchParams();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Track network errors

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBuses(from, to, date);
        if (Array.isArray(data)) {
          setBuses(data);
        } else {
          setBuses([]);
        }
      } catch (e) {
        console.error("Error fetching buses:", e);
        setError("Network connection failed. Please ensure you have internet access.");
        setBuses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, [from, to, date]);

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center mt-12 px-6">
      <View className="bg-gray-100 p-6 rounded-full mb-4">
        {error ? (
          <Ionicons name="cloud-offline-outline" size={64} color="#ff5e5e" />
        ) : (
          <Ionicons name="bus-outline" size={64} color="#ccc" />
        )}
      </View>
      <Text className="text-gray-500 text-lg font-bold text-center">
        {error ? "Cilad Network-ka ah" : "Ma jiraan basas la helay"}
      </Text>
      <Text className="text-gray-400 text-sm mt-2 text-center">
        {error 
          ? "Kuma awoodno inaan xiririino server-ka. Fadlan hubi internet-kaaga iyo in backend-kaagu shaqaynayo."
          : `Kama helin wax basas ah oo u socda ${to} taariikhda ${date}. Fadlan dooro taariikh kale.`
        }
      </Text>
      <TouchableOpacity 
        className="mt-6 bg-[#ff5e5e] px-6 py-3 rounded-full shadow-sm"
        onPress={() => {
          if (error) {
             router.replace('/'); // Adjust depending on your home tab route
          } else {
             router.back();
          }
        }}
      >
        <Text className="text-white font-bold">Dib u noqo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-[#f8f9fc]">
      {/* Header */}
      <View className="bg-[#ff5e5e] pt-14 pb-10 px-6 rounded-b-[40px] shadow-lg z-10">
        <SafeAreaView>
          <View className="flex-row items-center justify-between mb-4 mt-2">
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              className="p-2 rounded-full"
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-extrabold tracking-wide flex-1 text-center">
              Dooro Bus
            </Text>
            <View className="w-10" />
          </View>

          {/* Corrected Layout: Avoiding icon inside Text component to prevent crashes */}
          <View className="flex-row items-center justify-center space-x-3 mb-2">
            <Text className="text-white text-lg font-bold">{from}</Text>
            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} className="p-1.5 rounded-full mx-2">
              <Ionicons name="swap-horizontal" size={16} color="white" />
            </View>
            <Text className="text-white text-lg font-bold">{to}</Text>
          </View>
          
          <View className="flex-row items-center justify-center">
            <Ionicons name="calendar-outline" size={14} color="white" style={{ opacity: 0.9, marginRight: 6 }} />
            <Text className="text-white text-sm font-medium opacity-90">{date}</Text>
          </View>
          
          {/* We can hide or resize the bus image to make it look cleaner and less cluttered */}
          <View className="absolute -bottom-16 opacity-10 right-0">
             <Ionicons name="bus" size={120} color="white" />
          </View>
        </SafeAreaView>
      </View>

      <View className="flex-1 -mt-6 pt-6">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#ff5e5e" />
            <Text className="mt-4 text-gray-500 font-medium">Baaraya basaska...</Text>
          </View>
        ) : (
          <FlatList
            data={buses}
            keyExtractor={(item, index) => item._id || index.toString()}
            contentContainerClassName="px-4 pb-8 pt-4"
            ListEmptyComponent={renderEmptyState}
            renderItem={({ item }) => (
              <Pressable onPress={() => {
                const query = `company=${encodeURIComponent(item.company)}&busTime=${item.busTime}&price=${item.price}&durationTime=${item.durationTime}&busDate=${item.date || date}&seats=${item.seats}&from=${from}&to=${to}`;
                router.push('/SeatSelection?' + query);
              }}>
                <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5 overflow-hidden">
                  
                  {/* Top Row: Company & Price */}
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center flex-1">
                      <View className="bg-[#ffe5e5] p-2.5 rounded-full mr-3">
                        <Ionicons name="bus-outline" size={20} color="#ff5e5e" />
                      </View>
                      <Text className="text-xl font-extrabold text-gray-800 flex-shrink">{item.company}</Text>
                    </View>
                    <Text className="text-xl font-black text-[#ff5e5e]">{item.price}</Text>
                  </View>

                  {/* Middle Row: Times */}
                  <View className="flex-row justify-between items-center bg-[#f8f9fc] p-3 rounded-xl mb-4">
                    <View className="flex-row items-center">
                      <Ionicons name="time-outline" size={18} color="#666" />
                      <View className="ml-2">
                        <Text className="text-gray-400 text-[10px] uppercase font-bold">Waqtiga Bixitaanka</Text>
                        <Text className="text-gray-800 font-bold">{item.busTime}</Text>
                      </View>
                    </View>
                    
                    <View className="border-l border-gray-300 h-8 mx-4" />
                    
                    <View className="flex-row items-center">
                      <Ionicons name="hourglass-outline" size={18} color="#666" />
                      <View className="ml-2">
                        <Text className="text-gray-400 text-[10px] uppercase font-bold">Muddada</Text>
                        <Text className="text-gray-800 font-bold">{item.durationTime}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Bottom Row: Availability */}
                  <View className="flex-row items-center justify-between mt-1">
                    <View className="flex-row items-center">
                      <Ionicons name="people-outline" size={16} color={item.seats > 5 ? "#10b981" : "#f59e0b"} />
                      <Text className={['ml-1.5 font-semibold', item.seats > 5 ? "text-emerald-500" : "text-amber-500"].filter(Boolean).join(' ')}>
                        {item.seats} Kursi baa hadhey
                      </Text>
                    </View>
                    <View className="bg-gray-100 p-1.5 rounded-full">
                       <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                    </View>
                  </View>
                </View>
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}
