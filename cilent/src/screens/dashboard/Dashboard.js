import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Animated,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ScreenWrapper from "../../components/layout/AppWrapper";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

import { getDashboardDataAPI } from "../../api/dashBoard";
import { getBudgetService } from "../../api/expenseService";

const { width } = Dimensions.get("window");

const DashboardSkeleton = () => {
  const fadeAnim = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ opacity: fadeAnim, width: '100%', marginTop: 10 }}>
      {/* Stats Cards */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        <View style={{ flex: 1, height: 130, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20 }} />
        <View style={{ flex: 1, height: 130, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20 }} />
      </View>
      {/* Quick Actions Title */}
      <View style={{ width: 120, height: 20, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10, marginBottom: 14 }} />
      {/* Quick Actions Buttons */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        <View style={{ flex: 1, height: 68, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16 }} />
        <View style={{ flex: 1, height: 68, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16 }} />
      </View>
      {/* Next Up Title */}
      <View style={{ width: 140, height: 20, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10, marginBottom: 14 }} />
      {/* Spotlight Card */}
      <View style={{ height: 90, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20 }} />
    </Animated.View>
  );
};

const Dashboard = ({ navigation }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [budgetLimit, setBudgetLimit] = useState(1300);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        try {
          setLoading(true);
          const today = new Date();
          const year = today.getFullYear();
          const month = today.getMonth() + 1;
          
          // To account for local timezone when getting YYYY-MM-DD
          const offset = today.getTimezoneOffset()
          const localDate = new Date(today.getTime() - (offset*60*1000))
          const dateStr = localDate.toISOString().split("T")[0];

          const response = await getDashboardDataAPI(dateStr, month, year);
          const budgetRes = await getBudgetService(month, year);

          if (isActive) {
            if (response && response.success) {
              setDashboardData(response.data);
            }
            if (budgetRes && budgetRes.data) {
              setBudgetLimit(budgetRes.data.monthlyLimit || 1300);
            }
          }
        } catch (error) {
          console.error("Failed to load dashboard data", error);
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      loadData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const totalTasks = dashboardData?.todoCard?.total || 0;
  const completedTasks = dashboardData?.todoCard?.completed || 0;
  const taskCompletionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const totalSpent = dashboardData?.expenseCard?.totalExpenseMonth || 0;
  const budgetProgress = budgetLimit > 0 ? totalSpent / budgetLimit : 0;
  const cappedBudgetProgress = budgetProgress > 1 ? 1 : budgetProgress; // Don't overflow the progress bar

  const nextTaskObj = dashboardData?.topTodos?.[0];
  const nextTask = nextTaskObj
    ? {
        title: nextTaskObj.title,
        time: nextTaskObj.time,
        duration: "Upcoming",
        color: "#E7F5EC",
        dot: "#39C16C",
      }
    : null;

  return (
    <ScreenWrapper
      scroll
      backgroundColor="#0F172A"
      barStyle="light-content"
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>
              Hello, {dashboardData?.user?.name ? dashboardData.user.name.split(' ')[0] : "User"} 👋
            </Text>
            <Text style={styles.subtitleText}>Ready to tackle today?</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Profile")}
          >
            <LinearGradient
              colors={["#A855F7", "#6366F1"]}
              style={styles.profileGradient}
            >
              <Text style={styles.profileInitial}>
                {dashboardData?.user?.name ? dashboardData.user.name.charAt(0).toUpperCase() : "U"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {loading && !dashboardData ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Unified Double Cards Widget */}
            <View style={styles.statsContainer}>
              {/* Tasks Progress Card */}
              <TouchableOpacity
                style={styles.statsCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate("Todo")}
              >
                <View style={styles.statsHeader}>
                  <Text style={styles.statsLabel}>TASKS TODAY</Text>
                  <View
                    style={[
                      styles.statsIconBg,
                      { backgroundColor: "rgba(99, 102, 241, 0.15)" },
                    ]}
                  >
                    <Ionicons name="checkbox-outline" size={16} color="#818CF8" />
                  </View>
                </View>
                <Text style={styles.statsValue}>
                  {completedTasks}/{totalTasks}
                </Text>
                <Text style={styles.statsSub}>
                  {Math.round(taskCompletionRate)}% Done
                </Text>

                {/* Task Progress Bar */}
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${taskCompletionRate}%`,
                        backgroundColor: "#6366F1",
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>

              {/* Budget Progress Card */}
              <TouchableOpacity
                style={styles.statsCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate("Expenses")}
              >
                <View style={styles.statsHeader}>
                  <Text style={styles.statsLabel}>BUDGET LEFT</Text>
                  <View
                    style={[
                      styles.statsIconBg,
                      { backgroundColor: "rgba(16, 185, 129, 0.15)" },
                    ]}
                  >
                    <Ionicons name="wallet-outline" size={16} color="#34D399" />
                  </View>
                </View>
                <Text style={styles.statsValue}>
                  ${Math.max(0, budgetLimit - totalSpent).toFixed(0)}
                </Text>
                <Text style={styles.statsSub}>Limit: ${budgetLimit}</Text>

                {/* Budget Progress Bar */}
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${cappedBudgetProgress * 100}%`,
                        backgroundColor:
                          budgetProgress > 0.9 ? "#EF4444" : "#10B981", // Turns red if almost exhausted
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* Quick Actions Hub */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Todo")}
              >
                <LinearGradient
                  colors={["rgba(99, 102, 241, 0.1)", "rgba(168, 85, 247, 0.1)"]}
                  style={styles.actionGradient}
                >
                  <View
                    style={[
                      styles.actionIconWrapper,
                      { backgroundColor: "rgba(99, 102, 241, 0.2)" },
                    ]}
                  >
                    <Ionicons name="add-circle-outline" size={24} color="#818CF8" />
                  </View>
                  <Text style={styles.actionButtonText}>Add New Task</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Expenses")}
              >
                <LinearGradient
                  colors={["rgba(16, 185, 129, 0.1)", "rgba(59, 130, 246, 0.1)"]}
                  style={styles.actionGradient}
                >
                  <View
                    style={[
                      styles.actionIconWrapper,
                      { backgroundColor: "rgba(16, 185, 129, 0.2)" },
                    ]}
                  >
                    <Ionicons name="cash-outline" size={24} color="#34D399" />
                  </View>
                  <Text style={styles.actionButtonText}>Add Expense</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Next Up Spotlight */}
            <Text style={styles.sectionTitle}>Next Up Today</Text>
            {nextTask ? (
              <TouchableOpacity
                style={styles.spotlightCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate("Todo")}
              >
                <View style={styles.spotlightLeftBorder} />
                <View style={styles.spotlightContent}>
                  <View style={styles.spotlightMeta}>
                    <View style={styles.spotlightDot} />
                    <Text style={styles.spotlightTime}>{nextTask.time}</Text>
                    <Text style={styles.spotlightDuration}>
                      ({nextTask.duration})
                    </Text>
                  </View>
                  <Text style={styles.spotlightTitle}>{nextTask.title}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#64748B"
                  style={styles.spotlightArrow}
                />
              </TouchableOpacity>
            ) : (
              <View style={[styles.spotlightCard, { justifyContent: "center", paddingVertical: 30 }]}>
                 <Text style={{ color: "#64748B", fontSize: 14 }}>No upcoming tasks for today.</Text>
              </View>
            )}
          </>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 110,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  subtitleText: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 2,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  profileGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statsLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 1,
  },
  statsIconBg: {
    padding: 4,
    borderRadius: 8,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statsSub: {
    fontSize: 11,
    color: "#94A3B8",
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 14,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  actionGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  actionIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  spotlightCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 24,
    position: "relative",
    overflow: "hidden",
  },
  spotlightLeftBorder: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: "#A855F7",
  },
  spotlightContent: {
    flex: 1,
  },
  spotlightMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  spotlightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#A855F7",
  },
  spotlightTime: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A855F7",
  },
  spotlightDuration: {
    fontSize: 12,
    color: "#64748B",
  },
  spotlightTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  spotlightArrow: {
    marginLeft: 8,
  },

  expenseAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F43F5E",
  },
  todoBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  todoBadgeText: {
    color: "#34D399",
    fontSize: 11,
    fontWeight: "600",
  },
});
