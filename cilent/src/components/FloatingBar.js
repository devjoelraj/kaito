import React from "react";

import { TouchableOpacity, StyleSheet, Platform, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const FloatingBar = ({ onPress = () => {} }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          bottom: Platform.OS === "ios" ? insets.bottom + 90 : 90,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button}
        onPress={onPress}
      >
        <MaterialIcons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default FloatingBar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 24,
    zIndex: 9999,
    elevation: 999,
  },

  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
});
