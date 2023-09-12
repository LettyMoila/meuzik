import { Button, View, StyleSheet, Text } from "react-native";
import { Audio } from "expo-av";
import React from "react";

export default function Recording(){
    const [recording, setRec] = React.useState();
    const [recordings, setRecs] = React.useState([]);
    const [message, setMsg] = React.useState("");
    
    async function startRec() {
        try{
            const permission = await Audio.requestPermissionsAsync();

            if(permission.status === 'granted'){
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
                });

                const {recording} = await Audio.Recording.createAsync(
                    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
                );

                setRec(recording);
            }else{
                setMsg('Please permit the app to use your device microphone ')
            } 
        }catch(err){
            console.log('Sorry, failed to start recording', err)
        }
    }
    async function stopRec() {
        setRec(undefined);
        await recording.stopAndUnloadAsync();

        let updatedRecs = [...recordings];
        const {sound, status} = await recording.createNewLoadedSoundAsync();
        updatedRecs.push({
            sound: sound,
            duration: getDuration(status.durationMillis),
            file: recording.getURI()
        });

        setRecs(updatedRecs);
    }

    function getDuration(millis) {
        const minutes = millis / 1000 / 60;
        const minutesDisplay = Math.floor(minutes);
        const seconds = Math.round((minutes - minutesDisplay) * 60);
        const secondsDisplay = seconds < 10 ? `0${seconds}`  : seconds;
        return `${minutesDisplay}:${secondsDisplay}`;
    }
    function recordingLines() {
        return recordings.map((recLine, index)=>{
            return(
                <View key={index} style={styles.row}>
                    <Text style={styles.fill}> Recording {index + 1} - {recLine.duration}</Text>
                    <Button style={styles.button} onPress={()=>recLine.sound.replayAsync()} title="play"></Button>
                    <Button style={styles.button} onPress={()=>recLine.sound.replayAsync()} title="delete"></Button>
                </View>
            )
        })
    }
    return(
        <View style={styles.container}>
            <Text>{message}</Text>
            <Button
                title={recording ? 'Stop recording' : 'start recording'}
                onPress={recording ? stopRec : startRec }
                
            />
            {recordingLines()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    row:{
        flex: 1,
        margin: 16
    },
    button: {
        margin: 16,
        width: 20,
        height: 20,
        backgroundColor: '#000000'
    }
  });