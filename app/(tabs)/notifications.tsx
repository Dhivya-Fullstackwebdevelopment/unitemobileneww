import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';

interface NotificationItem {
  id: string;
  emoji: string;
  emojiBg: string;
  title: string;
  subtitle: string;
  subtitleColor: string;
  time: string;
  unread: boolean;
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    emoji: '📍',
    emojiBg: '#FBD9E8',
    title: 'Mohammed is 12 min away!',
    subtitle: 'Booking #UO-4601 · AC Deep Cleaning',
    subtitleColor: '#6B7280',
    time: '2 min ago',
    unread: true,
  },
  {
    id: '2',
    emoji: '✅',
    emojiBg: '#C8F0D8',
    title: 'Booking Confirmed #UO-4601',
    subtitle: 'Wed 9 Jul, 10:00 AM with Mohammed',
    subtitleColor: '#6B7280',
    time: '9:42 AM',
    unread: true,
  },
  {
    id: '3',
    emoji: '💳',
    emojiBg: '#D6E8FB',
    title: 'Payment Authorized',
    subtitle: 'OMR 17.985 · Bank of Muscat ****4521',
    subtitleColor: '#6B7280',
    time: '9:42 AM',
    unread: false,
  },
  {
    id: '4',
    emoji: '⭐',
    emojiBg: '#FCEFC7',
    title: 'Rate Khalid Al-Farsi',
    subtitle: 'How was your Electrical Repair? Share feedback!',
    subtitleColor: '#6B7280',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '5',
    emoji: '🎁',
    emojiBg: '#FBD9E8',
    title: 'Summer AC Deal — 20% Off',
    subtitle: 'Valid until Jul 31. Use code SUMMER20',
    subtitleColor: '#D97706',
    time: '8 Jul',
    unread: false,
  },
  {
    id: '6',
    emoji: '✅',
    emojiBg: '#C8F0D8',
    title: 'Service Complete — #UO-4598',
    subtitle: 'Electrical Repair done. OMR 23 charged.',
    subtitleColor: '#16A34A',
    time: '7 Jul',
    unread: false,
  },
];

export default function NotificationsScreen() {
  const [items, setItems] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markReadText}>Mark read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {items.map((n) => (
          <TouchableOpacity
            key={n.id}
            activeOpacity={0.8}
            style={[styles.card, n.unread ? styles.cardUnread : styles.cardRead]}
          >
            <View style={[styles.emojiWrap, { backgroundColor: n.emojiBg }]}>
              <Text style={styles.emojiText}>{n.emoji}</Text>
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{n.title}</Text>
              <Text style={[styles.cardSubtitle, { color: n.subtitleColor }]}>{n.subtitle}</Text>
            </View>

            <View style={styles.cardRight}>
              <Text style={styles.timeText}>{n.time}</Text>
              {n.unread && <View style={styles.unreadDot} />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 14,
    backgroundColor: '#FFF',
  },
  topBarTitle: { fontSize: 24, fontWeight: '800', color: '#111114' },
  markReadText: { fontSize: 14, fontWeight: '700', color: '#E91E8C' },
  list: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 16,
    padding: 14,
  },
  cardUnread: {
    backgroundColor: '#FBEAF4',
  },
  cardRead: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  emojiWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emojiText: { fontSize: 18 },
  cardInfo: { flex: 1, paddingRight: 8 },
  cardTitle: { fontSize: 14.5, fontWeight: '800', color: '#111114', marginBottom: 3 },
  cardSubtitle: { fontSize: 12, fontWeight: '500', lineHeight: 17 },
  cardRight: { alignItems: 'flex-end', gap: 8, minWidth: 56 },
  timeText: { fontSize: 11, fontWeight: '500', color: '#A3A3AD' },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#E91E8C',
  },
});