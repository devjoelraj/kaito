import react from "react";
import { Text, View } from "react-native";
import ScreenWrapper from "../../components/layout/AppWrapper";

const Profile = () => {
  return (
    <ScreenWrapper backgroundColor="#0F172A" barStyle="light-content">
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 24,
          fontWeight: "bold",
          padding: 16,
        }}
      >
        Profile
      </Text>
    </ScreenWrapper>
  );
};

export default Profile;
