import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Dummy data matching your mockup design
const MOCK_VIOLATIONS = [
  { id: '1', worker: 'Worker #1', date: 'August 12, 2026', time: '1:32 PM', type: 'Hard Hat', status: 'Acknowledge' },
  { id: '2', worker: 'Worker #2', date: 'August 13, 2026', time: '11:32 AM', type: 'Safety Vest', status: 'Acknowledge' },
];

export default function AcknowledgeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');

  // Filter logic for the custom tabs
  const filteredViolations = MOCK_VIOLATIONS.filter(item => {
    if (activeTab === 'All') return true;
    return item.type === activeTab;
  });

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
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

        <Text style={styles.pageTitle}>Violations</Text>

        {/* Custom Top Tab Bar */}
        <View style={styles.tabBar}>
          {['All', 'Hard Hat', 'Safety Vest'].map((tab) => (
            <TouchableOpacity 
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Filtered List */}
      <ScrollView contentContainerStyle={styles.listPadding} showsVerticalScrollIndicator={false}>
        {filteredViolations.map((item) => (
          <View key={item.id} style={styles.violationCard}>
            
            {/* Icon Context */}
            <View style={styles.iconWrapper}>
               <MaterialCommunityIcons 
                 name={item.type === 'Hard Hat' ? 'hard-hat' : 'vest'} 
                 size={32} 
                 color="#000000" 
               />
            </View>

            {/* Details */}
            <View style={styles.detailsWrapper}>
              <Text style={styles.workerName}>{item.worker}</Text>
              <Text style={styles.dateTimeText}>Date: {item.date}</Text>
              <Text style={styles.dateTimeText}>Time: {item.time}</Text>
            </View>

            {/* Status */}
            <View style={styles.statusWrapper}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>

          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5C4B4B',
  },
  fixedHeader: {
    paddingHorizontal: 24,
    paddingTop: 60,
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
    marginBottom: 20,
  },
  // Sub-navigation Tabs
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#A69691',
    marginBottom: 20,
  },
  tabButton: {
    marginRight: 30,
    paddingBottom: 10,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFFFFF',
  },
  tabText: {
    color: '#A69691',
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  // List Container
  listPadding: {
    paddingHorizontal: 24,
    paddingBottom: 120, // Prevents overlap with bottom navigation
  },
  violationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconWrapper: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsWrapper: {
    flex: 1,
  },
  workerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  dateTimeText: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 2,
  },
  statusWrapper: {
    justifyContent: 'flex-start',
    height: '100%',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
});