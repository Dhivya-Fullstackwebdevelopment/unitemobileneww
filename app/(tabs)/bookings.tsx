import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

type TabKey = 'upcoming' | 'ongoing' | 'done' | 'cancelled';
type StatusKey = 'en_route' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  emoji: string;
  emojiBg: string;
  title: string;
  providerName: string;
  dateTime: string;
  location: string;
  price: string;
  status: StatusKey;
  tab: TabKey;
  accentColor: string;
}

const BOOKINGS: Booking[] = [
  {
    id: 'UO-28062025-4521',
    emoji: '❄️',
    emojiBg: '#DCEAFE',
    title: 'AC Deep Cleaning',
    providerName: 'Mohammed A.',
    dateTime: 'Today 10am',
    location: 'Qurum',
    price: 'OMR 17.985',
    status: 'en_route',
    tab: 'upcoming',
    accentColor: '#3B82F6',
  },
  {
    id: 'UO-11072025-3390',
    emoji: '🧹',
    emojiBg: '#EDE4FE',
    title: 'Home Deep Cleaning',
    providerName: 'Fatima Al-Zaabi',
    dateTime: 'Fri 11 Jul',
    location: 'Al Khuwair',
    price: 'OMR 52.000',
    status: 'scheduled',
    tab: 'upcoming',
    accentColor: '#8B5CF6',
  },
  {
    id: 'UO-13072026-9912',
    emoji: '❄️',
    emojiBg: '#DCEAFE',
    title: 'AC Maintenance',
    providerName: 'Mohammed A.',
    dateTime: 'Started 10:02 AM',
    location: 'Qurum',
    price: 'OMR 15.000',
    status: 'in_progress',
    tab: 'ongoing',
    accentColor: '#AA00FF',
  },
  {
    id: 'UO-07072025-1187',
    emoji: '⚡',
    emojiBg: '#FCF0CE',
    title: 'Electrical Repair',
    providerName: 'Khalid Al-Farsi',
    dateTime: 'Mon 7 Jul',
    location: 'Bowsher',
    price: 'OMR 23.000',
    status: 'completed',
    tab: 'done',
    accentColor: '#22C55E',
  },
  {
    id: 'UO-05072025-8845',
    emoji: '🔧',
    emojiBg: '#D6F3F5',
    title: 'Plumbing Fix',
    providerName: 'Salim Al-Habsi',
    dateTime: 'Sat 5 Jul',
    location: 'Qurum',
    price: 'OMR 16.100',
    status: 'completed',
    tab: 'done',
    accentColor: '#14B8A6',
  },
  {
    id: 'UO-20062025-0941',
    emoji: '💅',
    emojiBg: '#FCE4EC',
    title: 'Home Beauty Session',
    providerName: 'Sara Al-Zadjali',
    dateTime: 'Cancelled 19 Jun',
    location: 'Muttrah',
    price: 'OMR 35.000',
    status: 'cancelled',
    tab: 'cancelled',
    accentColor: '#EF4444',
  },
];

const TABS: { key: TabKey; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'done', label: 'Done' },
  { key: 'cancelled', label: 'Cancelled' },
];

