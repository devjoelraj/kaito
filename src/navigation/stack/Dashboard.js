import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Expense from "../../screens/expenseTracker/Expense";
import Dashboard from "../../screens/dashboard/Dashboard";

const Stack = createNativeStackNavigator();

const DashboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="DashboardHome" component={Dashboard} />
    </Stack.Navigator>
  );
};

export default DashboardStack;
