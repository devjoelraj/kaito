import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../../components/layout/AppWrapper";
import { getExpensesByMonthService } from "../../api/expenseService";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ExpenseList = ({ route, navigation }) => {
  const initialExpenses = route.params?.expenses || [];
  
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  
  const [expenses, setExpenses] = useState(initialExpenses);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = useCallback(async (month, year) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || token === "undefined" || token === "null") {
        // Demo mode: just show initial expenses if month matches current month, else empty
        if (month === today.getMonth() + 1 && year === today.getFullYear()) {
          setExpenses(initialExpenses);
        } else {
          setExpenses([]);
        }
        setLoading(false);
        return;
      }

      const response = await getExpensesByMonthService(month, year);
      if (response?.data) {
        setExpenses(response.data);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, [initialExpenses]);

  // Refetch when month/year changes
  useEffect(() => {
    fetchExpenses(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, fetchExpenses]);

  return (
    <ScreenWrapper backgroundColor="#0F172A" barStyle="light-content">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Expenses</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Month Selector Dropdown / Scroller */}
      <View style={styles.monthSelectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.monthScroll}>
          {MONTHS.map((monthStr, index) => {
            const monthNum = index + 1;
            const isSelected = monthNum === selectedMonth;
            return (
              <TouchableOpacity
                key={monthStr}
                style={[styles.monthPill, isSelected && styles.monthPillActive]}
                onPress={() => setSelectedMonth(monthNum)}
              >
                <Text style={[styles.monthPillText, isSelected && styles.monthPillTextActive]}>
                  {monthStr}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id || item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: exp }) => (
            <View style={styles.expenseItem}>
              <View style={[styles.expenseIconWrapper, { backgroundColor: `${exp.color || '#6366F1'}15` }]}>
                <Ionicons name={exp.icon || 'wallet-outline'} size={20} color={exp.color || '#6366F1'} />
              </View>
              <View style={styles.expenseDetails}>
                <Text style={styles.expenseTitle}>{exp.title}</Text>
                <Text style={styles.expenseMeta}>
                  {exp.category} • {exp.date}
                </Text>
              </View>
              <Text style={styles.expenseAmount}>
                -${exp.amount?.toFixed(2) || '0.00'}
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
      )}
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
  monthSelectorContainer: {
    marginBottom: 20,
  },
  monthScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  monthPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(30,41,59,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  monthPillActive: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  monthPillText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
  },
  monthPillTextActive: {
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
