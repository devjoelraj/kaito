import React from "react";
import { Text, View, StyleSheet } from "react-native";
import SafeScreen from "./src/components/layout/AppWrapper";
import AppNavigation from "./src/navigation/AppNavigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigation />
    </GestureHandlerRootView>
  );
}
