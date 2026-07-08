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
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
// Add Image import at top
import { Image } from 'react-native';
// Types
interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  area: string;
  avatar?: string;
  goldPoints: number;
  bookings: number;
  rating: number;
  totalSpent: number;
  preferences: string;
  joinDate: string;
  membershipTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

// Default Profile
const defaultProfile: UserProfile = {
  id: '1',
  name: 'Ahmed Al-Rashdi',
  phone: '+968 9123 4567',
  email: 'ahmed@email.com',
  area: 'Qurum, Muscat',
  goldPoints: 847,
  bookings: 23,
  rating: 4.8,
  totalSpent: 391,
  preferences: 'Prefers morning slots · AC + Cleaning most booked · Qurum villa regular',
  joinDate: 'Joined Jan 2024',
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
  const [modalVisible, setModalVisible] = useState(false);
  const [editField, setEditField] = useState<keyof UserProfile | null>(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleImagePick = async () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickFromGallery },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant gallery permissions.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      updateProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      updateProfileImage(result.assets[0].uri);
    }
  };

  const updateProfileImage = async (imageUri: string) => {
    setLoading(true);
    try {
      const updatedProfile = { ...profile, avatar: imageUri };
      await saveProfile(updatedProfile);
      setProfile(updatedProfile);
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile picture');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (field: keyof UserProfile, currentValue: string) => {
    setEditField(field);
    setEditValue(currentValue);
    setModalVisible(true);
  };

  const saveEdit = async () => {
    if (editField) {
      const updatedProfile = { ...profile, [editField]: editValue };
      await saveProfile(updatedProfile);
      setProfile(updatedProfile);
      setModalVisible(false);
      Alert.alert('Success', 'Profile updated!');
    }
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.headerAction}>
            <Ionicons name="settings-outline" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={handleImagePick} style={styles.avatarWrapper}>
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
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>

          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileArea}>
            <Ionicons name="location-outline" size={14} color="#666" />
            {' '}{profile.area}
          </Text>

          <View style={styles.membershipBadge}>
            <LinearGradient
              colors={[getMembershipColor(profile.membershipTier), getMembershipColor(profile.membershipTier)]}
              style={styles.membershipBadgeInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="star" size={14} color="#FFF" />
              <Text style={styles.membershipBadgeText}>{profile.membershipTier} Member</Text>
            </LinearGradient>
          </View>

          <TouchableOpacity style={styles.editProfileBtn} onPress={() => openEditModal('name', profile.name)}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={16} color="#FF6B35" />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <TouchableOpacity style={styles.statItem} 
          //</View>onPress={() => router.push('/bookings')}
          >
            <Text style={styles.statNumber}>{profile.bookings}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
            <Ionicons name="calendar-outline" size={18} color="#FF6B35" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.statItem} 
          //onPress={() => router.push('/ratings')}
          >
            <Text style={styles.statNumber}>{profile.rating}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
            <Ionicons name="star-outline" size={18} color="#FF6B35" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.statItem} 
          //onPress={() => router.push('/spending')}
          >
            <Text style={styles.statNumber}>OMR {profile.totalSpent}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
            <Ionicons name="wallet-outline" size={18} color="#FF6B35" />
          </TouchableOpacity>
        </View>

        {/* Loyalty Points */}
        <View style={styles.loyaltyCard}>
          <View style={styles.loyaltyHeader}>
            <View style={styles.loyaltyTitleRow}>
              <Ionicons name="ribbon-outline" size={20} color="#FF6B35" />
              <Text style={styles.loyaltyTitle}>Loyalty Points</Text>
            </View>
            <Text style={styles.loyaltyPoints}>{profile.goldPoints} pts</Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${(profile.goldPoints / 1000) * 100}%` }]} />
          </View>

          <View style={styles.loyaltyFooter}>
            <Text style={styles.loyaltyNext}>Next: Platinum at 1,000</Text>
            <Text style={styles.loyaltyProgress}>{Math.round((profile.goldPoints / 1000) * 100)}%</Text>
          </View>
        </View>

        {/* AI Preferences */}
        <TouchableOpacity style={styles.aiCard} activeOpacity={0.8}>
          <LinearGradient
            colors={['#FBEAFB', '#F3E5F5']}
            style={styles.aiCardInner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.aiHeader}>
              <Ionicons name="sparkles" size={20} color="#8E24AA" />
              <Text style={styles.aiTitle}>AI Preferences Learned</Text>
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>Active</Text>
              </View>
            </View>
            <Text style={styles.aiText}>{profile.preferences}</Text>
            <TouchableOpacity style={styles.aiUpdateBtn}>
              <Text style={styles.aiUpdateText}>Update Preferences</Text>
              <Ionicons name="chevron-forward" size={16} color="#8E24AA" />
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity style={styles.menuItem}
          // onPress={() => router.push('/profile/addresses')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#FFF0EB' }]}>
                <Ionicons name="location-outline" size={18} color="#FF6B35" />
              </View>
              <Text style={styles.menuText}>Saved Addresses</Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={styles.menuMeta}>3 addresses</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} 
          // onPress={() => router.push('/profile/payment')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="card-outline" size={18} color="#66BB6A" />
              </View>
              <Text style={styles.menuText}>Payment Methods</Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={styles.menuMeta}>Thawani + Visa</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}
          //onPress={() => router.push('/profile/notifications')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="notifications-outline" size={18} color="#42A5F5" />
              </View>
              <Text style={styles.menuText}>Notifications</Text>
            </View>
            <View style={styles.menuRight}>
              <View style={styles.toggleBadge}>
                <Text style={styles.toggleText}>On</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}
          //</View>onPress={() => router.push('/profile/language')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="globe-outline" size={18} color="#AB47BC" />
              </View>
              <Text style={styles.menuText}>Language</Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={styles.menuMeta}>English</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} 
          //</View>onPress={() => router.push('/profile/security')}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#FBE9E7' }]}>
                <Ionicons name="shield-outline" size={18} color="#FF5722" />
              </View>
              <Text style={styles.menuText}>Security</Text>
            </View>
            <View style={styles.menuRight}>
              <Text style={styles.menuMeta}>Face ID</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionBtn} 
          //</View>onPress={() => router.push('/support')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="help-circle-outline" size={20} color="#42A5F5" />
            </View>
            <Text style={styles.actionText}>Help Center</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} 
          //</View>onPress={() => router.push('/about')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="information-circle-outline" size={20} color="#AB47BC" />
            </View>
            <Text style={styles.actionText}>About App</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} 
          //</View>onPress={() => router.push('/feedback')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FFF8E1' }]}>
              <Ionicons name="chatbubble-outline" size={20} color="#FFB300" />
            </View>
            <Text style={styles.actionText}>Feedback</Text>
          </TouchableOpacity>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => {
          Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Log Out', style: 'destructive',
                // onPress: () => router.replace('/auth/login')
              }
            ]
          );
        }}>
          <Ionicons name="log-out-outline" size={20} color="#FF1744" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 2.0.1</Text>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit {editField}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter new ${editField}`}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSave]}
                onPress={saveEdit}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
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
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#FF6B35',
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FF6B35',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  profileArea: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  membershipBadge: {
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  membershipBadgeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 6,
  },
  membershipBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFF0EB',
  },
  editProfileText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B35',
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  loyaltyCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loyaltyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loyaltyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  loyaltyPoints: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 4,
  },
  loyaltyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loyaltyNext: {
    fontSize: 12,
    color: '#999',
  },
  loyaltyProgress: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B35',
  },
  aiCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  aiCardInner: {
    padding: 20,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A148C',
  },
  aiBadge: {
    backgroundColor: '#8E24AA',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  aiText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  aiUpdateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  aiUpdateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E24AA',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#999',
    paddingHorizontal: 20,
    paddingVertical: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuMeta: {
    fontSize: 13,
    color: '#999',
  },
  toggleBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  toggleText: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF1744',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#CCC',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    width: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancel: {
    backgroundColor: '#F5F5F5',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalSave: {
    backgroundColor: '#FF6B35',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

