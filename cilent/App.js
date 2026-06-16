import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AppNavigation from "./src/navigation/AppNavigation";
import CustomToast from "./src/components/toastMessage/Toast";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CustomToast />
        <AppNavigation />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
