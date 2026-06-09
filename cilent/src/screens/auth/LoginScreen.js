import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

import ScreenWrapper from "../../components/layout/AppWrapper";

import { loginService, registerService } from "../../api/authServices";

const LoginScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleAuth = async () => {
    try {
      setErrorMessage("");

      if (!email || !password) {
        setErrorMessage("Please fill all required fields");
        return;
      }

      if (!isLogin && !name.trim()) {
        setErrorMessage("Please enter your name");
        return;
      }

      setLoading(true);

      let response;

      if (isLogin) {
        response = await loginService(email, password);
      } else {
        response = await registerService(name, email, password);
      }

      await AsyncStorage.setItem("token", response.token);

      navigation.replace("bottom");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          (isLogin ? "Login failed" : "Registration failed"),
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);

    setName("");
    setEmail("");
    setPassword("");
    setErrorMessage("");
  };

  return (
    <ScreenWrapper keyboard backgroundColor="#0F172A" barStyle="light-content">
      <LinearGradient
        colors={["#0F172A", "#1E1B4B", "#0F172A"]}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.title}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </Text>

          <Text style={styles.subtitle}>
            {isLogin
              ? "Login to continue"
              : "Create your account to get started"}
          </Text>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          {!isLogin && (
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#94A3B8" />

              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#64748B"
                value={name}
                onChangeText={setName}
              />
            </View>
          )}

          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#94A3B8" />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#64748B"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#64748B"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            disabled={loading}
            onPress={handleAuth}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#6366F1", "#4F46E5"]}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? "Login" : "Create Account"}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={switchMode} style={styles.linkContainer}>
            <Text style={styles.link}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.replace("bottom")}
            style={styles.demoContainer}
          >
            <Text style={styles.demoLink}>Continue as Demo User</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScreenWrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  card: {
    backgroundColor: "rgba(30,41,59,0.75)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    color: "#94A3B8",
    marginTop: 6,
    marginBottom: 24,
  },

  errorText: {
    color: "#EF4444",
    marginBottom: 15,
    fontSize: 14,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    borderRadius: 14,
    backgroundColor: "#111827",
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  input: {
    flex: 1,
    color: "#FFFFFF",
    marginLeft: 10,
    fontSize: 15,
  },

  button: {
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  linkContainer: {
    marginTop: 20,
  },

  link: {
    textAlign: "center",
    color: "#6366F1",
    fontWeight: "600",
    fontSize: 14,
  },

  demoContainer: {
    marginTop: 14,
  },

  demoLink: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 14,
  },
});
