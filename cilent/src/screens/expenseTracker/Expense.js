import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWrapper from "../../components/layout/AppWrapper";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getBudgetService, saveBudgetService } from "../../api/expenseService";
import {
  showSuccessToastMessage,
  showWarningToastMessage,
  showFailureToastMessage,
} from "../../components/toastMessage/ToastMessageProvider";
import CustomToast from "../../components/toastMessage/Toast";

const { height } = Dimensions.get("window");

const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];
const MAX_CHART_VALUE = 130;

// Category configurations
const CATEGORY_CONFIG = {
  "Food & Drinks": { icon: "fast-food-outline", color: "#F59E0B" },
  Shopping: { icon: "basket-outline", color: "#EC4899" },
  Transport: { icon: "car-outline", color: "#3B82F6" },
  Entertainment: { icon: "play-circle-outline", color: "#EF4444" },
  Utilities: { icon: "flash-outline", color: "#A855F7" },
  Health: { icon: "medkit-outline", color: "#10B981" },
  Education: { icon: "school-outline", color: "#6366F1" },
  Other: { icon: "wallet-outline", color: "#6B7280" },
};

const Expense = ({ navigation }) => {
  // State Management
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);

  // Form States
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Drinks");

  // Budget States
  const [budgetLimit, setBudgetLimit] = useState(0);
  const [tempBudgetLimit, setTempBudgetLimit] = useState("");
  const [tempCategories, setTempCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  // Computed Values
  const totalSpent = useMemo(
    () => expenses.reduce((sum, item) => sum + item.amount, 0),
    [expenses],
  );

  const budgetProgress = useMemo(
    () => (budgetLimit > 0 ? totalSpent / budgetLimit : 0),
    [budgetLimit, totalSpent],
  );

  // Monthly chart data generator
  const monthlyData = useMemo(() => {
    const currentMonth = new Date().getMonth();
    return MONTHS.map((month, index) => ({
      day: month,
      amount: Math.floor(Math.random() * 120) + 10,
      isToday: index === currentMonth,
    }));
  }, []);

  // Fetch budget data
  const fetchBudget = useCallback(async () => {
    try {
      const today = new Date();
      const response = await getBudgetService(
        today.getMonth() + 1,
        today.getFullYear(),
      );

      if (response?.data) {
        const budgetData = response.data;
        setBudgetLimit(budgetData.monthlyLimit || 0);

        const mappedCategories = (budgetData.categories || []).map((item) => ({
          name: item.category,
          budget: item.limit || 0,
          spent: item.spent || 0,
          icon: CATEGORY_CONFIG[item.category]?.icon || "wallet-outline",
          color: CATEGORY_CONFIG[item.category]?.color || "#6366F1",
        }));

        if (mappedCategories.length === 0) {
          mappedCategories.push(
            ...Object.keys(CATEGORY_CONFIG).map((catName) => ({
              name: catName,
              budget: 0,
              spent: 0,
              icon: CATEGORY_CONFIG[catName].icon,
              color: CATEGORY_CONFIG[catName].color,
            })),
          );
        }

        setCategories(mappedCategories);

        if (budgetData.expenses) {
          setExpenses(budgetData.expenses);
        }

        showSuccessToastMessage("Budget data loaded successfully");
      } else {
        // No budget data returned from API, load default categories
        const defaultCategories = Object.keys(CATEGORY_CONFIG).map((catName) => ({
          name: catName,
          budget: 0,
          spent: 0,
          icon: CATEGORY_CONFIG[catName].icon,
          color: CATEGORY_CONFIG[catName].color,
        }));
        setCategories(defaultCategories);
      }
    } catch (error) {
      console.error("Fetch budget error:", error);

      const defaultCategories = Object.keys(CATEGORY_CONFIG).map((catName) => ({
        name: catName,
        budget: 0,
        spent: 0,
        icon: CATEGORY_CONFIG[catName].icon,
        color: CATEGORY_CONFIG[catName].color,
      }));
      setCategories(defaultCategories);

      showFailureToastMessage(
        error.response?.data?.message || "Failed to load budget data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Save budget
  const handleSaveBudget = useCallback(async () => {
    if (!tempBudgetLimit || parseFloat(tempBudgetLimit) <= 0) {
      showFailureToastMessage("Please enter a valid budget limit");
      return;
    }

    const totalCategoryBudget = tempCategories.reduce((sum, cat) => sum + (parseFloat(cat.budget) || 0), 0);
    if (totalCategoryBudget > parseFloat(tempBudgetLimit)) {
      showFailureToastMessage("Category budgets cannot exceed total monthly budget");
      return;
    }

    setIsSaving(true);

    try {
      const token = await AsyncStorage.getItem("token");
      console.log("SAVE BUDGET - Current Token:", token);

      if (!token || token === "undefined" || token === "null") {
        console.log("SAVE BUDGET - No valid token found, saving locally for Demo mode");
        // Demo mode: simulate save locally
        setBudgetLimit(parseFloat(tempBudgetLimit));
        setCategories(tempCategories);
        setBudgetModalVisible(false);
        showSuccessToastMessage("Demo: Budget saved locally");
        return;
      }

      const today = new Date();
      const budgetData = {
        month: today.getMonth() + 1,
        year: today.getFullYear(),
        monthlyLimit: parseFloat(tempBudgetLimit),
        categories: tempCategories.map((cat) => ({
          category: cat.name,
          limit: cat.budget || 0,
        })),
      };

      const response = await saveBudgetService(budgetData);

      if (response?.data) {
        setBudgetLimit(parseFloat(tempBudgetLimit));
        setCategories(tempCategories);
        setBudgetModalVisible(false);
        showSuccessToastMessage("Budget saved successfully");
      }
    } catch (error) {
      console.error("Save budget error:", error);
      showFailureToastMessage(
        error.response?.data?.message || "Failed to save budget",
      );
    } finally {
      setIsSaving(false);
    }
  }, [tempBudgetLimit, tempCategories]);

  // Add expense
  const handleAddExpense = useCallback(async () => {
    if (!title.trim()) {
      showFailureToastMessage("Please enter expense title");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      showFailureToastMessage("Please enter a valid amount");
      return;
    }

    const selectedCat = categories.find((c) => c.name === category);
    if (!selectedCat) {
      showFailureToastMessage("Please select a category");
      return;
    }

    setIsAddingExpense(true);

    // Simulate small delay for UI feedback
    setTimeout(() => {
      const newExpense = {
        id: Date.now().toString(),
        title: title.trim(),
        category,
        amount: parseFloat(amount),
        date: "Today",
        icon: selectedCat.icon,
        color: selectedCat.color,
      };

      setExpenses((prev) => [newExpense, ...prev]);
      setTitle("");
      setAmount("");
      setModalVisible(false);
      showSuccessToastMessage("Expense added successfully");
      setIsAddingExpense(false);
    }, 400);
  }, [title, amount, category, categories]);

  // Open budget modal
  const openBudgetModal = useCallback(() => {
    setTempBudgetLimit(budgetLimit.toString());
    setTempCategories(JSON.parse(JSON.stringify(categories)));
    setBudgetModalVisible(true);
  }, [budgetLimit, categories]);

  // Refresh data
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBudget();
    setRefreshing(false);
  }, [fetchBudget]);

  // Get category spent amount
  const getCategorySpent = useCallback(
    (categoryName) => {
      return expenses
        .filter((e) => e.category === categoryName)
        .reduce((sum, item) => sum + item.amount, 0);
    },
    [expenses],
  );

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  if (loading) {
    return (
      <ScreenWrapper backgroundColor="#0F172A" barStyle="light-content">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading expenses...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper backgroundColor="#0F172A" barStyle="light-content">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
          <TouchableOpacity activeOpacity={0.7} onPress={openBudgetModal}>
            <View style={styles.budgetCard}>
              <View style={styles.budgetHeader}>
                <View>
                  <Text style={styles.budgetLabel}>MONTHLY BUDGET LIMIT</Text>
                  <Text style={styles.budgetLimitText}>
                    ${budgetLimit.toFixed(2)}
                  </Text>
                </View>
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
                    { width: `${Math.min(budgetProgress * 100, 100)}%` },
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
          </TouchableOpacity>

          {/* CHART */}
          <Text style={styles.sectionTitle}>Monthly Activity</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartContainer}>
              {monthlyData.map((item, index) => {
                const pct = (item.amount / MAX_CHART_VALUE) * 100;
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
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Recent Expenses</Text>
            {expenses.length > 3 && (
              <TouchableOpacity onPress={() => navigation.navigate("ExpenseList", { expenses })}>
                <Ionicons name="chevron-forward" size={24} color="#6366F1" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.expensesList}>
            {expenses.length > 0 ? (
              expenses.slice(0, 3).map((exp) => (
                <View key={exp.id} style={styles.expenseItem}>
                  <View
                    style={[
                      styles.expenseIconWrapper,
                      { backgroundColor: `${exp.color}15` },
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
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={48} color="#334155" />
                <Text style={styles.emptyStateText}>No expenses yet</Text>
              </View>
            )}
          </View>

          {/* CATEGORY BUDGETS */}
          <Text style={styles.sectionTitle}>Budgets by Category</Text>
          <View style={styles.categoriesCard}>
            {categories.map((cat, idx) => {
              const currentSpent = getCategorySpent(cat.name);
              const catProgress =
                cat.budget > 0 ? currentSpent / cat.budget : 0;
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
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContainer}
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
                      maxLength={50}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Amount ($)</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="0.00"
                      placeholderTextColor="#64748B"
                      keyboardType="decimal-pad"
                      value={amount}
                      onChangeText={setAmount}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Category</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
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
                                category === cat.name && { color: "#FFFFFF" },
                              ]}
                            >
                              {cat.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                </ScrollView>

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleAddExpense}
                  disabled={isAddingExpense}
                >
                  <LinearGradient
                    colors={["#6366F1", "#A855F7"]}
                    style={styles.submitBtnGradient}
                  >
                    {isAddingExpense ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.submitBtnText}>Add Expense</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <CustomToast />
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
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContainer}
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
                >
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Overall Budget</Text>
                    <TextInput
                      style={styles.modalInput}
                      placeholder="Enter total budget"
                      placeholderTextColor="#64748B"
                      keyboardType="decimal-pad"
                      value={tempBudgetLimit}
                      onChangeText={setTempBudgetLimit}
                    />
                  </View>

                  <Text style={styles.subSectionTitle}>Category Budgets</Text>
                  {tempCategories.map((cat, idx) => (
                    <View key={idx} style={styles.formGroup}>
                      <Text style={styles.formLabel}>
                        <Ionicons name={cat.icon} size={14} color={cat.color} />{" "}
                        {cat.name}
                      </Text>
                      <TextInput
                        style={styles.modalInput}
                        keyboardType="decimal-pad"
                        placeholder="Enter category budget"
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
                  onPress={handleSaveBudget}
                  disabled={isSaving}
                >
                  <LinearGradient
                    colors={["#6366F1", "#A855F7"]}
                    style={styles.submitBtnGradient}
                  >
                    {isSaving ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.submitBtnText}>Save Budgets</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <CustomToast />
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
  subSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#FFFFFF", fontSize: 16 },
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
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },

  emptyStateText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
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
