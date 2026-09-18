import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {

    const timer = setTimeout(() => {
      router.replace('/login'); 
    }, 2500);


    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#7B7070', '#614141']} 
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <MaterialCommunityIcons name="cctv" size={100} color="#FFFFFF" />
        <Text style={styles.brandText}>GearCheck</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',

    marginBottom: 40, 
  },
  brandText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
    letterSpacing: 1.5,
  },
});