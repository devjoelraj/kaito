import React from "react";

import { View, Pressable, Text, StyleSheet, Platform } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const icons = {
  Dashboard: "dashboard",
  Expenses: "account-balance-wallet",
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom:
            Platform.OS === "ios" ? insets.bottom : Math.max(insets.bottom, 10),
        },
      ]}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable key={route.key} onPress={onPress} style={styles.tabItem}>
              <MaterialIcons
                name={icons[route.name]}
                size={24}
                color={focused ? "#2563EB" : "#94A3B8"}
              />

              <Text
                style={[
                  styles.label,
                  {
                    color: focused ? "#2563EB" : "#94A3B8",
                  },
                ]}
              >
                {route.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
    zIndex: 999,
  },

  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },

  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },

  label: {
    fontSize: 12,
    fontWeight: "500",
  },
});
