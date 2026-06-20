import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import { store } from "./src/store";
import AppNavigation from "./src/navigation/AppNavigation";
import CustomToast from "./src/components/toastMessage/Toast";

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <CustomToast />
          <AppNavigation />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
