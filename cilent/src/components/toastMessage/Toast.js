import { StyleSheet, Text, View } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomToast = () => {
  const insets = useSafeAreaInsets();

  const config = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderWidth: 0 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: "400",
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 17,
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),

    customSuccess: ({ text1 }) => (
      <View
        style={[
          styles.customToastCont,
          {
            backgroundColor: "#CDE4CD",
            marginTop: insets.top - 10 ?? insets.top,
          },
        ]}
      >
        <AntDesign name="checkcircle" size={20} color="#0F7B0F" />
        <Text style={[styles.customTipTitle, { color: "#0F7B0F" }]}>
          {text1}
        </Text>
      </View>
    ),

    customWarning: ({ text1 }) => (
      <View
        style={[
          styles.customToastCont,
          {
            backgroundColor: "#EBDFCC",
            marginTop: insets.top - 10 ?? insets.top,
          },
        ]}
      >
        <AntDesign name="exclamationcircle" size={20} color="#9D5D00" />
        <Text style={[styles.customTipTitle, { color: "#9D5D00" }]}>
          {text1}
        </Text>
      </View>
    ),

    customFailure: ({ text1 }) => (
      <View
        style={[
          styles.customToastCont,
          {
            backgroundColor: "#FDE7E9",
            marginTop: insets.top - 10 ?? insets.top,
          },
        ]}
      >
        <MaterialCommunityIcons name="close-circle" size={20} color="#C42B1C" />
        <Text style={[styles.customTipTitle, { color: "#C42B1C" }]}>
          {text1}
        </Text>
      </View>
    ),
  };

  return (
    <Toast
      config={config}
      visibilityTime={1500}
      topOffset={0}
      autoHide={true}
    />
  );
};

const styles = StyleSheet.create({
  customToastCont: {
    width: "95%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    gap: 5,
    position: "absolute",
    top: 10,
    alignSelf: "center",
    zIndex: 9999,
    pointerEvents: "none",
  },
  customTipTitle: {
    fontFamily: "familyMedium",
    fontSize: 13,
    fontWeight: "400",
    flex: 1,
    marginLeft: 8,
  },
});

export default CustomToast;
