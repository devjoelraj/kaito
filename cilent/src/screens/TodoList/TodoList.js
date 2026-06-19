import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Swipeable } from "react-native-gesture-handler";
import ScreenWrapper from "../../components/layout/AppWrapper";
import FloatingBar from "../../components/FloatingBar";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import {
  createTodoService,
  updateTodoService,
  deleteTodoService,
  getTodosService,
  getTodosByDateService,
  getOtherTodosAPI,
} from "../../api/TodoServices";

const getWeekDates = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = [
    {
      id: "other",
      day: "Other",
      date: "Dates",
      fullDate: "other",
    },
  ];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);
    dates.push({
      id: currentDate.toISOString(),
      day: weekDays[currentDate.getDay()],
      date: currentDate.getDate(),
      fullDate: currentDate.toISOString().split("T")[0],
    });
  }
  return dates;
};

const TodoList = ({ navigation }) => {
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [weekDates] = useState(getWeekDates());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskTitleError, setTaskTitleError] = useState("");
  const [taskTime, setTaskTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [taskPriority, setTaskPriority] = useState("second");
  const [editingTask, setEditingTask] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [taskDate, setTaskDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "short" });
  const currentDate = today.getDate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        navigation.replace("Auth"); // Switch to Auth stack
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      navigation.replace("Auth");
    }
  };

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const formatTimeFromString = (timeString) => {
    if (!timeString) return new Date();
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);
    return date;
  };

  const getPriorityColor = (priority) => {
    const priorityStyles = {
      first: { dot: "#EF4444", color: "rgba(239,68,68,0.12)" },
      second: { dot: "#6C7CFF", color: "rgba(108,124,255,0.12)" },
      least: { dot: "#39C16C", color: "rgba(57,193,108,0.15)" },
    };
    return priorityStyles[priority] || priorityStyles.second;
  };

  const fetchTodos = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      let response;
      if (selectedDate === "all" || selectedDate === "other") {
        const startDate =
          weekDates.length > 1
            ? weekDates[1].fullDate
            : new Date().toISOString().split("T")[0];
        const endDate =
          weekDates.length > 1
            ? weekDates[weekDates.length - 1].fullDate
            : new Date().toISOString().split("T")[0];
        response = await getOtherTodosAPI(startDate, endDate);
      } else {
        response = await getTodosByDateService(selectedDate);
      }

      let todosArray = [];
      if (response && response.todos) {
        todosArray = response.todos;
      } else if (response && Array.isArray(response)) {
        todosArray = response;
      } else if (response && response.data) {
        todosArray = response.data;
      }

      const transformedTasks = todosArray.map((todo) => ({
        id: (todo._id || todo.id).toString(),
        title: todo.title,
        time: todo.time,
        date:
          typeof todo.date === "string"
            ? todo.date.split("T")[0]
            : new Date(todo.date).toISOString().split("T")[0],
        duration: todo.duration || "1h",
        completed: todo.completed || false,
        priority: todo.priority || "second",
        color: getPriorityColor(todo.priority || "second").color,
        dot: getPriorityColor(todo.priority || "second").dot,
      }));
      setTaskList(transformedTasks);
    } catch (error) {
      console.error("Fetch todos error:", error);
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem("token");
        Alert.alert("Session Expired", "Please login again.", [
          { text: "OK", onPress: () => navigation.replace("Auth") },
        ]);
      } else {
        Alert.alert("Error", "Failed to load todos. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [selectedDate, isAuthenticated, navigation]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    }
  }, [fetchTodos, isAuthenticated]);

  const handleOpenModal = () => {
    setEditingTask(null);
    setTaskTitle("");
    setTaskTitleError("");
    const defaultTime = new Date();
    defaultTime.setHours(0);
    defaultTime.setMinutes(0);
    defaultTime.setSeconds(0);
    setTaskTime(defaultTime);
    setTaskPriority("second");
    setTaskDate(new Date());
    setShowTimePicker(false);
    setShowDatePicker(false);
    setIsModalVisible(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskTime(formatTimeFromString(task.time));
    setTaskPriority(task.priority || "second");
    setTaskTitleError("");
    setTaskDate(task.date ? new Date(task.date) : new Date());
    setShowTimePicker(false);
    setShowDatePicker(false);
    setIsModalVisible(true);
  };

  const handleTitleChange = (text) => {
    setTaskTitle(text);
    if (text.trim()) {
      setTaskTitleError("");
    }
  };

  const handleAddTask = async () => {
    if (!taskTitle.trim()) {
      setTaskTitleError("Task name is required.");
      return;
    }

    try {
      setLoading(true);
      const todoData = {
        title: taskTitle.trim(),
        time: formatTime(taskTime),
        date:
          selectedDate === "all" || selectedDate === "other"
            ? taskDate.toISOString().split("T")[0]
            : selectedDate,
        duration: "1h",
        completed: false,
        priority: taskPriority,
      };

      if (editingTask) {
        const response = await updateTodoService(editingTask.id, todoData);
        const { todo } = response;

        if (todo && todo._id) {
          const updatedTask = {
            id: todo._id.toString(),
            title: todo.title,
            time: todo.time,
            date:
              typeof todo.date === "string"
                ? todo.date.split("T")[0]
                : new Date(todo.date).toISOString().split("T")[0],
            duration: todo.duration || "1h",
            completed: todo.completed || false,
            priority: todo.priority,
            color: getPriorityColor(todo.priority).color,
            dot: getPriorityColor(todo.priority).dot,
          };
          setTaskList((prev) =>
            prev.map((task) =>
              task.id === editingTask.id ? updatedTask : task,
            ),
          );
        }
      } else {
        const response = await createTodoService(todoData);
        const { todo } = response;

        if (todo && todo._id) {
          const newTask = {
            id: todo._id.toString(),
            title: todo.title,
            time: todo.time,
            date:
              typeof todo.date === "string"
                ? todo.date.split("T")[0]
                : new Date(todo.date).toISOString().split("T")[0],
            duration: todo.duration || "1h",
            completed: todo.completed || false,
            priority: todo.priority,
            color: getPriorityColor(todo.priority).color,
            dot: getPriorityColor(todo.priority).dot,
          };
          setTaskList((prev) => [...prev, newTask]);
        }
      }
      setIsModalVisible(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Save task error:", error);
      if (error.response?.status === 401) {
        Alert.alert("Session Expired", "Please login again.", [
          { text: "OK", onPress: () => navigation.replace("Auth") },
        ]);
      } else {
        Alert.alert("Error", "Failed to save task. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await deleteTodoService(id);
            setTaskList((prev) => prev.filter((task) => task.id !== id));
          } catch (error) {
            console.error("Delete task error:", error);
            if (error.response?.status === 401) {
              Alert.alert("Session Expired", "Please login again.", [
                { text: "OK", onPress: () => navigation.replace("Auth") },
              ]);
            } else {
              Alert.alert("Error", "Failed to delete task. Please try again.");
            }
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const toggleTaskComplete = async (id) => {
    const task = taskList.find((t) => t.id === id);
    if (!task) return;

    try {
      setLoading(true);
      const updateData = { completed: !task.completed };
      const response = await updateTodoService(id, updateData);
      const success = response.success || response.todo || response;
      if (success) {
        setTaskList((prev) =>
          prev.map((taskItem) =>
            taskItem.id === id
              ? { ...taskItem, completed: !taskItem.completed }
              : taskItem,
          ),
        );
      }
    } catch (error) {
      console.error("Toggle task complete error:", error);
      Alert.alert("Error", "Failed to update task status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTodos();
    setRefreshing(false);
  };

  const filteredTasks =
    selectedDate === "all" || selectedDate === "other"
      ? taskList
      : taskList.filter((task) => task.date === selectedDate);

  const pendingTasks = filteredTasks.filter((task) => !task.completed);
  const completedTasks = filteredTasks.filter((task) => task.completed);

  const renderRightActions = (id) => (
    <TouchableOpacity
      style={styles.deleteContainer}
      activeOpacity={0.8}
      onPress={() => handleDeleteTask(id)}
    >
      <MaterialIcons name="delete" size={26} color="#FFFFFF" />
    </TouchableOpacity>
  );

  const renderTask = ({ item }) => (
    <View style={styles.taskRow}>
      <Text style={styles.time}>{item.time}</Text>
      <View style={{ flex: 1 }}>
        <Swipeable
          overshootRight={false}
          renderRightActions={() => renderRightActions(item.id)}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => toggleTaskComplete(item.id)}
            onLongPress={() => handleEditTask(item)}
            style={[
              styles.taskCard,
              {
                backgroundColor: item.color,
                opacity: item.completed ? 0.55 : 1,
              },
            ]}
          >
            <View style={styles.taskContent}>
              <View style={styles.leftTask}>
                <View style={[styles.dot, { backgroundColor: item.dot }]} />
                <Text
                  style={[
                    styles.taskTitle,
                    item.completed && styles.completedTaskText,
                  ]}
                >
                  {item.title}
                </Text>
              </View>
              <View style={styles.rightSection}>
                {item.completed && (
                  <MaterialIcons
                    name="check-circle"
                    size={22}
                    color="#22C55E"
                  />
                )}
                <Text style={styles.duration}>{item.duration}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeable>
      </View>
    </View>
  );

  return (
    <ScreenWrapper backgroundColor="#0F172A" barStyle="light-content">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Calendar{" "}
            <Text style={styles.grayText}>
              {currentDate} {currentMonth}
            </Text>
          </Text>
        </View>

        <FlatList
          horizontal
          data={weekDates}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          style={styles.dateList}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedDate(item.fullDate)}
              style={[
                styles.dateBox,
                item.fullDate === selectedDate && styles.activeDateBox,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  item.fullDate === selectedDate && styles.activeDayText,
                ]}
              >
                {item.day}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  item.fullDate === selectedDate && styles.activeDateText,
                ]}
              >
                {item.date}
              </Text>
            </TouchableOpacity>
          )}
        />

        <FlatList
          data={
            pendingTasks.length === 0 && completedTasks.length === 0
              ? []
              : [
                  { type: "pendingHeader" },
                  ...pendingTasks,
                  { type: "completedHeader" },
                  ...completedTasks,
                ]
          }
          keyExtractor={(item, index) => item.id || index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.taskList}
          refreshing={refreshing}
          onRefresh={onRefresh}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="assignment" size={64} color="#334155" />
              <Text style={styles.emptyText}>No tasks for this day</Text>
              <Text style={styles.emptySubText}>
                Tap the + button to add a new task
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            if (item.type === "pendingHeader") {
              return pendingTasks.length > 0 ? (
                <Text style={styles.sectionHeader}>Pending Tasks</Text>
              ) : null;
            }
            if (item.type === "completedHeader") {
              return completedTasks.length > 0 ? (
                <Text style={styles.sectionHeader}>Completed Tasks</Text>
              ) : null;
            }
            return renderTask({ item });
          }}
        />
      </View>

      <FloatingBar onPress={handleOpenModal} />

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setIsModalVisible(false);
          setEditingTask(null);
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.keyboardAvoidingView}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>
                  {editingTask ? "Edit Task" : "Add New Task"}
                </Text>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Task Name</Text>
                  <TextInput
                    style={[styles.input, taskTitleError && styles.inputError]}
                    placeholder="What needs to be done?"
                    placeholderTextColor="#64748B"
                    value={taskTitle}
                    onChangeText={handleTitleChange}
                  />
                  {taskTitleError ? (
                    <Text style={styles.errorText}>{taskTitleError}</Text>
                  ) : null}
                </View>

                {(selectedDate === "all" || selectedDate === "other") && (
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Date</Text>
                    {Platform.OS === "ios" ? (
                      <View style={styles.iosPickerWrapper}>
                        <Text style={styles.iosPickerLabel}>Select Date</Text>
                        <DateTimePicker
                          value={taskDate}
                          mode="date"
                          display="default"
                          themeVariant="dark"
                          onChange={(event, selected) => {
                            if (selected) setTaskDate(selected);
                          }}
                        />
                      </View>
                    ) : (
                      <>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={styles.timePickerButton}
                          onPress={() => setShowDatePicker(true)}
                        >
                          <Text style={styles.timePickerButtonText}>
                            {taskDate.toISOString().split("T")[0]}
                          </Text>
                          <MaterialIcons
                            name="calendar-today"
                            size={20}
                            color="#94A3B8"
                          />
                        </TouchableOpacity>
                        {showDatePicker && (
                          <DateTimePicker
                            value={taskDate}
                            mode="date"
                            display="default"
                            onChange={(event, selected) => {
                              setShowDatePicker(false);
                              if (selected) setTaskDate(selected);
                            }}
                          />
                        )}
                      </>
                    )}
                  </View>
                )}

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Time</Text>
                  {Platform.OS === "ios" ? (
                    <View style={styles.iosPickerWrapper}>
                      <Text style={styles.iosPickerLabel}>Select Time</Text>
                      <DateTimePicker
                        value={taskTime}
                        mode="time"
                        is24Hour
                        display="default"
                        themeVariant="dark"
                        onChange={(event, selectedDate) => {
                          if (selectedDate) setTaskTime(selectedDate);
                        }}
                      />
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.timePickerButton}
                        onPress={() => setShowTimePicker(true)}
                      >
                        <Text style={styles.timePickerButtonText}>
                          {formatTime(taskTime)}
                        </Text>
                        <MaterialIcons
                          name="access-time"
                          size={20}
                          color="#94A3B8"
                        />
                      </TouchableOpacity>
                      {showTimePicker && (
                        <DateTimePicker
                          value={taskTime}
                          mode="time"
                          is24Hour
                          display="default"
                          onChange={(event, selectedDate) => {
                            setShowTimePicker(false);
                            if (selectedDate) setTaskTime(selectedDate);
                          }}
                        />
                      )}
                    </>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Priority</Text>
                  <View style={styles.priorityContainer}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[
                        styles.priorityOption,
                        taskPriority === "first" &&
                          styles.prioritySelectedFirst,
                      ]}
                      onPress={() => setTaskPriority("first")}
                    >
                      <View
                        style={[
                          styles.priorityDot,
                          { backgroundColor: "#EF4444" },
                        ]}
                      />
                      <Text
                        style={[
                          styles.priorityText,
                          taskPriority === "first" && styles.priorityTextActive,
                        ]}
                      >
                        First
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[
                        styles.priorityOption,
                        taskPriority === "second" &&
                          styles.prioritySelectedSecond,
                      ]}
                      onPress={() => setTaskPriority("second")}
                    >
                      <View
                        style={[
                          styles.priorityDot,
                          { backgroundColor: "#6C7CFF" },
                        ]}
                      />
                      <Text
                        style={[
                          styles.priorityText,
                          taskPriority === "second" &&
                            styles.priorityTextActive,
                        ]}
                      >
                        Second
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[
                        styles.priorityOption,
                        taskPriority === "least" &&
                          styles.prioritySelectedLeast,
                      ]}
                      onPress={() => setTaskPriority("least")}
                    >
                      <View
                        style={[
                          styles.priorityDot,
                          { backgroundColor: "#39C16C" },
                        ]}
                      />
                      <Text
                        style={[
                          styles.priorityText,
                          taskPriority === "least" && styles.priorityTextActive,
                        ]}
                      >
                        Least
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.cancelButton}
                    onPress={() => {
                      setIsModalVisible(false);
                      setEditingTask(null);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.addButton}
                    onPress={handleAddTask}
                  >
                    <Text style={styles.addButtonText}>
                      {editingTask ? "Update Task" : "Add Task"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Loading Overlay */}
      {loading && !refreshing && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner color="#6C7CFF" size="large" />
        </View>
      )}
    </ScreenWrapper>
  );
};
export default TodoList;

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "#0F172A",
  },

  header: {
    marginBottom: 24,
  },

  headerTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  grayText: {
    color: "#64748B",
    fontWeight: "400",
  },

  dateList: {
    marginBottom: 10,
    flexGrow: 0,
  },

  dateBox: {
    width: 70,
    height: 86,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    backgroundColor: "rgba(30,41,59,0.4)",
  },

  activeDateBox: {
    borderColor: "#6366F1",
    backgroundColor: "rgba(99,102,241,0.15)",
  },

  dayText: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 8,
  },

  dateText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  activeDayText: {
    color: "#818CF8",
  },

  activeDateText: {
    color: "#FFFFFF",
  },

  sectionHeader: {
    color: "#94A3B8",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 14,
    marginTop: 10,
  },

  taskList: {
    paddingTop: 10,
    paddingBottom: 140,
  },

  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  time: {
    width: 65,
    fontSize: 15,
    color: "#64748B",
  },

  taskCard: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },

  taskContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftTask: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 14,
  },

  taskTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
    flexShrink: 1,
  },

  completedTaskText: {
    textDecorationLine: "line-through",
    color: "#94A3B8",
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  duration: {
    fontSize: 14,
    color: "#94A3B8",
    marginLeft: 10,
  },

  deleteContainer: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EF4444",
    borderRadius: 22,
    marginLeft: 12,
    height: "100%",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.75)",
    justifyContent: "flex-end",
  },

  keyboardAvoidingView: {
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F172A",
  },
  logoutButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 18,
    fontWeight: "500",
    marginTop: 16,
  },
  emptySubText: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 8,
  },

  modalContent: {
    backgroundColor: "#1E293B",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 44 : 28,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  modalHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 24,
  },

  formGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "rgba(15,23,42,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: "#FFFFFF",
  },

  inputError: {
    borderColor: "#EF4444",
  },

  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 6,
  },

  iosPickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(15,23,42,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },

  iosPickerLabel: {
    fontSize: 16,
    color: "#FFFFFF",
  },

  timePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(15,23,42,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
  },

  timePickerButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },

  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  priorityOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,23,42,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
  },

  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  priorityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },

  priorityTextActive: {
    color: "#FFFFFF",
  },

  prioritySelectedFirst: {
    borderColor: "#EF4444",
    backgroundColor: "rgba(239,68,68,0.15)",
  },

  prioritySelectedSecond: {
    borderColor: "#6C7CFF",
    backgroundColor: "rgba(108,124,255,0.15)",
  },

  prioritySelectedLeast: {
    borderColor: "#39C16C",
    backgroundColor: "rgba(57,193,108,0.2)",
  },

  buttonContainer: {
    flexDirection: "row",
    marginTop: 12,
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94A3B8",
  },

  addButton: {
    flex: 2,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6366F1",
  },

  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