function StatusBadge({ status }: { status: StatusKey }) {
  const map: Record<StatusKey, { label: string; bg: string; fg: string }> = {
    en_route: { label: 'En Route', bg: '#DCEAFE', fg: '#2563EB' },
    scheduled: { label: 'Scheduled', bg: '#EDE4FE', fg: '#7C3AED' },
    in_progress: { label: 'In Progress', bg: '#F3E5F5', fg: '#AA00FF' },
    completed: { label: 'Completed', bg: '#DCFCE7', fg: '#16A34A' },
    cancelled: { label: 'Cancelled', bg: '#FDE2E2', fg: '#DC2626' },
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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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
    } else if (booking.status === 'in_progress') {
      router.push('/bookings/jobprogress');
    } else if (booking.status === 'completed') {
      // Show modal with receipt and rating options
      setSelectedBooking(booking);
      setModalVisible(true);
    }
  };

  const handleViewReceipt = () => {
    if (selectedBooking) {
      setModalVisible(false);
      router.push({
        pathname: '/bookings/receipt',
        params: {
          bookingId: selectedBooking.id,
          service: selectedBooking.title,
          provider: selectedBooking.providerName,
          date: selectedBooking.dateTime,
          price: selectedBooking.price,
          location: selectedBooking.location,
        },
      });
    }
  };

  const handleRateService = () => {
    if (selectedBooking) {
      setModalVisible(false);
      router.push({
        pathname: '/professional/rating',
        params: {
          bookingId: selectedBooking.id,
          providerName: selectedBooking.providerName,
          service: selectedBooking.title,
        },
      });
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedBooking(null);
  };

  const renderCompletedModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Service Completed</Text>
            <TouchableOpacity onPress={handleCloseModal} hitSlop={10}>
              <Ionicons name="close" size={24} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {/* Modal Body */}
          <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
            {/* Booking Details */}
            <View style={styles.modalBookingInfo}>
              <View style={[styles.modalEmojiWrap, { backgroundColor: selectedBooking?.emojiBg }]}>
                <Text style={styles.modalEmoji}>{selectedBooking?.emoji}</Text>
              </View>
              <View style={styles.modalBookingDetails}>
                <Text style={styles.modalServiceName}>{selectedBooking?.title}</Text>
                <Text style={styles.modalProviderName}>by {selectedBooking?.providerName}</Text>
                <Text style={styles.modalBookingId}>Booking ID: {selectedBooking?.id}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Status Message */}
            <View style={styles.successMessage}>
              <Ionicons name="checkmark-circle" size={48} color="#22C55E" />
              <Text style={styles.successTitle}>Service Completed Successfully!</Text>
              <Text style={styles.successSubtitle}>
                Thank you for choosing Unite. We hope you enjoyed the service.
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Action Buttons */}
            <Text style={styles.actionLabel}>What would you like to do?</Text>

            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={handleViewReceipt}
            >
              <LinearGradient
                colors={['#D61CA8', '#8B2EF5']}
                style={styles.actionGradient}
              >
                <Ionicons name="receipt-outline" size={22} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>View Receipt / Invoice</Text>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionSecondary]}
              activeOpacity={0.8}
              onPress={handleRateService}
            >
              <View style={styles.actionSecondaryContent}>
                <Ionicons name="star-outline" size={22} color="#D61CA8" />
                <Text style={styles.actionSecondaryText}>Rate & Review Service</Text>
                <Ionicons name="chevron-forward" size={20} color="#D61CA8" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={handleCloseModal}
            >
              <View style={styles.actionTertiaryContent}>
                <Text style={styles.actionTertiaryText}>Maybe Later</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>My Bookings</Text>
      </View>

      {/* Underline Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabBtn}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
              {active && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
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
              activeOpacity={booking.status === 'scheduled' || booking.status === 'cancelled' ? 1 : 0.8}
              onPress={() => handleCardPress(booking)}
              style={[styles.card, { borderLeftColor: booking.accentColor }]}
            >
              <View style={[styles.emojiWrap, { backgroundColor: booking.emojiBg }]}>
                <Text style={styles.emojiText}>{booking.emoji}</Text>
              </View>

              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{booking.title}</Text>
                <Text style={styles.cardSubtitle}>
                  {booking.providerName} · {booking.dateTime} · {booking.location}
                </Text>
              </View>

              <View style={styles.cardRight}>
                <Text style={styles.priceText}>{booking.price}</Text>
                <StatusBadge status={booking.status} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Completed Booking Modal */}
      {renderCompletedModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
    backgroundColor: '#FFF',
  },
  topBarTitle: { fontSize: 24, fontWeight: '800', color: '#111114' },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F3',
  },
  tabBtn: {
    marginRight: 26,
    paddingBottom: 12,
    alignItems: 'center',
  },
  tabText: { fontSize: 14, fontWeight: '700', color: '#A3A3AD' },
  tabTextActive: { color: '#E91E8C' },
  tabUnderline: {
    marginTop: 8,
    height: 2.5,
    width: '100%',
    borderRadius: 2,
    backgroundColor: '#E91E8C',
    position: 'absolute',
    bottom: 0,
  },
  list: { paddingHorizontal: 16, paddingTop: 16, gap: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  emojiWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  emojiText: { fontSize: 18 },
  cardInfo: { flex: 1, paddingRight: 8 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#111114', marginBottom: 3 },
  cardSubtitle: { fontSize: 11.5, fontWeight: '500', color: '#9E9EA8' },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  priceText: { fontSize: 13, fontWeight: '800', color: '#E91E8C' },
  badge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '800' },
  emptyState: { paddingVertical: 60, alignItems: 'center' },
  emptyStateText: { fontSize: 13, fontWeight: '600', color: '#B0B0B0' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  modalBody: {
    padding: 20,
  },
  modalBookingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalEmojiWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  modalEmoji: {
    fontSize: 28,
  },
  modalBookingDetails: {
    flex: 1,
  },
  modalServiceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  modalProviderName: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  modalBookingId: {
    fontSize: 12,
    color: '#9E9EA8',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  successMessage: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 12,
  },
  successSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  actionSecondary: {
    backgroundColor: '#F5F0FF',
    borderWidth: 1,
    borderColor: '#D61CA8',
    borderRadius: 12,
  },
  actionSecondaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 10,
  },
  actionSecondaryText: {
    color: '#D61CA8',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  actionTertiaryContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionTertiaryText: {
    color: '#9E9EA8',
    fontSize: 14,
    fontWeight: '500',
  },
});