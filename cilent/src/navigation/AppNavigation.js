import React, { useEffect } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector, useDispatch } from "react-redux";

import { initializeAuth } from "../store/slices/authSlice";
import AuthStack from "./AuthStack";
import AppTabs from "./bottomTabs/AppTabs";
import LoadingSpinner from "../components/loading/LoadingSpinner";

const RootStack = createNativeStackNavigator();

const AppNavigation = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isInitializing } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (isInitializing) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0F172A" }}>
        <LoadingSpinner color="#6C7CFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <RootStack.Screen name="bottom" component={AppTabs} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
