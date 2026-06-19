import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../../components/layout/AppWrapper";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

const Profile = ({ navigation }) => {
  const [loggingOut, setLoggingOut] = useState(false);

  // Mock User Data
  const user = {
    name: "Joel",
    email: "joel@example.com",
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            setLoggingOut(true);
            try {
              await AsyncStorage.removeItem("token");
              navigation.reset({
                index: 0,
                routes: [{ name: "Auth" }],
              });
            } catch (error) {
              console.error("Error logging out: ", error);
              setLoggingOut(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const SettingsRow = ({ icon, title, color, onPress }) => (
    <TouchableOpacity
      style={styles.settingRow}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[styles.settingIconBg, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.settingTitle}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#64748B" />
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper scroll backgroundColor="#0F172A" barStyle="light-content">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <LinearGradient
          colors={["#1E1B4B", "#0F172A"]}
          style={styles.profileCard}
        >
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={["#A855F7", "#6366F1"]}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
            </LinearGradient>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </LinearGradient>

        {/* Settings List */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsContainer}>
          <SettingsRow
            icon="person-outline"
            title="Edit Profile"
            color="#3B82F6"
          />
          <SettingsRow
            icon="notifications-outline"
            title="Notifications"
            color="#F59E0B"
          />
        </View>

        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.settingsContainer}>
          <SettingsRow
            icon="help-circle-outline"
            title="Help Center"
            color="#06B6D4"
          />
          <SettingsRow
            icon="information-circle-outline"
            title="About Us"
            color="#64748B"
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator color="#F43F5E" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} color="#F43F5E" />
              <Text style={styles.logoutText}>Log Out</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.versionText}>Kaito App v1.0.0</Text>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: 30,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#0F172A",
  },
  avatarGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: "#818CF8",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#94A3B8",
    marginBottom: 12,
    marginLeft: 4,
  },
  settingsContainer: {
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  settingIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    color: "#E2E8F0",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(244, 63, 94, 0.1)",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(244, 63, 94, 0.2)",
    marginBottom: 24,
    gap: 8,
  },
  logoutText: {
    color: "#F43F5E",
    fontSize: 16,
    fontWeight: "600",
  },
  versionText: {
    textAlign: "center",
    color: "#475569",
    fontSize: 12,
    fontWeight: "500",
  },
});
