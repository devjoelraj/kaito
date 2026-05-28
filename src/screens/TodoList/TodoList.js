import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

import ScreenWrapper from "../../components/layout/AppWrapper";
import FloatingBar from "../../components/FloatingBar";

const dates = [
  { day: "Wed", date: 25 },
  { day: "Thu", date: 26, active: true },
  { day: "Fri", date: 27 },
  { day: "Sat", date: 28 },
  { day: "Sun", date: 29 },
  { day: "Mon", date: 30 },
];

const tasks = [
  {
    id: "1",
    time: "6:00",
    title: "Drink 8 glasses of water",
    duration: "1h",
    color: "rgba(108, 124, 255, 0.1)",
    dot: "#6C7CFF",
  },
  {
    id: "2",
    time: "9:00",
    title: "Get a notebook",
    duration: "1h",
    color: "rgba(200, 92, 200, 0.1)",
    dot: "#C85CC8",
  },
  {
    id: "3",
    time: "10:00",
    title: "Work",
    duration: "4h",
    color: "rgba(57, 193, 108, 0.15)",
    dot: "#39C16C",
    big: true,
  },
];

const TodoList = () => {
  const [selectedDate, setSelectedDate] = useState("2025-05-26");

  const renderTask = ({ item }) => {
    return (
      <View style={styles.taskRow}>
        <Text style={styles.time}>{item.time}</Text>

        <View
          style={[
            styles.taskCard,
            {
              backgroundColor: item.color,
              height: item.big ? 120 : 54,
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

              <Text style={styles.taskTitle}>{item.title}</Text>
            </View>

            <Text style={styles.duration}>{item.duration}</Text>
          </View>
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

        {/* DATES */}

        <FlatList
          horizontal
          data={dates}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          style={styles.dateList}
          renderItem={({ item }) => (
            <TouchableOpacity
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

        {/* TASKS */}

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.taskList}
        />
      </View>
      <FloatingBar />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  /* DATE LIST */

  dateList: {
    marginBottom: 8,
    flexGrow: 0,
  },

  dateBox: {
    width: 70,
    height: 86,

    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 14,

    backgroundColor: "rgba(30, 41, 59, 0.4)",
  },

  activeDateBox: {
    borderColor: "#6366F1",
    backgroundColor: "rgba(99, 102, 241, 0.15)",
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
    fontWeight: "600",
  },

  activeDateText: {
    color: "#FFFFFF",
  },

  /* TASK LIST */

  taskList: {
    paddingBottom: 120,
    paddingTop: 6,
  },

  taskRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  time: {
    width: 60,
    fontSize: 15,
    color: "#64748B",
    marginTop: 12,
  },

  taskCard: {
    flex: 1,
    borderRadius: 22,
    padding: 12,
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.02)",
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

  duration: {
    fontSize: 14,
    color: "#94A3B8",
    marginLeft: 12,
  },
});
