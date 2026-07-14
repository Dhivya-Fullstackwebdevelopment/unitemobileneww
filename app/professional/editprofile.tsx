// app/edit-profile.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';

const PROFILE_KEY = '@user_profile';
const BRAND_COLOR = '#B026C0';

interface NotificationRow {
  id: string;
  title: string;
}

const NOTIFICATION_ROWS: NotificationRow[] = [
  { id: 'bookingConfirmations', title: 'Booking confirmations' },
  { id: 'proEnRouteAlerts', title: 'Pro en route alerts' },
  { id: 'serviceCompleted', title: 'Service completed' },
  { id: 'promotionsOffers', title: 'Promotions & offers' },
];

export default function EditProfileScreen() {
  const params = useLocalSearchParams<{ name?: string; phone?: string }>();

  const [fullName, setFullName] = useState(params.name ?? 'Ahmed Al-Rashdi');
  const [phone, setPhone] = useState(params.phone ?? '+968 9234 5678');
  const [email, setEmail] = useState('ahmed@gmail.com');
  const [preferredArea, setPreferredArea] = useState('Qurum');
  const [language, setLanguage] = useState('English');
  const [saving, setSaving] = useState(false);

  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    bookingConfirmations: true,
    proEnRouteAlerts: true,
    serviceCompleted: true,
    promotionsOffers: false,
  });

  const toggleNotification = (id: string) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleChangePhoto = () => {
    // Hook up to expo-image-picker here
    Alert.alert('Change Photo', 'Photo picker not implemented yet.');
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Missing name', 'Please enter your full name.');
      return;
    }

    try {
      setSaving(true);
      const stored = await AsyncStorage.getItem(PROFILE_KEY);
      const existing = stored ? JSON.parse(stored) : {};

      const updated = {
        ...existing,
        name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        preferredArea: preferredArea.trim(),
        language,
        notifications,
      };

      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
      router.back();
    } catch {
      Alert.alert('Something went wrong', 'Could not save your changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          Edit Profile
        </Text>
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(fullName).charAt(0) || 'A'}</Text>
          </View>
          <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.7}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Full Name */}
        <Text style={styles.fieldLabel}>FULL NAME</Text>
        <TextInput
          style={[styles.input, styles.inputFocused]}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          placeholderTextColor="#B0B0B8"
        />

        {/* Phone Number */}
        <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+968 XXXX XXXX"
          placeholderTextColor="#B0B0B8"
          keyboardType="phone-pad"
        />

        {/* Email */}
        <Text style={styles.fieldLabel}>EMAIL</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor="#B0B0B8"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Preferred Area */}
        <Text style={styles.fieldLabel}>PREFERRED AREA</Text>
        <TextInput
          style={styles.input}
          value={preferredArea}
          onChangeText={setPreferredArea}
          placeholder="e.g. Qurum"
          placeholderTextColor="#B0B0B8"
        />

        {/* Language */}
        <Text style={styles.fieldLabel}>LANGUAGE</Text>
        <TouchableOpacity
          style={[styles.input, styles.dropdownInput]}
          activeOpacity={0.7}
          onPress={() =>
            setLanguage((prev) => (prev === 'English' ? 'العربية' : 'English'))
          }
        >
          <Text style={styles.dropdownText}>{language}</Text>
          <Ionicons name="chevron-down" size={16} color="#9E9EA8" />
        </TouchableOpacity>

        {/* Notifications */}
        <Text style={[styles.fieldLabel, { marginTop: 20 }]}>NOTIFICATIONS</Text>
        <View style={styles.card}>
          {NOTIFICATION_ROWS.map((row, i) => (
            <View
              key={row.id}
              style={[styles.notifRow, i === NOTIFICATION_ROWS.length - 1 && styles.notifRowLast]}
            >
              <Text style={styles.notifTitle}>{row.title}</Text>
              <Switch
                value={notifications[row.id]}
                onValueChange={() => toggleNotification(row.id)}
                trackColor={{ false: '#E2E2E8', true: BRAND_COLOR }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
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

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 14,
    marginTop: 12,
  },
  topBarTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'left',
  },
  saveButton: {
    backgroundColor: BRAND_COLOR,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  avatarSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#B026C0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  changePhotoText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: BRAND_COLOR,
  },

  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#9E9EA8',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14.5,
    color: '#1A1A1A',
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
  },
  inputFocused: {
    borderColor: BRAND_COLOR,
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 14.5,
    color: '#1A1A1A',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  notifRowLast: {
    borderBottomWidth: 0,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});