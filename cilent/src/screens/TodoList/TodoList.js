import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Swipeable } from "react-native-gesture-handler";

import ScreenWrapper from "../../components/layout/AppWrapper";

import FloatingBar from "../../components/FloatingBar";

const dates = [
  { day: "All", date: "All" },
  { day: "Thu", date: 26, active: true },
  { day: "Fri", date: 27 },
  { day: "Sat", date: 28 },
  { day: "Sun", date: 29 },
  { day: "Mon", date: 30 },
];

const initialTasks = [
  {
    id: "1",
    time: "06:00",
    title: "Drink 8 glasses of water",
    duration: "1h",
    color: "rgba(108, 124, 255, 0.12)",
    dot: "#6C7CFF",
    completed: false,
  },
  {
    id: "2",
    time: "09:00",
    title: "Get a notebook",
    duration: "1h",
    color: "rgba(200, 92, 200, 0.12)",
    dot: "#C85CC8",
    completed: false,
  },
  {
    id: "3",
    time: "10:00",
    title: "Work",
    duration: "4h",
    color: "rgba(57, 193, 108, 0.15)",
    dot: "#39C16C",
    completed: false,
  },
];

const TodoList = () => {
  const [taskList, setTaskList] = useState(initialTasks);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");

  const [taskTitleError, setTaskTitleError] = useState("");

  const [taskTime, setTaskTime] = useState(new Date());

  const [showTimePicker, setShowTimePicker] = useState(false);

  const [taskPriority, setTaskPriority] = useState("second");

  const formatTime = (date) => {
    const hours = date.getHours();

    const minutes = date.getMinutes();

    const formattedHours = hours < 10 ? `0${hours}` : hours;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes}`;
  };

  const handleOpenModal = () => {
    setTaskTitle("");

    setTaskTitleError("");

    const defaultTime = new Date();

    defaultTime.setHours(0);

    defaultTime.setMinutes(0);

    defaultTime.setSeconds(0);

    setTaskTime(defaultTime);

    setTaskPriority("second");

    setShowTimePicker(false);

    setIsModalVisible(true);
  };

  const handleTitleChange = (text) => {
    setTaskTitle(text);

    if (text.trim()) {
      setTaskTitleError("");
    }
  };

  const handleAddTask = () => {
    if (!taskTitle.trim()) {
      setTaskTitleError("Task name is required.");

      return;
    }

    const priorityStyles = {
      first: {
        dot: "#EF4444",
        color: "rgba(239, 68, 68, 0.12)",
      },

      second: {
        dot: "#6C7CFF",
        color: "rgba(108, 124, 255, 0.12)",
      },

      least: {
        dot: "#39C16C",
        color: "rgba(57, 193, 108, 0.15)",
      },
    };

    const priorityData = priorityStyles[taskPriority];

    const newTodo = {
      id: Date.now().toString(),
      time: formatTime(taskTime),
      title: taskTitle.trim(),
      duration: "1h",
      color: priorityData.color,
      dot: priorityData.dot,
      completed: false,
    };

    setTaskList((prev) => [...prev, newTodo]);

    setIsModalVisible(false);
  };

  const handleDeleteTask = (id) => {
    setTaskList((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleTaskComplete = (id) => {
    setTaskList((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task,
      ),
    );
  };

  const pendingTasks = taskList.filter((task) => !task.completed);

  const completedTasks = taskList.filter((task) => task.completed);

  const renderRightActions = (id) => {
    return (
      <TouchableOpacity
        style={styles.deleteContainer}
        activeOpacity={0.8}
        onPress={() => handleDeleteTask(id)}
      >
        <MaterialIcons name="delete" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    );
  };

  const renderTask = ({ item }) => {
    return (
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
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: item.dot,
                      },
                    ]}
                  />

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
  };

  return (
    <ScreenWrapper backgroundColor="#0F172A" barStyle="light-content">
      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Calendar <Text style={styles.grayText}>26 Dec</Text>
          </Text>
        </View>

        {/* DATE LIST */}

        <FlatList
          horizontal
          data={dates}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          style={styles.dateList}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.dateBox, item.active && styles.activeDateBox]}
            >
              <Text
                style={[styles.dayText, item.active && styles.activeDayText]}
              >
                {item.day}
              </Text>

              <Text
                style={[styles.dateText, item.active && styles.activeDateText]}
              >
                {item.date}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* TASK LIST */}

        <FlatList
          data={[
            { type: "header", title: "Pending Tasks" },
            ...pendingTasks,
            { type: "completedHeader", title: "Completed Tasks" },
            ...completedTasks,
          ]}
          keyExtractor={(item, index) => item.id || index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.taskList}
          renderItem={({ item }) => {
            if (item.type === "header") {
              return <Text style={styles.sectionHeader}>Pending Tasks</Text>;
            }

            if (item.type === "completedHeader") {
              return <Text style={styles.sectionHeader}>Completed Tasks</Text>;
            }

            return renderTask({ item });
          }}
        />
      </View>

      <FloatingBar onPress={handleOpenModal} />

      {/* MODAL */}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.keyboardAvoidingView}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />

                <Text style={styles.modalTitle}>Add New Task</Text>

                {/* TASK NAME */}

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

                {/* TIME */}

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
                          if (selectedDate) {
                            setTaskTime(selectedDate);
                          }
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

                            if (selectedDate) {
                              setTaskTime(selectedDate);
                            }
                          }}
                        />
                      )}
                    </>
                  )}
                </View>

                {/* PRIORITY */}

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
                          {
                            backgroundColor: "#EF4444",
                          },
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
                          {
                            backgroundColor: "#6C7CFF",
                          },
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
                          {
                            backgroundColor: "#39C16C",
                          },
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

                {/* BUTTONS */}

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.cancelButton}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.addButton}
                    onPress={handleAddTask}
                  >
                    <Text style={styles.addButtonText}>Add Task</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScreenWrapper>
  );
};

export default TodoList;

const styles = StyleSheet.create({
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
