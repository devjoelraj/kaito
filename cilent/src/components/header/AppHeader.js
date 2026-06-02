import React from "react";

import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const AppHeader = ({
  title = "",
  showBackButton = false,

  onBackPress,

  leftComponent,
  rightComponent,

  backgroundColor = "#FFFFFF",
  titleColor = "#111827",

  barStyle = "dark-content",
}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={[
        styles.safeArea,
        {
          backgroundColor,
        },
      ]}
    >
      <StatusBar backgroundColor={backgroundColor} barStyle={barStyle} />

      <View style={styles.container}>
        {/* LEFT */}
        <View style={styles.side}>
          {leftComponent ? (
            leftComponent
          ) : showBackButton ? (
            <Pressable style={styles.iconButton} onPress={handleBack}>
              <MaterialIcons
                name="arrow-back-ios-new"
                size={22}
                color={titleColor}
              />
            </Pressable>
          ) : null}
        </View>

        {/* CENTER */}
        <View style={styles.center}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              {
                color: titleColor,
              },
            ]}
          >
            {title}
          </Text>
        </View>

        {/* RIGHT */}
        <View style={styles.side}>{rightComponent}</View>
      </View>
    </SafeAreaView>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  safeArea: {
    zIndex: 999,
  },

  container: {
    height: 56,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
  },

  side: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 10,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },

  iconButton: {
    height: 40,
    width: 40,

    justifyContent: "center",
    alignItems: "center",
  },
});
