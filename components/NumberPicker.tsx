import React, { useState } from "react";
import {
  Button,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const NumberPicker = ({
  items,
  onValueChange,
  selectedItem,
}: {
  items: string[];
  onValueChange: (value: string) => void;
  selectedItem: string;
}) => {
  return (
    <ScrollView style={styles.picker}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onValueChange(item)}
          style={styles.pickerItem}
        >
          <Text
            style={
              selectedItem === item
                ? styles.pickerItemSelected
                : styles.pickerItemText
            }
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default function App() {
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");

  const hoursArray = [...Array(24).keys()].map(String); // ['0', '1', ..., '23']
  const minutesArray = [...Array(60).keys()].map(String); // ['0', '1', ..., '59']

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Duration</Text>
      <View style={styles.pickersContainer}>
        <View style={styles.pickerContainer}>
          <Text>Hours</Text>
          <NumberPicker
            items={hoursArray}
            onValueChange={setHours}
            selectedItem={hours}
          />
        </View>
        <View style={styles.pickerContainer}>
          <Text>Minutes</Text>
          <NumberPicker
            items={minutesArray}
            onValueChange={setMinutes}
            selectedItem={minutes}
          />
        </View>
      </View>
      <Text>
        Selected Duration: {hours} hours and {minutes} minutes
      </Text>
      {/* Add any additional buttons or logic to use the selected duration */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  pickersContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  pickerContainer: {
    marginHorizontal: 10,
  },
  picker: {
    height: 150,
    width: 100,
  },
  pickerItem: {
    padding: 10,
    alignItems: "center",
  },
  pickerItemText: {
    fontSize: 18,
  },
  pickerItemSelected: {
    fontSize: 18,
    fontWeight: "bold",
    color: "blue",
  },
});
