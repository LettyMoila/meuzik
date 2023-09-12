import { StyleSheet, View } from 'react-native';
import History from './pages/History';
import Recording from './pages/Recording';

export default function App() {
  return (
    <View style={styles.container}>
      <History />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
