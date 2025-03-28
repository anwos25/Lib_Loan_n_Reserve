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


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Regis" component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Notification" component={NotificationScreen} 
          options={{ 
          headerStyle: { 
            height: 40
          } 
        }}/>
        <Stack.Screen name="Profile" component={ProfileScreen} 
          options={{ 
          headerStyle: { 
            height: 40
          } 
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainTabNavigator() {
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
          } else if (route.name === "Profile") {
            iconName = focused ? "person-circle" : "person-circle-outline";
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
        options={{ 
          headerStyle: { 
            height: 40
          } 
        }} 
      />
      <Tab.Screen name="Rooms" component={BookingScreen}   
        options={{ 
          headerStyle: { 
            height: 40
          } 
        }} />
      <Tab.Screen name="Items" component={ItemloanScreen}   
        options={{ 
          headerStyle: { 
            height: 40
          } 
        }} />
      <Tab.Screen name="Loans" component={LoanStatusScreen}    
        options={{ 
          headerStyle: { 
            height: 40
          } 
        }} />
    </Tab.Navigator>
  );
}
