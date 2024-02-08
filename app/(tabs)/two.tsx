import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, useColorScheme, Image } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

export default function TabTwoScreen() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      // Update the time every second
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);
  const AnalogClock = () => {
    const [secondsRatio, setSecondsRatio] = useState(
      new Date().getSeconds() / 60
    );
    const [minutesRatio, setMinutesRatio] = useState(
      (new Date().getMinutes() + secondsRatio) / 60
    );
    const [hoursRatio, setHoursRatio] = useState(
      (new Date().getHours() + minutesRatio) / 12
    );

    useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date();
        const secondsRatio = now.getSeconds() / 60;
        const minutesRatio = (now.getMinutes() + secondsRatio) / 60;
        const hoursRatio = (now.getHours() + minutesRatio) / 12;
        setSecondsRatio(secondsRatio);
        setMinutesRatio(minutesRatio);
        setHoursRatio(hoursRatio);
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    // Calculate the rotation for each hand
    const secondsDegrees = secondsRatio * 360;
    const minutesDegrees = minutesRatio * 360;
    const hoursDegrees = hoursRatio * 360;

    return (
      <Svg height="200" width="200" viewBox="0 0 100 100">
        {/* Outer circle with white border */}
        <Circle
          cx="50"
          cy="50"
          r="48"
          fill="white"
          stroke="black"
          strokeWidth="2"
        />
        {/* Inner circle with #4837eb fill */}
        <Circle cx="50" cy="50" r="45" fill="#612e1c" />
        {/* Hour hand */}
        <Line
          x1="50"
          y1="50"
          x2="50"
          y2="30"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${hoursDegrees} 50 50)`}
        />
        {/* Minute hand */}
        <Line
          x1="50"
          y1="50"
          x2="50"
          y2="15"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${minutesDegrees} 50 50)`}
        />
        {/* Second hand */}
        <Line
          x1="50"
          y1="50"
          x2="50"
          y2="10"
          stroke="yellow"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${secondsDegrees} 50 50)`}
        />
        {/* Clock center */}
        <Circle cx="50" cy="50" r="3" fill="white" />
        {/* Small ticks for each hour */}
        {Array.from({ length: 12 }).map((_, index) => (
          <Line
            key={index}
            y1="5"
            y2="10"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${index * 30} 50 50) translate(0 -40)`}
          />
        ))}
      </Svg>
    );
  };
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
      <AnalogClock />

      <Text
        style={[
          {
            fontSize: 48, // Large font size for the clock
            fontWeight: "bold",
            marginVertical: 30, // Spacing around the clock
            color: isDarkTheme ? "white" : "black",
          },
        ]}
      >
        {currentTime}
      </Text>
      <Image
        source={require("../../assets/images/coffe.gif")}
        style={{ width: 80, height: 80, position: "absolute", top: "35%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.1)", // Light separator for dark theme
  },
});
