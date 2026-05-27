import React from "react";

import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthStack from "./AuthStack";
import AppTabs from "./bottomTabs/AppTabs";

const RootStack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <RootStack.Screen name="Auth" component={AuthStack} />
        <RootStack.Screen name="bottom" component={AppTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
