import React from "react";

import { View, Pressable, Text, StyleSheet, Platform } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";

const icons = {
  Dashboard: "dashboard",
  Expenses: "account-balance-wallet",
  Todo: "checklist",
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
              {route.name === "Todo" ? (
                <Octicons
                  name="checklist"
                  size={24}
                  color={focused ? "#818CF8" : "#64748B"}
                />
              ) : (
                <MaterialIcons
                  name={icons[route.name]}
                  size={24}
                  color={focused ? "#818CF8" : "#64748B"}
                />
              )}

              <Text
                style={[
                  styles.label,
                  {
                    color: focused ? "#818CF8" : "#64748B",
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
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    borderRadius: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
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
    fontWeight: "600",
  },
});
