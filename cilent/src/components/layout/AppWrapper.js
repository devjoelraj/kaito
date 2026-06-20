import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const ScreenWrapper = ({
  children,
  scroll = false,
  keyboard = false,
  backgroundColor = "#FFFFFF",
  contentContainerStyle = {},
  refreshing = false,
  onRefresh = null,
  barStyle = "dark-content",
  statusBarBackgroundColor,
}) => {
  const ContentWrapper = scroll ? ScrollView : View;

  const content = (
    <ContentWrapper
      style={styles.flex}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={
        scroll ? [styles.scrollContent, contentContainerStyle] : undefined
      }
      refreshControl={
        scroll && onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    >
      {children}
    </ContentWrapper>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor }]}
      edges={["top", "right", "left", "bottom"]}
    >
      <StatusBar
        translucent={false}
        backgroundColor={statusBarBackgroundColor || backgroundColor}
        barStyle={barStyle}
      />

      {keyboard ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },
});
