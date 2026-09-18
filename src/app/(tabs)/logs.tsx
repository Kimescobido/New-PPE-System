import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LogsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backWrapper}>
               <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' }} 
                style={styles.avatar} 
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Safety Officer</Text>
          </View>
          <TouchableOpacity style={styles.bellButton}>
            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Page Titles */}
        <Text style={styles.pageTitle}>Logs</Text>
        <Text style={styles.pageSubtitle}>All Total Missing PPE Detected Violations</Text>

        {/* Hard Hat Summary Card */}
        <TouchableOpacity style={styles.summaryCard} activeOpacity={0.9}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="hard-hat" size={32} color="#FFFFFF" />
            <Text style={styles.cardTitle}>Hard Hat Violations</Text>
          </View>
          <Text style={styles.largeNumber}>233</Text>
        </TouchableOpacity>

        {/* Safety Vest Summary Card */}
        <TouchableOpacity style={styles.summaryCard} activeOpacity={0.9}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="vest" size={32} color="#FFFFFF" />
            <Text style={styles.cardTitle}>Safety Vest Violations</Text>
          </View>
          <Text style={styles.largeNumber}>343</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5C4B4B',
  },
  contentPadding: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 120, // Avoids bottom navigation overlap
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backWrapper: {
    marginRight: 12,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bellButton: {
    backgroundColor: '#4A3B3B',
    padding: 10,
    borderRadius: 20,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pageSubtitle: {
    color: '#D3D3D3',
    fontSize: 10,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: '#A69691', // Muted rosy brown from the design
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  largeNumber: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold',
  },
});