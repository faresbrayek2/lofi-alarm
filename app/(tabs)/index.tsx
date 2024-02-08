import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Button,
  FlatList,
  Modal,
  TextInput,
  Switch,
  TouchableOpacity,
  View,
  Text,
  Alert,
  Platform,
  useColorScheme,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { Picker } from "@react-native-picker/picker";
import { Linking } from "react-native";

interface Alarm {
  id: number;
  label: string;
  time: Date;
  enabled: boolean;
  notificationId?: string; // Keep track of the notification ID
}

export default function TabOneScreen() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAlarmLabel, setNewAlarmLabel] = useState("");
  const [newAlarmTime, setNewAlarmTime] = useState(new Date());
  const [mode, setMode] = useState<"date" | "time">("time");
  const [showPicker, setShowPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveAlarm = async () => {
    // Check permissions before scheduling a notification
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) {
      return;
    }

    const newId = new Date().getTime();
    const newAlarm: Alarm = {
      id: newId,
      label: newAlarmLabel || "Alarm",
      time: newAlarmTime,
      enabled: true,
    };

    const notificationId = await scheduleNotification(newAlarm);
    setAlarms([...alarms, { ...newAlarm, notificationId }]);
    setModalVisible(false);
    setNewAlarmLabel("");
    setNewAlarmTime(new Date());
  };

  const scheduleNotification = async (alarm: Alarm) => {
    // Ensure the trigger time is in the future
    let triggerDate = new Date(alarm.time);
    const now = new Date();
    if (triggerDate <= now) {
      // Schedule for the next day if the selected time has already passed
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    // Schedule the notification
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: alarm.label,
        body: "Your alarm is ringing!",
        sound: true,
      },
      trigger: {
        hour: triggerDate.getHours(),
        minute: triggerDate.getMinutes(),
        repeats: true,
      },
    });
  };
  const toggleAlarm = (alarmId: number) => {
    setAlarms(
      alarms.map((alarm: any) => {
        // Add type annotation for 'alarm'
        if (alarm.id === alarmId) {
          return { ...alarm, enabled: !alarm.enabled };
        }
        return alarm;
      })
    );
  };

  // Function to handle the change of the date/time picker
  const onChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || newAlarmTime;
    setShowPicker(Platform.OS === "ios");
    setNewAlarmTime(currentDate);
  };

  // Function to handle the cancel button in the modal
  const handleCancel = () => {
    setModalVisible(false);
  };

  // Function to request notification permissions
  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission not granted",
        "Allow the app to use notifications."
      );
      return false;
    }
    return true;
  };

  // Call requestPermissions when the component is mounted
  useEffect(() => {
    requestPermissions();
  }, []);
  useEffect(() => {
    // This listener is fired whenever a user interacts with a notification (e.g., taps on it)
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = "https://www.youtube.com/watch?v=flBNGlZuZ90"; // The URL you want to open
        Linking.openURL(url).catch((err) =>
          console.error("An error occurred", err)
        );
      }
    );

    return () => subscription.remove();
  }, []);

  const Header = () => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: 20,
      }}
    >
      <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
        <Text style={styles.editButtonText}>{isEditing ? "Done" : "Edit"}</Text>
      </TouchableOpacity>
      <Text
        style={[
          {
            fontSize: 24,
            fontWeight: "bold",
          },
          isDarkTheme ? { color: "white" } : { color: "black" },
        ]}
      >
        Alarm
      </Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.editButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
  const theme = useColorScheme();
  const isDarkTheme = theme === "dark";

  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        isDarkTheme
          ? { backgroundColor: "black" }
          : { backgroundColor: "white" },
      ]}
    >
      <Header />
      <Image
        source={require("../../assets/images/coffe.gif")}
        style={{ width: 200, height: 200 }}
      />
      <FlatList
        data={alarms}
        style={{ width: "100%" }}
        keyExtractor={(item) => item?.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.alarmItem}>
            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <Text style={styles.alarmTime}>
                {item.time.toLocaleTimeString().slice(0, 4)}{" "}
                {item.time.toLocaleTimeString().slice(-2)}
              </Text>
              <Text style={styles.alarmLabel}>{item.label}</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={item.enabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => toggleAlarm(item.id)}
              value={item.enabled}
            />
          </View>
        )}
      />
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add Alarm</Text>
            {/* Date/time picker */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "80%",
              }}
            >
              <TextInput
                style={styles.input}
                onChangeText={setNewAlarmLabel}
                value={newAlarmLabel}
                placeholder="Enter alarm label"
              />
              <DateTimePicker
                value={newAlarmTime}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            </View>
            {/* Save and Cancel buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={handleSaveAlarm} style={styles.button}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={styles.button}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  // Add styles to match the uploaded design
  time: {
    display: "flex",
    justifyContent: "center",
    fontSize: 48, // Large font size for the clock
    color: "#fff", // White text for dark theme
    fontWeight: "bold",
    marginVertical: 30, // Spacing around the clock
  },
  editButtonText: {
    color: "#0f0", // Bright green color
    fontSize: 16,
  },
  headerRightPlaceholder: {
    width: 44, // Placeholder to center the title when not editing
  },
  alarmItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333", // Divider color
  },
  alarmTime: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  alarmLabel: {
    color: "#aaa", // Light gray for secondary text
    fontSize: 14,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTextInput: {
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    width: "80%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#000",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    height: 40,
    width: "80%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  pickerButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});
