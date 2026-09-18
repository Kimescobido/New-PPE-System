import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../../firebaseConfig'; // Adjust path if needed

export default function ProfileScreen() {
  const router = useRouter();
  
  // UI States
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Data States
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  // Fetch existing user data on load
  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const userDocRef = doc(db, 'users_info', auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setFullName(data.fullName || '');
          setPhoneNumber(data.phoneNumber || '');
          setEmail(data.email || auth.currentUser.email || '');
          setUsername(data.username || '');
          setEmployeeId(data.employeeId || ''); 
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Save updated data to Firebase with debugging catch
  const handleSave = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "No authenticated user found.");
      return;
    }
    
    setSaving(true);
    
    try {
      const userDocRef = doc(db, 'users_info', auth.currentUser.uid);
      
      // setDoc with merge: true will create fields if they don't exist yet
      await setDoc(userDocRef, {
        fullName,
        phoneNumber,
        email,
        username,
        employeeId
      }, { merge: true });
      
      setIsEditing(false);
      Alert.alert("Success", "Profile saved successfully!");
    } catch (error: any) {
      console.error("Save error details:", error);
      Alert.alert("Error saving profile", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/login');
    } catch (error: any) {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' }} 
            style={styles.avatar} 
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
        ) : (
          <>
            {/* Information Card */}
            <View style={styles.infoCard}>
              <InfoRow 
                label="Full Name" 
                value={fullName} 
                onChangeText={setFullName} 
                isEditing={isEditing} 
              />
              <InfoRow 
                label="Phone Number" 
                value={phoneNumber} 
                onChangeText={setPhoneNumber} 
                isEditing={isEditing} 
              />
              <InfoRow 
                label="Email" 
                value={email} 
                onChangeText={setEmail} 
                isEditing={isEditing} 
                editable={false} 
              />
              <InfoRow 
                label="Username" 
                value={username} 
                onChangeText={setUsername} 
                isEditing={isEditing} 
              />
              <InfoRow 
                label="Work ID" 
                value={employeeId} 
                onChangeText={setEmployeeId} 
                isEditing={isEditing} 
                isLast={true} 
              />
            </View>

            {/* Dynamic Edit/Save Button */}
            {isEditing ? (
              <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
                <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Profile'}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>

      {/* Logout Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function InfoRow({ 
  label, 
  value, 
  onChangeText, 
  isEditing = false, 
  isLast = false, 
  editable = true 
}: any) {
  return (
    <View style={[styles.infoRow, isLast && styles.lastRow]}>
      <Text style={styles.infoLabel}>{label}</Text>
      {isEditing && editable ? (
        <TextInput
          style={styles.inputField}
          value={value}
          onChangeText={onChangeText}
          placeholder={`Enter ${label}`}
          placeholderTextColor="#A9A9A9"
        />
      ) : (
        <Text style={[styles.infoValue, !value && { color: '#A9A9A9' }]}>
          {value || 'Not set'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#5C4B4B' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 60, marginBottom: 20 },
  backButton: { backgroundColor: '#4A3B3B', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 4 },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 20 },
  avatarContainer: { alignItems: 'center', marginTop: 10, marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FF69B4' },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  lastRow: { borderBottomWidth: 0 },
  infoLabel: { fontSize: 12, color: '#333333', fontWeight: '500', width: '30%' },
  infoValue: { fontSize: 12, color: '#666666', textAlign: 'right', flex: 1 },
  inputField: { flex: 1, fontSize: 12, color: '#333333', textAlign: 'right', padding: 0, borderBottomWidth: 1, borderBottomColor: '#4E7D34' },
  editButton: { backgroundColor: '#4E7D34', borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 4 },
  editButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  saveButton: { backgroundColor: '#4A90E2', borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 4 },
  saveButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  bottomContainer: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 },
  logoutButton: { backgroundColor: '#4A1515', borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 4 },
  logoutButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});