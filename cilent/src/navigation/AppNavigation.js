import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthStack from "./AuthStack";
import AppTabs from "./bottomTabs/AppTabs";
import LoadingSpinner from "../components/loading/LoadingSpinner";

const RootStack = createNativeStackNavigator();

const AppNavigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("Auth");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          setInitialRoute("bottom");
        }
      } catch (error) {
        console.error("Failed to check token", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0F172A" }}>
        <LoadingSpinner color="#6C7CFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName={initialRoute}
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
