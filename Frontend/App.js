import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RegisterScreen from "./src/Screen/RegisterScreen";
import LoginScreen from "./src/Screen/LoginScreen";
import LibraryScreen from "./src/Screen/LibraryScreen";
import BookingScreen from "./src/Screen/BookingScreen";
import ItemloanScreen from "./src/Screen/ItemloanScreen";
import ProfileScreen from "./src/Screen/ProfileScreen";
import NotificationScreen from "./src/Screen/NotificationScreen";
import LoanStatusScreen from "./src/Screen/LoanStatusScreen";
import { Ionicons } from "@expo/vector-icons";
import ReservationStatusScreen from "./src/Screen/ReservationStatusScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Regis"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notification"
          component={NotificationScreen}
          options={{
            headerStyle: {
              height: 40,
            },
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerStyle: {
              height: 40,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainTabNavigator({ route }) {
  const { name, user_id, token } = route.params || {}; // รับค่าจาก LoginScreen

  console.log("MainTabNavigator received params:", { name, user_id, token });

  if (!name) {
    console.error("Name is undefined. Ensure it's passed correctly from the LoginScreen.");
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Library") {
            iconName = focused ? "library" : "library-outline";
          } else if (route.name === "Rooms") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Items") {
            iconName = focused ? "albums" : "albums-outline";
          } else if (route.name === "Loans") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "ReservationStatus") {
            iconName = focused ? "checkmark" : "checkmark-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#B68D40",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        initialParams={{ name, user_id, token }}
        options={{ headerStyle: { height: 40 } }}
      />
      <Tab.Screen
        name="Rooms"
        component={BookingScreen}
        initialParams={{ name, user_id, token }}
        options={{ headerStyle: { height: 40 } }}
      />
      <Tab.Screen
        name="Items"
        component={ItemloanScreen}
        initialParams={{ name, user_id, token }}
        options={{ headerStyle: { height: 40 } }}
      />
      <Tab.Screen
        name="Loans"
        component={LoanStatusScreen}
        initialParams={{ name, user_id, token }}
        options={{ headerStyle: { height: 40 } }}
      />
      <Tab.Screen
        name="ReservationStatus"
        component={ReservationStatusScreen}
        initialParams={{ name, user_id, token }}
        options={{ headerStyle: { height: 40 } }}
      />
    </Tab.Navigator>
  );
}

