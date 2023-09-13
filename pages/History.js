import { Image, TouchableOpacity,
  Pressable, StyleSheet,
  Text, View,} from "react-native";
import { Audio } from "expo-av";
import React from "react";

import mic from "../assets/microphone.png";
import play from "../assets/play.png";
import del from "../assets/delete.png";
import stud from "../assets/studio.jpg";

export default function History() {
  const [recording, setRec] = React.useState();
  const [recordings, setRecs] = React.useState([]);
  const [message, setMsg] = React.useState("");

  async function startRec() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRec(recording);
      } else {
        setMsg("Please permit the app to use your device microphone ");
      }
    } catch (err) {
      console.log("Sorry, failed to start recording", err);
    }
  }
  async function stopRec() {
    setRec(undefined);
    await recording.stopAndUnloadAsync();

    let updatedRecs = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecs.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });
    
    setRecs(updatedRecs);
  }
  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10 ? `${Math.floor(minutes)}:0${seconds}` : `${Math.floor(minutes)}:${seconds}`
  }
  const del = (index) => {
    const deleteRec = recordings.filter(recording => recording.index !== index);
    setTasks(deleteRec);
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image style={styles.studio} source={{ uri: stud }} />
      </View>
      <View style={styles.middle}>
        <Text style={styles.playlist}>Playlist</Text>
        {recordings.map((recLine, index) => {
          return (
            <View key={index} style={ styles.row }>
              <Text style={styles.fill}>
                Recording #{index + 1} | {recLine.duration}
              </Text>
              <TouchableOpacity
                style={ styles.butt }
                onPress={() => recLine.sound.replayAsync()}
              > <Image style={styles.icon} source={{uri: play}}/></TouchableOpacity>
              <TouchableOpacity style={ styles.butt } onPress={() => del(recording.index)}>
                <Image style={styles.icon} source={{uri: del}}/>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
      <View style={styles.bottom}>
        <Text style={styles.text}>Record</Text>
        <Pressable
          style={styles.recBox}
          onPress={recording ? stopRec : startRec}
        >
          <Image style={styles.micIcon} source={{ uri: mic }} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  top: {
    height: 200,
    backgroundColor: "#000000",
    width: 270,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  studio: {
    height: 200,
    width: 270,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  middle: {
    height: 300,
    width: 270,
    top: 15,
  },
  icon:{
    height: 20,
    width: 20
  },
  playlist: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 40
  },
  fill: {
    flex: 1,
    margin: 15
  },
  butt: {
    width: 20,
    height: 20,
  },
  bottom: {
    height: 70,
    backgroundColor: "#000000",
    width: 270,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    justifyContent: "center",
    padding: 20,
  },
  text: {
    color: "#fff",
  },
  recBox: {
    backgroundColor: "#ff0000",
    width: 42,
    height: 42,
    position: "absolute",
    left: 200,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  micIcon: {
    height: 30,
    width: 30,
  }
  
});
