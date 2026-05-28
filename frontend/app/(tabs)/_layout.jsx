import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import UserOnly from "@/components/auth/UserOnly";

const _layout = () => {
  return (
    <UserOnly>
      <Tabs
        screenOptions={{
          tabBarStyle: { backgroundColor: "#FF5A5A" },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "black",
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: "Home",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="tickets"
          options={{
            tabBarLabel: "Tickets",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ticket-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel: "Settings",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </UserOnly>
  );
};

export default _layout;

