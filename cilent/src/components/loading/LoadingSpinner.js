import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const LoadingSpinner = ({ 
  size = "large", 
  color = "#6C7CFF", 
  backgroundColor = "transparent" 
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoadingSpinner;
