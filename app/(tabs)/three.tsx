import React, { useState, useCallback, useEffect } from "react";
import {
  Button,
  TextInput,
  useColorScheme,
  View,
  Alert,
  StyleSheet,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { Picker } from "@react-native-picker/picker";

export default function App() {
  const [playing, setPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [duration, setDuration] = useState("");
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      Alert.alert("Video has finished playing!");
      setPlaying(false); // Automatically pause the video when it ends
    }
  }, []);

  const togglePlaying = useCallback(() => {
    // if the youtube video is empty or the duration is empty, then return an alert
    if (!videoId) {
      Alert.alert("Please enter a valid YouTube URL");
      return;
    } else if (!duration) {
      Alert.alert("Please enter a valid duration");
      return;
    } else {
      setPlaying((prev) => !prev);
      if (playing && timerId) {
        clearTimeout(timerId);
        setTimerId(null);
      }
    }
  }, [playing, timerId]);

  useEffect(() => {
    if (playing && duration) {
      const id = setTimeout(() => {
        setPlaying(false);
        Alert.alert("Timer finished, stopping the video.");
      }, parseInt(duration) * 1000);
      setTimerId(id);
    }
  }, [playing, duration]);

  const extractVideoID = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      setVideoId(match[2]);
    } else {
      setVideoId(""); // Reset videoId if the URL is invalid
      Alert.alert("Invalid YouTube URL");
    }
  };

  const theme = useColorScheme();
  const isDarkTheme = theme === "dark";

  return (
    <View
      style={[
        {
          flex: 1,
        },
        isDarkTheme
          ? { backgroundColor: "black" }
          : { backgroundColor: "white" },
      ]}
    >
      <TextInput
        placeholder="Enter YouTube link"
        value={videoUrl}
        onChangeText={(text) => {
          const trimmedText = text.trim();
          setVideoUrl(trimmedText);
          extractVideoID(trimmedText);
        }}
        style={[
          {
            height: 40,
            margin: 12,
            borderWidth: 1,
            borderColor: "gray",
            marginBottom: 10,
            color: isDarkTheme ? "white" : "black",
          },
        ]}
      />
      <TextInput
        placeholder="Duration to play in seconds"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        style={[
          {
            height: 40,
            margin: 12,
            borderWidth: 1,
            borderColor: "gray",
            marginBottom: 10,
            color: isDarkTheme ? "white" : "black",
          },
        ]}
      />
      <Button
        title={playing ? "Pause YouTube Video" : "Play YouTube Video"}
        onPress={togglePlaying}
      />
      {videoId && (
        <YoutubePlayer
          height={300}
          play={playing}
          videoId={videoId}
          onChangeState={onStateChange}
        />
      )}
    </View>
  );
}
