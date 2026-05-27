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

const TRANSACTIONS = [
  {
    id: "1",
    title: "Grocery Shopping",
    category: "Food & Drinks",
    amount: -84.50,
    time: "Today, 2:30 PM",
    icon: "fast-food-outline",
    iconColor: "#F59E0B",
    iconBg: "rgba(245, 158, 11, 0.1)",
  },
  {
    id: "2",
    title: "Salary Payment",
    category: "Income",
    amount: 4250.00,
    time: "Yesterday, 9:00 AM",
    icon: "cash-outline",
    iconColor: "#10B981",
    iconBg: "rgba(16, 185, 129, 0.1)",
  },
  {
    id: "3",
    title: "Netflix Subscription",
    category: "Entertainment",
    amount: -15.99,
    time: "May 18, 2026",
    icon: "play-circle-outline",
    iconColor: "#EF4444",
    iconBg: "rgba(239, 68, 68, 0.1)",
  },
  {
    id: "4",
    title: "Uber Ride",
    category: "Transport",
    amount: -24.30,
    time: "May 17, 2026",
    icon: "car-outline",
    iconColor: "#3B82F6",
    iconBg: "rgba(59, 130, 246, 0.1)",
  },
  {
    id: "5",
    title: "Electricity Bill",
    category: "Utilities",
    amount: -112.40,
    time: "May 15, 2026",
    icon: "flash-outline",
    iconColor: "#A855F7",
    iconBg: "rgba(168, 85, 247, 0.1)",
  },
];

const Dashboard = () => {
  return (
    <ScreenWrapper scroll backgroundColor="#0F172A" barStyle="light-content" contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>Joel Rogers</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
            <View style={styles.badge} />
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer}>
          <LinearGradient
            colors={["#6366F1", "#A855F7", "#EC4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardLabel}>TOTAL BALANCE</Text>
                <Text style={styles.balanceAmount}>$12,450.80</Text>
              </View>
              <Ionicons name="logo-bitcoin" size={32} color="rgba(255,255,255,0.7)" />
            </View>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardNumber}>**** **** **** 8824</Text>
                <Text style={styles.cardHolder}>JOEL ROGERS</Text>
              </View>
              <View style={styles.cardTypeContainer}>
                <View style={[styles.cardCircle, { backgroundColor: "rgba(255,255,255,0.5)" }]} />
                <View style={[styles.cardCircle, { backgroundColor: "rgba(255,255,255,0.3)", marginLeft: -12 }]} />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
            <View style={styles.actionIconBg}>
              <Ionicons name="arrow-up-outline" size={22} color="#6366F1" />
            </View>
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
            <View style={styles.actionIconBg}>
              <Ionicons name="arrow-down-outline" size={22} color="#10B981" />
            </View>
            <Text style={styles.actionText}>Receive</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
            <View style={styles.actionIconBg}>
              <Ionicons name="pie-chart-outline" size={22} color="#A855F7" />
            </View>
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
            <View style={styles.actionIconBg}>
              <Ionicons name="ellipsis-horizontal-outline" size={22} color="#94A3B8" />
            </View>
            <Text style={styles.actionText}>More</Text>
          </TouchableOpacity>
        </View>

        {/* Financial Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Ionicons name="arrow-down-circle" size={20} color="#10B981" />
              <Text style={styles.summaryLabel}>Income</Text>
            </View>
            <Text style={styles.summaryAmount}>+$4,250.00</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Ionicons name="arrow-up-circle" size={20} color="#EF4444" />
              <Text style={styles.summaryLabel}>Expenses</Text>
            </View>
            <Text style={styles.summaryAmount}>-$237.19</Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsList}>
          {TRANSACTIONS.map((tx) => {
            const isNegative = tx.amount < 0;
            return (
              <View key={tx.id} style={styles.txRow}>
                <View style={[styles.txIconContainer, { backgroundColor: tx.iconBg }]}>
                  <Ionicons name={tx.icon} size={20} color={tx.iconColor} />
                </View>
                
                <View style={styles.txInfo}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txMeta}>{tx.category} • {tx.time}</Text>
                </View>

                <Text style={[styles.txAmount, { color: isNegative ? "#F43F5E" : "#10B981" }]}>
                  {isNegative ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 110, // Extra padding to make sure floating tab bar doesn't overlay bottom content
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: "#64748B",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    zIndex: 2,
  },
  cardContainer: {
    width: "100%",
    marginBottom: 24,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    height: 200,
    justifyContent: "space-between",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1.5,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardNumber: {
    fontSize: 16,
    color: "#FFFFFF",
    letterSpacing: 2,
    fontWeight: "500",
  },
  cardHolder: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
    letterSpacing: 1,
  },
  cardTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  actionItem: {
    alignItems: "center",
    flex: 1,
  },
  actionIconBg: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  summaryContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  viewAllText: {
    fontSize: 13,
    color: "#6366F1",
    fontWeight: "600",
  },
  transactionsList: {
    gap: 12,
  },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.3)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.02)",
  },
  txIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  txInfo: {
    flex: 1,
    marginLeft: 12,
  },
  txTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  txMeta: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: "700",
  },
});

