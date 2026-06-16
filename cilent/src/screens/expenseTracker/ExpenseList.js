import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScreenWrapper from "../../components/layout/AppWrapper";

const ExpenseList = ({ route, navigation }) => {
  const { expenses = [] } = route.params || {};

  return (
    <ScreenWrapper backgroundColor="#0F172A" barStyle="light-content">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Expenses</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: exp }) => (
          <View style={styles.expenseItem}>
            <View style={[styles.expenseIconWrapper, { backgroundColor: `${exp.color}15` }]}>
              <Ionicons name={exp.icon} size={20} color={exp.color} />
            </View>
            <View style={styles.expenseDetails}>
              <Text style={styles.expenseTitle}>{exp.title}</Text>
              <Text style={styles.expenseMeta}>
                {exp.category} • {exp.date}
              </Text>
            </View>
            <Text style={styles.expenseAmount}>
              -${exp.amount.toFixed(2)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color="#334155" />
            <Text style={styles.emptyStateText}>No expenses to show</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

export default ExpenseList;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30,41,59,0.5)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  expenseIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  expenseMeta: {
    fontSize: 13,
    color: "#94A3B8",
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EF4444",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyStateText: {
    color: "#94A3B8",
    fontSize: 16,
    marginTop: 12,
  },
});
