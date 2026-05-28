import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import CustomTabBar from "./CustomTabBar";
import ExpenseStack from "../stack/ExpenseTracker";
import DashboardStack from "../stack/Dashboard";
import TodoList from "../../screens/TodoList/TodoList";

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Expenses" component={ExpenseStack} />
      <Tab.Screen name="Todo" component={TodoList} />
    </Tab.Navigator>
  );
};

export default AppTabs;
