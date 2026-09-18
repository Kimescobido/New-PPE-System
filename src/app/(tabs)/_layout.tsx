import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{ headerShown: false }}
        // The custom tab bar that fixed the Android clipping issue
        tabBar={() => (
          <View style={styles.tabBarContainer}>
            
            {/* Left Tab: Home */}
            <TouchableOpacity 
              style={styles.tabItem} 
              onPress={() => router.push('/')}
            >
              <Ionicons 
                name="home-outline" 
                size={28} 
                color={pathname === '/' ? '#000000' : '#888888'} 
              />
              <Text style={[styles.tabLabel, { color: pathname === '/' ? '#000000' : '#888888' }]}>Home</Text>
            </TouchableOpacity>

            {/* Center Floating Button */}
            <View style={styles.fabContainer}>
              <TouchableOpacity 
                style={styles.fabWrapper} 
                activeOpacity={0.9} 
                onPress={() => setMenuVisible(true)} // Opens the modal
              >
                <LinearGradient 
                  colors={['#BCAAA4', '#8D7B75']} 
                  style={styles.fabGradient}
                >
                  <Ionicons name="add" size={32} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Right Tab: Profile */}
            <TouchableOpacity 
              style={styles.tabItem} 
              onPress={() => router.push('/profile')}
            >
              <Ionicons 
                name="person-outline" 
                size={28} 
                color={pathname === '/profile' ? '#000000' : '#888888'} 
              />
              <Text style={[styles.tabLabel, { color: pathname === '/profile' ? '#000000' : '#888888' }]}>Profile</Text>
            </TouchableOpacity>
            
          </View>
        )}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="add" />
        <Tabs.Screen name="profile" />
      </Tabs>

      {/* Popup Overlay Menu */}
      <Modal visible={isMenuVisible} transparent={true} animationType="fade">
        {/* Tapping this dark background closes the menu */}
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          {/* Prevent touches inside the menu from closing the modal */}
          <TouchableOpacity activeOpacity={1} style={styles.menuContainer}>
            
            {/* Acknowledge List Button */}
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                setMenuVisible(false);
                router.push('/acknowledge'); 
              }}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="alert-circle-outline" size={32} color="#000" />
              </View>
              <Text style={styles.menuText}>Acknowledge List</Text>
            </TouchableOpacity>

            {/* Logs Button */}
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                setMenuVisible(false);
                router.push('/logs'); 
              }}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="albums-outline" size={28} color="#000" />
              </View>
              <Text style={styles.menuText}>Logs</Text>
            </TouchableOpacity>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // --- Tab Bar Styles ---
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
  },
  fabContainer: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabWrapper: {
    position: 'absolute',
    bottom: 10, 
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF', // Creates the white ring effect
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- Modal Overlay Styles ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Slightly dims the dashboard
  },
  menuContainer: {
    backgroundColor: '#A69691', // Matches the muted card color
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 100, // Hovers perfectly above the custom tab bar
    paddingVertical: 35,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  menuItem: {
    alignItems: 'center',
    width: 120,
  },
  iconCircle: {
    backgroundColor: '#FFFFFF',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuText: {
    color: '#1A1A1A',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  }
});