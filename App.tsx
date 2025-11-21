// App.tsx (novo para o projeto sejaatendido-rn)
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import DashboardScreen from "./src/screens/Dashboard";
import DoctorDashboard from "./src/screens/DoctorDashboard";
import AdminDashboard from "./src/screens/AdminDashboard";
import BookAppointment from "./src/screens/BookAppointment";
import Payment from "./src/screens/Payment";
import Profile from "./src/screens/Profile";
import Chat from "./src/screens/Chat";
import NotFoundScreen from "./src/screens/NotFound";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
