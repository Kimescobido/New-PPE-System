import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../../firebaseConfig';

export default function DashboardScreen() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for the popup modal
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'ppe_alerts'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedAlerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAlerts(fetchedAlerts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return { time: 'N/A', date: 'N/A' };
    const dateObj = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return { time, date };
  };

  const getIconName = (item: string) => {
    const lowerItem = item.toLowerCase();
    if (lowerItem.includes('helmet') || lowerItem.includes('hard hat')) return 'hard-hat';
    if (lowerItem.includes('vest')) return 'vest';
    return 'alert-circle-outline'; 
  };

  const openDetails = (alertData: any, workerName: string, time: string, date: string) => {
    setSelectedAlert({ ...alertData, workerName, time, date });
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentPadding}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' }} 
              style={styles.avatar} 
            />
            <Text style={styles.headerTitle}>Safety Officer</Text>
          </View>
          <TouchableOpacity style={styles.bellButton}>
            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Top Stats Section */}
        <View style={styles.statsContainer}>
          <LinearGradient 
            colors={['#E5D9C5', '#6D5353']} 
            style={styles.mainCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.cardLabel}>Violations</Text>
            <Text style={styles.largeNumber}>{loading ? '...' : alerts.length}</Text>
            <Text style={styles.cardSubLabel}>1 Month Total of Violations</Text>
            <Text style={styles.largeNumber}>240</Text> 
          </LinearGradient>

          <View style={styles.systemStatus}>
            <View style={styles.cctvIconContainer}>
               <MaterialCommunityIcons name="cctv" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.statusTitle}>System Status</Text>
            <Text style={styles.statusOnline}>Online</Text>
          </View>
        </View>

        {/* Non-Compliance List */}
        <Text style={styles.sectionTitle}>Non-Compliance Today</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
        ) : (
          alerts.map((alert, index) => {
            const { time, date } = formatTimestamp(alert.timestamp);
            const missingItem = alert.missing_item || 'Unknown Item';
            const workerName = `Worker #${alerts.length - index}`;
            
            return (
              <TouchableOpacity 
                key={alert.id} 
                style={styles.timelineItem}
                activeOpacity={0.8}
                onPress={() => openDetails(alert, workerName, time, date)}
              >
                <Text style={styles.timeText}>{time}</Text>
                <View style={styles.violationCard}>
                  <View style={styles.violationInfo}>
                    <Text style={styles.workerName}>{workerName}</Text>
                    <Text style={styles.violationDetail}>Violation:{'\n'}Missing {missingItem}</Text>
                    <View style={styles.dateRow}>
                      <Text style={styles.violationDetailSmall}>Time Caught:{'\n'}{time}</Text>
                      <Text style={styles.violationDetailSmall}>Date Caught:{'\n'}{date}</Text>
                    </View>
                  </View>
                  <MaterialCommunityIcons 
                    name={getIconName(missingItem) as any} 
                    size={48} 
                    color="#FFFFFF" 
                  />
                </View>
              </TouchableOpacity>
            );
          })
        )}
        
        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {/* Top Drag Handle */}
            <View style={styles.dragHandle} />
            
            <Text style={styles.modalTitle}>Non-Compliance Details</Text>
            
            {/* Image Placeholder */}
            <View style={styles.imagePlaceholder}>
              {/* If you have image_data in selectedAlert, you would render the Image component here */}
            </View>

            {/* Details Card */}
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Detected:</Text>
                <Text style={styles.detailValue}>{selectedAlert?.workerName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Violation:</Text>
                <Text style={styles.detailValue}>Missing {selectedAlert?.missing_item}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date Caught:</Text>
                <Text style={styles.detailValue}>{selectedAlert?.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time Caught:</Text>
                <Text style={styles.detailValue}>{selectedAlert?.time}</Text>
              </View>
            </View>

            {/* Acknowledge Button */}
            <TouchableOpacity 
              style={styles.acknowledgeButton}
              onPress={() => {
                // Here you would add the logic to update Firebase that the violation is acknowledged
                setModalVisible(false);
              }}
            >
              <Text style={styles.acknowledgeButtonText}>Acknowledge Violation</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... Keep all your existing dashboard styles ...
  container: { flex: 1, backgroundColor: '#5C4B4B' },
  contentPadding: { padding: 24, paddingTop: 50, paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  profileSection: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 12 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  bellButton: { backgroundColor: '#4A3B3B', padding: 10, borderRadius: 20 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 35 },
  mainCard: { width: '60%', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  cardLabel: { color: '#FFFFFF', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  largeNumber: { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold', marginBottom: 16 },
  cardSubLabel: { color: '#FFFFFF', fontSize: 10, marginBottom: 4 },
  systemStatus: { width: '35%', alignItems: 'flex-end', paddingTop: 10 },
  cctvIconContainer: { backgroundColor: '#4A3B3B', padding: 12, borderRadius: 25, marginBottom: 8 },
  statusTitle: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  statusOnline: { color: '#4ADE80', fontSize: 12, fontWeight: 'bold' },
  sectionTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', marginBottom: 20 },
  timelineItem: { marginBottom: 20 },
  timeText: { color: '#FFFFFF', fontSize: 12, marginBottom: 8 },
  violationCard: { backgroundColor: '#A3816A', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  violationInfo: { flex: 1, paddingRight: 10 },
  workerName: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  violationDetail: { color: '#FFFFFF', fontSize: 12, marginBottom: 12, lineHeight: 18 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between' },
  violationDetailSmall: { color: '#E0E0E0', fontSize: 10, lineHeight: 14 },

  // --- NEW MODAL STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  dragHandle: {
    width: 60,
    height: 4,
    backgroundColor: '#D3D3D3',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 20,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    width: 100,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
  },
  detailValue: {
    flex: 1,
    fontSize: 12,
    color: '#555555',
  },
  acknowledgeButton: {
    backgroundColor: '#5C4B4B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  acknowledgeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});