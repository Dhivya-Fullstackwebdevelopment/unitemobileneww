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

// ---------- Types ----------
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

// ---------- Default Profile (matches design spec) ----------
const defaultProfile: UserProfile = {
  id: '1',
  name: 'Ahmed Al-Rashdi',
  phone: '+968 9123 4567',
  area: 'Qurum, Muscat',
  goldPoints: 847,
  bookings: 23,
  rating: 4.8,
  totalSpent: 391,
  preferences: 'Prefers morning slots · AC + Cleaning most booked · Qurum villa regular',
  membershipTier: 'Gold',
};

const PROFILE_KEY = '@user_profile';

const loadProfile = async (): Promise<UserProfile> => {
  try {
    const stored = await AsyncStorage.getItem(PROFILE_KEY);
    if (stored) return JSON.parse(stored);
    return defaultProfile;
  } catch {
    return defaultProfile;
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

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C221BC" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B5CF6" />
        }
      >
        {/* Gradient Header — magenta-purple (top-left) to indigo (bottom-right) */}
        <LinearGradient
          colors={['#C221BC', '#4C63E8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
            <Ionicons name="create-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Fully circular avatar — fixed container size, locked ratio, resizeMode cover */}
          <View style={styles.avatarContainer}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} resizeMode="cover" />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{getInitials(profile.name)}</Text>
              </View>
            )}
          </View>

          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileInfo}>
            {profile.phone} · {profile.area}
          </Text>
        </LinearGradient>

        {/* Body content, pulled up over the header curve */}
        <View style={styles.body}>
          {/* Gold Member Card */}
          <View style={styles.memberCard}>
            <View style={styles.memberHeader}>
              <View style={styles.memberTitleRow}>
                <View style={styles.memberIconWrap}>
                  <Ionicons name="lock-closed" size={13} color="#FFFFFF" />
                </View>
                <Text style={styles.memberTitle}>Gold Member</Text>
              </View>
            </View>

            <View style={styles.memberPointsRow}>
              <Text style={styles.memberPoints}>{profile.goldPoints} pts</Text>
              <Text style={styles.memberNext}> · Next: Platinum at 1,000</Text>
            </View>

            <View style={styles.progressContainer}>
              <LinearGradient
                colors={['#FF6B35', '#FFB74D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressBar,
                  { width: `${Math.min((profile.goldPoints / 1000) * 100, 100)}%` },
                ]}
              />
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#D6249F' }]}>{profile.bookings}</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statWithIcon}>
                <Text style={[styles.statNumber, { color: '#FF9800' }]}>{profile.rating}</Text>
                <Ionicons name="star" size={14} color="#FF9800" style={styles.statIcon} />
              </View>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#10B981' }]}>OMR</Text>
              <Text style={[styles.statNumber, { color: '#10B981' }]}>{profile.totalSpent}</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
          </View>

          {/* Account Section */}
          <Text style={styles.sectionTitle}>ACCOUNT</Text>

          <View style={styles.menuGroup}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#FDECF3' }]}>
                <Ionicons name="location" size={16} color="#EC4899" />
              </View>
              <Text style={styles.menuText}>Saved Addresses</Text>
              <View style={styles.menuRight}>
                <Text style={styles.menuMeta}>3 addresses</Text>
                <Ionicons name="chevron-forward" size={18} color="#C0C0C0" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#E6F7EE' }]}>
                <Ionicons name="card" size={16} color="#22C55E" />
              </View>
              <Text style={styles.menuText}>Payment Methods</Text>
              <View style={styles.menuRight}>
                <Text style={styles.menuMeta}>Thawani + Visa</Text>
                <Ionicons name="chevron-forward" size={18} color="#C0C0C0" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#FFF6E0' }]}>
                <Ionicons name="notifications" size={16} color="#F5B301" />
              </View>
              <Text style={styles.menuText}>Notifications</Text>
              <View style={styles.menuRight}>
                <View style={styles.badgeOn}>
                  <Text style={styles.badgeOnText}>On</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#C0C0C0" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]} activeOpacity={0.7}>
              <View style={[styles.menuIconWrap, { backgroundColor: '#EAF2FE' }]}>
                <Ionicons name="globe" size={16} color="#3B82F6" />
              </View>
              <Text style={styles.menuText}>Language</Text>
              <View style={styles.menuRight}>
                <Text style={styles.menuMeta}>English</Text>
                <Ionicons name="chevron-forward" size={18} color="#C0C0C0" />
              </View>
            </TouchableOpacity>
          </View>

          {/* AI Preferences Learned */}
          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <Ionicons name="sparkles" size={18} color="#8E24AA" />
              <Text style={styles.aiTitle}>AI Preferences Learned</Text>
            </View>
            <Text style={styles.aiText}>{profile.preferences}</Text>
          </View>

          {/* Log Out */}
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={() => {
              Alert.alert('Log Out', 'Are you sure you want to log out?', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Log Out',
                  style: 'destructive',
                  onPress: () => {
                    router.replace('/');
                  },
                },
              ]);
            }}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
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

  // Gradient header
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Avatar block — locked container size prevents flex from squishing into an oval
  avatarContainer: {
    marginTop: 12,
    marginBottom: 14,
    width: 84,
    height: 84,
    borderRadius: 42,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  avatarPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileInfo: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },

  // Body wrapper — pulls content up to overlap header curve
  body: {
    marginTop: -24,
    paddingHorizontal: 16,
  },

  // Gold Member Card
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  memberPointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  memberPoints: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  memberNext: {
    fontSize: 13,
    color: '#999999',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },

  // Stats row — three separate cards
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    color: '#999999',
    marginTop: 4,
  },
  statWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statIcon: {
    marginLeft: 2,
  },

  // Section title
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999999',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },

  // Menu group
  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
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
    gap: 12,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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

  // AI Preferences
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

  // Log Out
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF1744',
  },
});