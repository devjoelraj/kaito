import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import ScreenWrapper from "../../components/layout/AppWrapper";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const Dashboard = ({ navigation }) => {
  // Mock statistics for the dashboard dashboard
  const totalTasks = 5;
  const completedTasks = 3;
  const taskCompletionRate = (completedTasks / totalTasks) * 100;

  const totalSpent = 341.2;
  const budgetLimit = 1300;
  const budgetProgress = totalSpent / budgetLimit;

  // Mock next task spotlight
  const nextTask = {
    title: "Work on Project Kaito",
    time: "10:00 AM",
    duration: "4h",
    color: "#E7F5EC",
    dot: "#39C16C",
  };

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
            <Text style={styles.welcomeText}>Hello, Joel 👋</Text>
            <Text style={styles.subtitleText}>Ready to tackle today?</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
            <LinearGradient
              colors={["#A855F7", "#6366F1"]}
              style={styles.profileGradient}
            >
              <Text style={styles.profileInitial}>J</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

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
              ${(budgetLimit - totalSpent).toFixed(0)}
            </Text>
            <Text style={styles.statsSub}>Limit: ${budgetLimit}</Text>

            {/* Budget Progress Bar */}
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${budgetProgress * 100}%`,
                    backgroundColor: "#10B981",
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
  // activityFeed: {
  //   gap: 12,
  // },
  // activityItem: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   backgroundColor: "rgba(30, 41, 59, 0.3)",
  //   borderRadius: 16,
  //   padding: 12,
  //   borderWidth: 1,
  //   borderColor: "rgba(255, 255, 255, 0.02)",
  // },
  // activityIconWrapper: {
  //   width: 40,
  //   height: 40,
  //   borderRadius: 12,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // activityDetails: {
  //   flex: 1,
  //   marginLeft: 12,
  // },
  // activityTitle: {
  //   fontSize: 14,
  //   fontWeight: "600",
  //   color: "#FFFFFF",
  // },
  // activityMeta: {
  //   fontSize: 11,
  //   color: "#64748B",
  //   marginTop: 2,
  // },
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
