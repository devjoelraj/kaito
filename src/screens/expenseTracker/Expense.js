import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import ScreenWrapper from "../../components/layout/AppWrapper";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const CATEGORIES = [
  { name: "Food & Drinks", icon: "fast-food-outline", color: "#F59E0B", budget: 400, spend: 84.50 },
  { name: "Shopping", icon: "basket-outline", color: "#EC4899", budget: 300, spend: 120.00 },
  { name: "Transport", icon: "car-outline", color: "#3B82F6", budget: 200, spend: 24.30 },
  { name: "Entertainment", icon: "play-circle-outline", color: "#EF4444", budget: 150, spend: 15.99 },
  { name: "Utilities", icon: "flash-outline", color: "#A855F7", budget: 250, spend: 112.40 },
];

const WEEKLY_DATA = [
  { day: "M", amount: 45, label: "Mon" },
  { day: "T", amount: 75, label: "Tue" },
  { day: "W", amount: 120, label: "Wed", isToday: true },
  { day: "T", amount: 30, label: "Thu" },
  { day: "F", amount: 60, label: "Fri" },
  { day: "S", amount: 95, label: "Sat" },
  { day: "S", amount: 15, label: "Sun" },
];

const Expense = () => {
  const [expenses, setExpenses] = useState([
    { id: "1", title: "Grocery Shopping", category: "Food & Drinks", amount: 84.50, date: "Today", icon: "fast-food-outline", color: "#F59E0B" },
    { id: "2", title: "New Sneakers", category: "Shopping", amount: 120.00, date: "Yesterday", icon: "basket-outline", color: "#EC4899" },
    { id: "3", title: "Electricity Bill", category: "Utilities", amount: 112.40, date: "May 15", icon: "flash-outline", color: "#A855F7" },
    { id: "4", title: "Uber Ride", category: "Transport", amount: 24.30, date: "May 17", icon: "car-outline", color: "#3B82F6" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Drinks");

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const budgetLimit = 1300;
  const budgetProgress = totalSpent / budgetLimit;

  const handleAddExpense = () => {
    if (!title || !amount) return;

    const selectedCat = CATEGORIES.find(c => c.name === category) || CATEGORIES[0];
    const newExpense = {
      id: Date.now().toString(),
      title,
      category,
      amount: parseFloat(amount),
      date: "Today",
      icon: selectedCat.icon,
      color: selectedCat.color,
    };

    setExpenses([newExpense, ...expenses]);
    setTitle("");
    setAmount("");
    setModalVisible(false);
  };

  return (
    <ScreenWrapper scroll backgroundColor="#0F172A" barStyle="light-content" contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Expense Tracker</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#6366F1", "#A855F7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addButtonGradient}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Budget Progress Card */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <View>
              <Text style={styles.budgetLabel}>MONTHLY BUDGET LIMIT</Text>
              <Text style={styles.budgetLimitText}>${budgetLimit.toFixed(2)}</Text>
            </View>
            <View style={styles.spentBadge}>
              <Text style={styles.spentBadgeText}>
                {Math.round(budgetProgress * 100)}% Spent
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(budgetProgress * 100, 100)}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.budgetFooter}>
            <Text style={styles.spentText}>Spent: ${totalSpent.toFixed(2)}</Text>
            <Text style={styles.remainingText}>
              Remaining: ${(budgetLimit - totalSpent).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Weekly Spending Graph */}
        <Text style={styles.sectionTitle}>Weekly Activity</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartSub}>Average spending this week</Text>
            <Text style={styles.chartAvg}>$62.40 / day</Text>
          </View>

          <View style={styles.chartContainer}>
            {WEEKLY_DATA.map((item, index) => {
              const maxVal = 130;
              const pct = (item.amount / maxVal) * 100;
              return (
                <View key={index} style={styles.chartBarWrapper}>
                  <View style={styles.chartTrack}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: `${pct}%`,
                          backgroundColor: item.isToday ? "#A855F7" : "#6366F1",
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.chartDayLabel,
                      item.isToday && styles.todayDayLabel,
                    ]}
                  >
                    {item.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Category Budget Tracker */}
        <Text style={styles.sectionTitle}>Budgets by Category</Text>
        <View style={styles.categoriesCard}>
          {CATEGORIES.map((cat, idx) => {
            const currentSpent = expenses
              .filter(e => e.category === cat.name)
              .reduce((sum, item) => sum + item.amount, 0);
            
            const catProgress = currentSpent / cat.budget;
            return (
              <View key={idx} style={styles.categoryProgressRow}>
                <View style={styles.catRowHeader}>
                  <View style={styles.catNameContainer}>
                    <Ionicons name={cat.icon} size={18} color={cat.color} />
                    <Text style={styles.catName}>{cat.name}</Text>
                  </View>
                  <Text style={styles.catSpendText}>
                    ${currentSpent.toFixed(0)} / ${cat.budget}
                  </Text>
                </View>
                <View style={styles.catProgressBarBg}>
                  <View
                    style={[
                      styles.catProgressBarFill,
                      {
                        width: `${Math.min(catProgress * 100, 100)}%`,
                        backgroundColor: cat.color,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Expense History List */}
        <Text style={styles.sectionTitle}>Expense Logs</Text>
        <View style={styles.expensesList}>
          {expenses.map((exp) => (
            <View key={exp.id} style={styles.expenseItem}>
              <View style={[styles.expenseIconWrapper, { backgroundColor: `${exp.color}15` }]}>
                <Ionicons name={exp.icon} size={20} color={exp.color} />
              </View>
              <View style={styles.expenseDetails}>
                <Text style={styles.expenseTitle}>{exp.title}</Text>
                <Text style={styles.expenseMeta}>
                  {exp.category} • {exp.date}
                </Text>
              </View>
              <Text style={styles.expenseAmount}>-${exp.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Add Expense Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Expense</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Title / Description</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Starbucks Coffee"
                placeholderTextColor="#64748B"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Amount ($)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 5.50"
                placeholderTextColor="#64748B"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Category</Text>
              <View style={styles.categoryPicker}>
                {CATEGORIES.map((cat, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.categoryOption,
                      category === cat.name && styles.categoryOptionSelected,
                      category === cat.name && { borderColor: cat.color },
                    ]}
                    onPress={() => setCategory(cat.name)}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={18}
                      color={category === cat.name ? cat.color : "#94A3B8"}
                    />
                    <Text
                      style={[
                        styles.categoryOptionText,
                        category === cat.name && { color: "#FFFFFF", fontWeight: "600" },
                      ]}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddExpense} activeOpacity={0.8}>
              <LinearGradient
                colors={["#6366F1", "#A855F7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitBtnGradient}
              >
                <Text style={styles.submitBtnText}>Add Expense</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

export default Expense;

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
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    overflow: "hidden",
  },
  addButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  budgetCard: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 24,
  },
  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  budgetLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
    letterSpacing: 1.5,
  },
  budgetLimitText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 2,
  },
  spentBadge: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  spentBadgeText: {
    color: "#818CF8",
    fontSize: 12,
    fontWeight: "600",
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#6366F1",
    borderRadius: 5,
  },
  budgetFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  spentText: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
  remainingText: {
    fontSize: 13,
    color: "#10B981",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  chartCard: {
    backgroundColor: "rgba(30, 41, 59, 0.3)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  chartSub: {
    color: "#64748B",
    fontSize: 12,
  },
  chartAvg: {
    color: "#A855F7",
    fontSize: 12,
    fontWeight: "600",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    paddingHorizontal: 8,
  },
  chartBarWrapper: {
    alignItems: "center",
    width: 24,
  },
  chartTrack: {
    height: 100,
    width: 8,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  chartBar: {
    width: "100%",
    borderRadius: 4,
  },
  chartDayLabel: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 8,
    fontWeight: "500",
  },
  todayDayLabel: {
    color: "#A855F7",
    fontWeight: "700",
  },
  categoriesCard: {
    backgroundColor: "rgba(30, 41, 59, 0.3)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
    marginBottom: 24,
    gap: 16,
  },
  categoryProgressRow: {
    gap: 8,
  },
  catRowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  catNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  catName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  catSpendText: {
    color: "#94A3B8",
    fontSize: 12,
  },
  catProgressBarBg: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  catProgressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  expensesList: {
    gap: 12,
  },
  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.3)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.02)",
  },
  expenseIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  expenseDetails: {
    flex: 1,
    marginLeft: 12,
  },
  expenseTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  expenseMeta: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F43F5E",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.8)",
  },
  modalContent: {
    backgroundColor: "#1E293B",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 8,
    fontWeight: "500",
  },
  modalInput: {
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontSize: 15,
  },
  categoryPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  categoryOptionSelected: {
    backgroundColor: "rgba(30, 41, 59, 0.8)",
  },
  categoryOptionText: {
    color: "#64748B",
    fontSize: 13,
  },
  submitBtn: {
    height: 52,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  submitBtnGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

