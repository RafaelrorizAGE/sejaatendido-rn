import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import * as Linking from 'expo-linking';
import { getAuthSession } from './src/storage/asyncStorage';
import Colors from './src/theme/colors';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/Signup';
import HomeScreen from './src/screens/HomeScreen';
import Dashboard from './src/screens/Dashboard';
import DoctorDashboard from './src/screens/DoctorDashboard';
import AdminDashboard from './src/screens/AdminDashboard';
import BookAppointment from './src/screens/BookAppointment';
import Payment from './src/screens/Payment';
import Profile from './src/screens/Profile';
import Chat from './src/screens/Chat';
import ConfirmEmail from './src/screens/ConfirmEmail';
import ResetPassword from './src/screens/ResetPassword';

const Stack = createStackNavigator();

const linking = {
  prefixes: [Linking.createURL('/'), 'sejaatendido://'],
  config: {
    screens: {
      ConfirmEmail: 'confirmar-email',
      ResetPassword: 'resetar-senha',
      Login: 'login',
      Signup: 'cadastro',
    },
  },
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string>('Login');

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const { token, user } = await getAuthSession();

      if (token && user) {
        switch (user.tipo) {
          case 'ADMIN':
            setInitialRoute('AdminDashboard');
            break;
          case 'MEDICO':
            setInitialRoute('DoctorDashboard');
            break;
          case 'PACIENTE':
            setInitialRoute('Dashboard');
            break;
          default:
            setInitialRoute('Login');
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="ConfirmEmail" component={ConfirmEmail} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="BookAppointment" component={BookAppointment} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
