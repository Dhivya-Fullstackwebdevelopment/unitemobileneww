import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

export default function BookingConfirmationScreen() {
  const {
    bookingId = 'UO-28062025-4521',
    amount = '17',
    method = 'Thawani',
    professionalName = 'Mohammed Al-Balushi',
    professionalRole = 'AC Specialist',
    rating = '4.9',
    matchScore = '94%',
    service = 'AC Deep Cleaning',
    dateTime = 'Sat 28 Jun, 10:00 AM',
    address = 'Qurum, Muscat',
  } = useLocalSearchParams<{
    bookingId?: string;
    amount?: string;
    method?: string;
    professionalName?: string;
    professionalRole?: string;
    rating?: string;
    matchScore?: string;
    service?: string;
    dateTime?: string;
    address?: string;
  }>();

  const initial = String(professionalName).trim().charAt(0).toUpperCase();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 32, paddingBottom: 24 }}
      >
        {/* Success icon */}
        <View style={styles.successIconOuter}>
          <View style={styles.successIconInner}>
            <Ionicons name="checkmark" size={44} color="#22B573" />
          </View>
        </View>

        <Text style={styles.title}>Booking Confirmed! 🎉</Text>
        <Text style={styles.subtitle}>Your professional has been assigned</Text>

        <View style={styles.bookingIdBadge}>
          <Text style={styles.bookingIdText}>Booking #{bookingId}</Text>
        </View>

        {/* Professional card */}
        <View style={styles.card}>
          <View style={styles.proRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.proName}>{professionalName}</Text>
              <View style={styles.proMetaRow}>
                <Text style={styles.proMeta}>{professionalRole}</Text>
                <Text style={styles.proMetaDot}>·</Text>
                <Ionicons name="star" size={12} color="#FFB300" />
                <Text style={styles.proMeta}>{rating}</Text>
                <Text style={styles.proMetaDot}>·</Text>
                <Text style={styles.proMetaAI}>AI Match {matchScore}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.circleBtn}>
              <Ionicons name="chatbubble-outline" size={16} color="#1A1A1A" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.circleBtn, styles.circleBtnPrimary]}>
              <Ionicons name="call" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{service}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>{dateTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{address}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment</Text>
            <Text style={styles.detailValuePaid}>
              Paid via {method} — OMR {amount}
            </Text>
          </View>
        </View>

        {/* AI notice */}
        <View style={styles.aiNotice}>
          <Text style={styles.aiNoticeText}>
            ✨ AI sent confirmation SMS in Arabic & English via Unifonic. Reminder set for 8:00 AM
            tomorrow.
          </Text>
        </View>

        {/* Actions */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: '/bookings/track',
              params: {
                professionalName,
                professionalRole,
                rating,
                service,
                address,
                vehicle: 'Toyota Hiace · White',
                plate: 'AB 1234',
                etaMinutes: '8',
              },
            })
          }
          style={{ marginTop: 20 }}
        >
          <LinearGradient
            colors={['#E91E8C', '#7C4DFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryBtnText}>Track Service Live</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.replace('/')}
          style={styles.secondaryBtn}
        >
          <Text style={styles.secondaryBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  successIconOuter: {
    alignSelf: 'center',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8F9F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successIconInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2.5,
    borderColor: '#22B573',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#9E9E9E',
    textAlign: 'center',
    marginBottom: 16,
  },
  bookingIdBadge: {
    alignSelf: 'center',
    backgroundColor: '#FBEAF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  bookingIdText: { fontSize: 12.5, fontWeight: '700', color: '#E91E8C' },
  card: {
    backgroundColor: '#F7F7F9',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  proRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#8E24AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  proName: { fontSize: 14.5, fontWeight: '800', color: '#1A1A1A', marginBottom: 2 },
  proMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  proMeta: { fontSize: 11.5, fontWeight: '600', color: '#757575' },
  proMetaDot: { fontSize: 11.5, color: '#BDBDBD' },
  proMetaAI: { fontSize: 11.5, fontWeight: '700', color: '#7C4DFF' },
  circleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBtnPrimary: { backgroundColor: '#8E24AA' },
  divider: { height: 1, backgroundColor: '#EAEAEA', marginVertical: 14 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: { fontSize: 12.5, fontWeight: '600', color: '#9E9E9E' },
  detailValue: { fontSize: 12.5, fontWeight: '700', color: '#1A1A1A' },
  detailValuePaid: { fontSize: 12.5, fontWeight: '700', color: '#22B573' },
  aiNotice: {
    backgroundColor: '#EEF3FF',
    borderRadius: 16,
    padding: 14,
  },
  aiNoticeText: { fontSize: 12, fontWeight: '500', color: '#5B6B99', lineHeight: 17 },
  primaryBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnText: { fontSize: 14.5, fontWeight: '800', color: '#FFF' },
  secondaryBtn: {
    marginTop: 12,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
  },
  secondaryBtnText: { fontSize: 14.5, fontWeight: '800', color: '#1A1A1A' },
});