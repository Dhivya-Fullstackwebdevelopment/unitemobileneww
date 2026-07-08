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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Types
interface UserProfile {
  id: string;
  name: string;
  phone: string;
  area: string;
  avatar?: string;
  goldPoints: number;
  bookings: number;
  rating: number;
  totalSpent: number;
  preferences: string;
  membershipTier: 'Gold' | 'Platinum' | 'Silver' | 'Bronze';
}

// Default Profile
const defaultProfile: UserProfile = {
  id: '1',
  name: 'Ahmed Al-Rashdi',
  phone: '+968 9123 4567',
  area: 'Qurum, Muscat',
  goldPoints: 847,
  bookings: 23,
  rating: 4.8,
  totalSpent: 391,
  preferences: 'Prefers morning slots - AC + Cleaning most booked - Qurum villa regular',
  membershipTier: 'Gold',
};

// Storage Keys
const PROFILE_KEY = '@user_profile';

// Helper functions
const loadProfile = async (): Promise<UserProfile> => {
  try {
    const stored = await AsyncStorage.getItem(PROFILE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return defaultProfile;
  } catch {
    return defaultProfile;
  }
};

const saveProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getMembershipColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return '#CD7F32';
      case 'Silver': return '#C0C0C0';
      case 'Gold': return '#FFD700';
      case 'Platinum': return '#E5E4E2';
      default: return '#FFD700';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <LinearGradient
                colors={['#FF6B35', '#FF8A65']}
                style={styles.avatarPlaceholder}
              >
                <Text style={styles.avatarText}>{getInitials(profile.name)}</Text>
              </LinearGradient>
            )}
          </View>

          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profilePhone}>{profile.phone}</Text>
          <Text style={styles.profileArea}>
            <Ionicons name="location-outline" size={14} color="#666" />
            {' '}{profile.area}
          </Text>
        </View>

        {/* Gold Member Card */}
        <View style={styles.memberCard}>
          <View style={styles.memberHeader}>
            <View style={styles.memberTitleRow}>
              <Ionicons name="star" size={18} color="#FFD700" />
              <Text style={styles.memberTitle}>Gold Member</Text>
            </View>
            <Text style={styles.memberPoints}>{profile.goldPoints} pts</Text>
          </View>

          <View style={styles.progressContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${Math.min((profile.goldPoints / 1000) * 100, 100)}%`,
                  backgroundColor: '#FFD700'
                }
              ]} 
            />
          </View>

          <Text style={styles.memberNext}>Next: Platinum at 1,000</Text>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.bookings}</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.rating}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>OMR {profile.totalSpent}</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="location-outline" size={20} color="#FF6B35" />
            <Text style={styles.menuText}>Saved Addresses</Text>
            <View style={styles.menuRight}>
              <Text style={styles.menuMeta}>3 addresses</Text>
              <Ionicons name="chevron-forward" size={18} color="#C0C0C0" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="card-outline" size={20} color="#66BB6A" />
            <Text style={styles.menuText}>Payment Methods</Text>
            <View style={styles.menuRight}>
              <Text style={styles.menuMeta}>Thawani + Visa</Text>
              <Ionicons name="chevron-forward" size={18} color="#C0C0C0" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={20} color="#42A5F5" />
            <Text style={styles.menuText}>Notifications</Text>
            <View style={styles.menuRight}>
              <View style={styles.badgeOn}>
                <Text style={styles.badgeOnText}>On</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#C0C0C0" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="globe-outline" size={20} color="#AB47BC" />
            <Text style={styles.menuText}>Language</Text>
            <View style={styles.menuRight}>
              <Text style={styles.menuMeta}>English</Text>
              <Ionicons name="chevron-forward" size={18} color="#C0C0C0" />
            </View>
          </TouchableOpacity>
        </View>

        {/* AI Preferences */}
        <View style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Ionicons name="sparkles" size={20} color="#8E24AA" />
            <Text style={styles.aiTitle}>AI Preferences Learned</Text>
          </View>
          <Text style={styles.aiText}>{profile.preferences}</Text>
        </View>

        {/* Log Out */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => {
          Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Log Out', style: 'destructive' }
            ]
          );
        }}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FF6B35',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF6B35',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  profileArea: {
    fontSize: 14,
    color: '#666666',
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  memberPoints: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  memberNext: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999999',
    paddingHorizontal: 16,
    paddingVertical: 12,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    gap: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuMeta: {
    fontSize: 13,
    color: '#999999',
  },
  badgeOn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeOnText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  aiCard: {
    backgroundColor: '#F8F0FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0E6F4',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A148C',
  },
  aiText: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF1744',
  },
});