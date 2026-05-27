import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Expense from "../../screens/expenseTracker/Expense";

const Stack = createNativeStackNavigator();

const ExpenseStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="ExpenseHome" component={Expense} />
    </Stack.Navigator>
  );
};

export default ExpenseStack;
