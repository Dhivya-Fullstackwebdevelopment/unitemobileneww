// app/profile.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  bookings: number;
  rating: number;
  totalSpent: number;
}

const defaultProfile: UserProfile = {
  id: '1',
  name: 'Ahmed Al-Rashdi',
  phone: '+968 9234 5678',
  bookings: 47,
  rating: 4.8,
  totalSpent: 847,
};

const PROFILE_KEY = '@user_profile';

const BRAND_GRADIENT = ['#D61CA8', '#8B2EF5'] as const;

const loadProfile = async (): Promise<UserProfile> => {
  try {
    const stored = await AsyncStorage.getItem(PROFILE_KEY);
    if (stored) return JSON.parse(stored);
    return defaultProfile;
  } catch {
    return defaultProfile;
  }
};

interface MenuRow {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  subtitleColor?: string;
  titleColor?: string;
  route?: string;
}

const MENU_ROWS: MenuRow[] = [
  { id: 'bookings', emoji: '📋', title: 'My Bookings', subtitle: '47 total', route: '/bookings' },
  { id: 'addresses', emoji: '📍', title: 'Saved Addresses', subtitle: '2 addresses', route: '/addresses' },
  { id: 'payment', emoji: '💳', title: 'Payment Methods', subtitle: 'Bank of Muscat + Thawani', route: '/payment' },
  { id: 'notifications', emoji: '🔔', title: 'Notifications', subtitle: 'All on', route: '/notifications' },
  { id: 'language', emoji: '🌐', title: 'Language', subtitle: 'English / عربي', route: '/language' },
  { id: 'refer', emoji: '🎁', title: 'Refer & Earn', subtitle: 'Get OMR 5', route: '/refer' },
  { id: 'help', emoji: '❓', title: 'Help & Support', subtitle: '', route: '/professional/help' },
  { id: 'logout', emoji: '🚪', title: 'Logout', subtitle: '', titleColor: '#3B82F6', route: '/welcome' }, // Changed from '/app/welcome' to '/welcome'
];

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const userProfile = await loadProfile();
    setProfile(userProfile);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserProfile();
    setRefreshing(false);
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleEditProfile = () => {
    router.push({
      pathname: '/professional/editprofile',
      params: {
        name: profile.name,
        phone: profile.phone,
      },
    } as any);
  };

  const handleLogout = async () => {
    try {
      // Clear user session data
      await AsyncStorage.removeItem('@user_token'); // Remove auth token if you have one
      await AsyncStorage.removeItem('@user_profile'); // Optionally clear profile
      
      // Navigate to welcome page and reset navigation stack
      router.replace('/welcome');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleRowPress = (row: MenuRow) => {
    // Handle logout separately with enhanced logic
    if (row.id === 'logout') {
      Alert.alert(
        'Log Out',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Log Out',
            style: 'destructive',
            onPress: handleLogout,
          },
        ]
      );
      return;
    }

    // Navigate to the specified route
    if (row.route) {
      router.push(row.route as any);
    } else {
      Alert.alert('Coming Soon', `${row.title} feature is under development`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D628A8" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B5CF6" />
        }
      >
        {/* Gradient Header with brand colors */}
        <LinearGradient
          colors={BRAND_GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          {/* Edit button, top-right of header */}
          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.8}
            onPress={handleEditProfile}
            hitSlop={10}
          >
            <Ionicons name="pencil" size={14} color="#FFFFFF" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(profile.name).charAt(0)}</Text>
          </View>

          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileInfo}>{profile.phone}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statNumber}>{profile.bookings}</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statNumber}>{profile.rating}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
            <View style={styles.statBlock}>
              <Text style={styles.statNumber}>OMR {profile.totalSpent}</Text>
              <Text style={styles.statLabel}>Spent</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Menu List */}
        <View style={styles.body}>
          <View style={styles.menuGroup}>
            {MENU_ROWS.map((row, i) => (
              <TouchableOpacity
                key={row.id}
                style={[styles.menuItem, i === MENU_ROWS.length - 1 && styles.menuItemLast]}
                activeOpacity={0.7}
                onPress={() => handleRowPress(row)}
              >
                <Text style={styles.menuEmoji}>{row.emoji}</Text>
                <View style={styles.menuTextBlock}>
                  <Text style={[styles.menuText, row.titleColor && { color: row.titleColor }]}>
                    {row.title}
                  </Text>
                  {!!row.subtitle && <Text style={styles.menuSubtitle}>{row.subtitle}</Text>}
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C0C0C0" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scrollContent: {
    paddingBottom: 30,
  },

  headerGradient: {
    paddingTop: 24,
    paddingBottom: 26,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  editButton: {
    position: 'absolute',
    top: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  editButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  avatarContainer: {
    marginTop: 8,
    marginBottom: 14,
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#D628A8',
  },
  profileName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileInfo: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 34,
  },
  statBlock: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },

  body: {
    marginTop: 16,
    paddingHorizontal: 16,
  },

  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    gap: 14,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuEmoji: {
    fontSize: 20,
    width: 24,
    textAlign: 'center',
  },
  menuTextBlock: {
    flex: 1,
  },
  menuText: {
    fontSize: 14.5,
    color: '#1A1A1A',
    fontWeight: '700',
  },
  menuSubtitle: {
    fontSize: 12.5,
    color: '#9E9EA8',
    marginTop: 2,
  },
});