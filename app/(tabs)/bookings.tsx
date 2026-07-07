import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

type TabKey = 'upcoming' | 'completed' | 'cancelled';
type StatusKey = 'en_route' | 'scheduled' | 'done' | 'cancelled';

interface Booking {
  id: string;
  emoji: string;
  emojiBg: string;
  title: string;
  dateTime: string;
  location: string;
  providerInitial: string;
  providerColor: string;
  providerName: string;
  price: string;
  status: StatusKey;
  tab: TabKey;
  accentColor: string;
}

const BOOKINGS: Booking[] = [
  {
    id: 'UO-28062025-4521',
    emoji: '❄️',
    emojiBg: '#EDE9FE',
    title: 'AC Deep Cleaning',
    dateTime: 'Sat 28 Jun · 10:00 AM',
    location: 'Qurum',
    providerInitial: 'M',
    providerColor: '#8E24AA',
    providerName: 'Mohammed A.',
    price: 'OMR 17',
    status: 'en_route',
    tab: 'upcoming',
    accentColor: '#E91E8C',
  },
  {
    id: 'UO-29062025-7788',
    emoji: '🖌️',
    emojiBg: '#E0F2E9',
    title: 'Home Deep Cleaning',
    dateTime: 'Sun 29 Jun · 2:00 PM',
    location: 'Al Khuwair',
    providerInitial: 'S',
    providerColor: '#3949AB',
    providerName: 'Salim Al-Habsi',
    price: 'OMR 37',
    status: 'scheduled',
    tab: 'upcoming',
    accentColor: '#3949AB',
  },
  {
    id: 'UO-25062025-1102',
    emoji: '💅',
    emojiBg: '#FCE4EC',
    title: 'Beauty at Home',
    dateTime: '25 Jun · Muscat Hills · Done',
    location: '',
    providerInitial: 'F',
    providerColor: '#8E24AA',
    providerName: 'Fatima Al-Z.',
    price: 'OMR 45',
    status: 'done',
    tab: 'completed',
    accentColor: '#22B573',
  },
];

const TABS: { key: TabKey; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

function StatusBadge({ status }: { status: StatusKey }) {
  const map: Record<StatusKey, { label: string; bg: string; fg: string }> = {
    en_route: { label: 'En Route', bg: '#E3F2FD', fg: '#1976D2' },
    scheduled: { label: 'Scheduled', bg: '#FFF3D6', fg: '#B8860B' },
    done: { label: '✓ Done', bg: '#E3F9EC', fg: '#22B573' },
    cancelled: { label: 'Cancelled', bg: '#FDE7E7', fg: '#D32F2F' },
  };
  const s = map[status];
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.fg }]}>{s.label}</Text>
    </View>
  );
}

export default function MyBookingsScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('upcoming');
  const filtered = BOOKINGS.filter((b) => b.tab === activeTab);

  const handleCardPress = (booking: Booking) => {
    if (booking.status === 'en_route') {
      router.push({
        pathname: '/bookings/track',
        params: {
          professionalName: booking.providerName,
          service: booking.title,
          address: booking.location,
        },
      });
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>My Bookings</Text>
        <TouchableOpacity>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* AI reminder banner */}
        <View style={styles.reminderBanner}>
          <Text style={styles.reminderEmoji}>✨</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.reminderTitle}>AI Reminder</Text>
            <Text style={styles.reminderDesc}>
              Your AC contract expires in 18 days. Book renewal for 15% off. →
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {TABS.map((tab) => {
            const active = tab.key === activeTab;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabBtn, active && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.85}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Booking cards */}
        <View style={styles.list}>
          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No bookings here yet.</Text>
            </View>
          )}

          {filtered.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              activeOpacity={booking.status === 'en_route' ? 0.8 : 1}
              onPress={() => handleCardPress(booking)}
              style={[styles.card, { borderLeftColor: booking.accentColor }]}
            >
              <View style={styles.cardTopRow}>
                <View style={[styles.emojiWrap, { backgroundColor: booking.emojiBg }]}>
                  <Text style={styles.emojiText}>{booking.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{booking.title}</Text>
                  <Text style={styles.cardSubtitle}>
                    {booking.dateTime}
                    {booking.location ? ` · ${booking.location}` : ''}
                  </Text>
                </View>
                <StatusBadge status={booking.status} />
              </View>

              <View style={styles.cardBottomRow}>
                <View style={styles.providerRow}>
                  <View style={[styles.providerAvatar, { backgroundColor: booking.providerColor }]}>
                    <Text style={styles.providerAvatarText}>{booking.providerInitial}</Text>
                  </View>
                  <Text style={styles.providerName}>{booking.providerName}</Text>
                </View>

                {booking.status === 'en_route' ? (
                  <View style={styles.trackRow}>
                    <Text style={styles.priceTextAccent}>{booking.price}</Text>
                    <Text style={styles.trackDot}>·</Text>
                    <Text style={styles.trackText}>Track →</Text>
                  </View>
                ) : booking.status === 'done' ? (
                  <View style={styles.trackRow}>
                    <Text style={styles.priceTextMuted}>{booking.price}</Text>
                    <TouchableOpacity style={styles.rebookBtn}>
                      <Text style={styles.rebookText}>Rebook</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.priceTextBlue}>{booking.price}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF',
  },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A1A', flex: 1 },
  filterText: { fontSize: 14, fontWeight: '700', color: '#E91E8C' },
  reminderBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FBEAF6',
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 16,
    borderRadius: 16,
    padding: 14,
  },
  reminderEmoji: { fontSize: 16, marginTop: 1 },
  reminderTitle: { fontSize: 13, fontWeight: '800', color: '#E91E8C', marginBottom: 2 },
  reminderDesc: { fontSize: 12, fontWeight: '500', color: '#6B7280', lineHeight: 17 },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F1F4',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 4,
    marginBottom: 18,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabBtnActive: { backgroundColor: '#8E24AA' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#9E9E9E' },
  tabTextActive: { color: '#FFF' },
  list: { paddingHorizontal: 16, gap: 14 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 14,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    marginBottom: 0,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  emojiWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: { fontSize: 18 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', marginBottom: 2 },
  cardSubtitle: { fontSize: 11.5, fontWeight: '500', color: '#9E9E9E' },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  badgeText: { fontSize: 10.5, fontWeight: '800' },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F3F3',
    paddingTop: 12,
  },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  providerAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerAvatarText: { fontSize: 11.5, fontWeight: '800', color: '#FFF' },
  providerName: { fontSize: 12.5, fontWeight: '700', color: '#1A1A1A' },
  trackRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  priceTextAccent: { fontSize: 13, fontWeight: '800', color: '#E91E8C' },
  priceTextMuted: { fontSize: 13, fontWeight: '700', color: '#BDBDBD' },
  priceTextBlue: { fontSize: 13, fontWeight: '800', color: '#3949AB' },
  trackDot: { fontSize: 13, color: '#E91E8C' },
  trackText: { fontSize: 12.5, fontWeight: '800', color: '#E91E8C' },
  rebookBtn: {
    backgroundColor: '#F1F1F4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  rebookText: { fontSize: 12, fontWeight: '700', color: '#1A1A1A' },
  emptyState: { paddingVertical: 60, alignItems: 'center' },
  emptyStateText: { fontSize: 13, fontWeight: '600', color: '#B0B0B0' },
});