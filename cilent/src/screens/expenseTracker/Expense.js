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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import ScreenWrapper from "../../components/layout/AppWrapper";

import { LinearGradient } from "expo-linear-gradient";

import Ionicons from "@expo/vector-icons/Ionicons";

const { height } = Dimensions.get("window");

const Monthly_DATA = [
  { day: "jan", amount: 45 },
  { day: "feb", amount: 75 },
  { day: "mar", amount: 120, isToday: true },
  { day: "apr", amount: 30 },
  { day: "may", amount: 60 },
  { day: "jun", amount: 95 },
  { day: "jul", amount: 15 },
];

const Expense = () => {
  const [categories, setCategories] = useState([
    {
      name: "Food & Drinks",
      icon: "fast-food-outline",
      color: "#F59E0B",
      budget: 400,
    },
    {
      name: "Shopping",
      icon: "basket-outline",
      color: "#EC4899",
      budget: 300,
    },
    {
      name: "Transport",
      icon: "car-outline",
      color: "#3B82F6",
      budget: 200,
    },
    {
      name: "Entertainment",
      icon: "play-circle-outline",
      color: "#EF4444",
      budget: 150,
    },
    {
      name: "Utilities",
      icon: "flash-outline",
      color: "#A855F7",
      budget: 250,
    },
  ]);

  const [expenses, setExpenses] = useState([
    {
      id: "1",
      title: "Grocery Shopping",
      category: "Food & Drinks",
      amount: 84.5,
      date: "Today",
      icon: "fast-food-outline",
      color: "#F59E0B",
    },
    {
      id: "2",
      title: "New Sneakers",
      category: "Shopping",
      amount: 120,
      date: "Yesterday",
      icon: "basket-outline",
      color: "#EC4899",
    },
    {
      id: "3",
      title: "Electricity Bill",
      category: "Utilities",
      amount: 112.4,
      date: "May 15",
      icon: "flash-outline",
      color: "#A855F7",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);

  const [budgetModalVisible, setBudgetModalVisible] = useState(false);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Drinks");

  const [budgetLimit, setBudgetLimit] = useState(1300);

  const [tempBudgetLimit, setTempBudgetLimit] = useState("1300");

  const [tempCategories, setTempCategories] = useState([]);

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  const budgetProgress = budgetLimit > 0 ? totalSpent / budgetLimit : 0;

  const handleAddExpense = () => {
    if (!title || !amount) return;

    const selectedCat =
      categories.find((c) => c.name === category) || categories[0];

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
    <ScreenWrapper backgroundColor="#0F172A" barStyle="light-content">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* HEADER */}

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Expense Tracker</Text>

            <TouchableOpacity
              style={styles.addButton}
              activeOpacity={0.8}
              onPress={() => setModalVisible(true)}
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

          {/* BUDGET CARD */}

          <View style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setTempBudgetLimit(budgetLimit.toString());

                  setTempCategories(JSON.parse(JSON.stringify(categories)));

                  setBudgetModalVisible(true);
                }}
              >
                <Text style={styles.budgetLabel}>MONTHLY BUDGET LIMIT</Text>

                <Text style={styles.budgetLimitText}>
                  ${budgetLimit.toFixed(2)}
                </Text>
              </TouchableOpacity>

              <View style={styles.spentBadge}>
                <Text style={styles.spentBadgeText}>
                  {Math.round(budgetProgress * 100)}% Spent
                </Text>
              </View>
            </View>

            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min(budgetProgress * 100, 100)}%`,
                  },
                ]}
              />
            </View>

            <View style={styles.budgetFooter}>
              <Text style={styles.spentText}>
                Spent: ${totalSpent.toFixed(2)}
              </Text>

              <Text style={styles.remainingText}>
                Remaining: ${(budgetLimit - totalSpent).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* CHART */}

          <Text style={styles.sectionTitle}>Monthly Activity</Text>

          <View style={styles.chartCard}>
            <View style={styles.chartContainer}>
              {Monthly_DATA.map((item, index) => {
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
                            backgroundColor: item.isToday
                              ? "#A855F7"
                              : "#6366F1",
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

          {/* EXPENSES */}

          <Text style={styles.sectionTitle}>Expense Logs</Text>

          <View style={styles.expensesList}>
            {expenses.map((exp) => (
              <View key={exp.id} style={styles.expenseItem}>
                <View
                  style={[
                    styles.expenseIconWrapper,
                    {
                      backgroundColor: `${exp.color}15`,
                    },
                  ]}
                >
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
            ))}
          </View>

          {/* CATEGORY BUDGETS */}

          <Text style={styles.sectionTitle}>Budgets by Category</Text>

          <View style={styles.categoriesCard}>
            {categories.map((cat, idx) => {
              const currentSpent = expenses
                .filter((e) => e.category === cat.name)
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
        </View>
      </ScrollView>

      {/* ADD EXPENSE MODAL */}

      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={{ width: "100%" }}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add New Expense</Text>

                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Title</Text>

                    <TextInput
                      style={styles.modalInput}
                      placeholder="Expense title"
                      placeholderTextColor="#64748B"
                      value={title}
                      onChangeText={setTitle}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Amount</Text>

                    <TextInput
                      style={styles.modalInput}
                      placeholder="0.00"
                      placeholderTextColor="#64748B"
                      keyboardType="numeric"
                      value={amount}
                      onChangeText={setAmount}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Category</Text>

                    <View style={styles.categoryPicker}>
                      {categories.map((cat, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={[
                            styles.categoryOption,
                            category === cat.name &&
                              styles.categoryOptionSelected,
                            category === cat.name && {
                              borderColor: cat.color,
                            },
                          ]}
                          onPress={() => setCategory(cat.name)}
                        >
                          <Ionicons
                            name={cat.icon}
                            size={18}
                            color={
                              category === cat.name ? cat.color : "#94A3B8"
                            }
                          />

                          <Text
                            style={[
                              styles.categoryOptionText,
                              category === cat.name && {
                                color: "#FFFFFF",
                              },
                            ]}
                          >
                            {cat.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleAddExpense}
                >
                  <LinearGradient
                    colors={["#6366F1", "#A855F7"]}
                    style={styles.submitBtnGradient}
                  >
                    <Text style={styles.submitBtnText}>Add Expense</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* BUDGET MODAL */}

      <Modal
        transparent
        animationType="slide"
        visible={budgetModalVisible}
        onRequestClose={() => setBudgetModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={{ width: "100%" }}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Set Monthly Budget</Text>

                  <TouchableOpacity
                    onPress={() => setBudgetModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: 30,
                  }}
                >
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Overall Budget</Text>

                    <TextInput
                      style={styles.modalInput}
                      placeholder="1500"
                      placeholderTextColor="#64748B"
                      keyboardType="numeric"
                      value={tempBudgetLimit}
                      onChangeText={setTempBudgetLimit}
                    />
                  </View>

                  <Text style={styles.sectionTitle}>Category Budgets</Text>

                  {tempCategories.map((cat, idx) => (
                    <View key={idx} style={styles.formGroup}>
                      <Text style={styles.formLabel}>{cat.name}</Text>

                      <TextInput
                        style={styles.modalInput}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#64748B"
                        value={cat.budget ? cat.budget.toString() : ""}
                        onChangeText={(val) => {
                          const newCats = [...tempCategories];

                          newCats[idx].budget =
                            val === "" ? 0 : parseFloat(val);

                          setTempCategories(newCats);
                        }}
                      />
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={() => {
                    setBudgetLimit(parseFloat(tempBudgetLimit) || 0);

                    setCategories(tempCategories);

                    setBudgetModalVisible(false);
                  }}
                >
                  <LinearGradient
                    colors={["#6366F1", "#A855F7"]}
                    style={styles.submitBtnGradient}
                  >
                    <Text style={styles.submitBtnText}>Save Budgets</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScreenWrapper>
  );
};

export default Expense;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
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
    fontSize: 24,
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
    backgroundColor: "rgba(30,41,59,0.5)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },

  budgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  budgetLabel: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "600",
  },

  budgetLimitText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
  },

  spentBadge: {
    backgroundColor: "rgba(99,102,241,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  spentBadgeText: {
    color: "#818CF8",
    fontWeight: "600",
    fontSize: 12,
  },

  progressBarBg: {
    height: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 5,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#6366F1",
  },

  budgetFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  spentText: {
    color: "#94A3B8",
    fontSize: 13,
  },

  remainingText: {
    color: "#10B981",
    fontSize: 13,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },

  chartCard: {
    backgroundColor: "rgba(30,41,59,0.3)",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },

  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
  },

  chartBarWrapper: {
    alignItems: "center",
  },

  chartTrack: {
    height: 100,
    width: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  chartBar: {
    width: "100%",
    borderRadius: 4,
  },

  chartDayLabel: {
    marginTop: 8,
    color: "#64748B",
    fontSize: 11,
  },

  todayDayLabel: {
    color: "#A855F7",
    fontWeight: "700",
  },

  expensesList: {
    gap: 12,
    marginBottom: 24,
  },

  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30,41,59,0.3)",
    padding: 12,
    borderRadius: 16,
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
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },

  expenseMeta: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2,
  },

  expenseAmount: {
    color: "#F43F5E",
    fontWeight: "700",
    fontSize: 15,
  },

  categoriesCard: {
    backgroundColor: "rgba(30,41,59,0.3)",
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },

  categoryProgressRow: {
    gap: 8,
  },

  catRowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  catNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  catName: {
    color: "#FFFFFF",
  },

  catSpendText: {
    color: "#94A3B8",
    fontSize: 12,
  },

  catProgressBarBg: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },

  catProgressBarFill: {
    height: "100%",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15,23,42,0.8)",
  },

  modalContent: {
    backgroundColor: "#1E293B",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: "92%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  modalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  formGroup: {
    marginBottom: 20,
  },

  formLabel: {
    color: "#94A3B8",
    marginBottom: 8,
    fontSize: 14,
  },

  modalInput: {
    backgroundColor: "rgba(15,23,42,0.5)",
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
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
    backgroundColor: "rgba(15,23,42,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },

  categoryOptionSelected: {
    backgroundColor: "rgba(30,41,59,0.8)",
  },

  categoryOptionText: {
    color: "#64748B",
    fontSize: 13,
  },

  submitBtn: {
    height: 52,
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 10,
  },

  submitBtnGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  submitBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
