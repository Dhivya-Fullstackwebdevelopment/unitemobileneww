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
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

interface StepInfo {
  key: string;
  label: string;
  index: number;
}

const STEPS: StepInfo[] = [
  { key: 'details', label: 'Details', index: 1 },
  { key: 'schedule', label: 'Schedule', index: 2 },
  { key: 'payment', label: 'Payment', index: 3 },
];

const CURRENT_STEP = 2;

interface DateOption {
  key: string;
  day: string;
  date: string;
  disabled?: boolean;
}

const DATE_OPTIONS: DateOption[] = [
  { key: 'fri27', day: 'Fri', date: '27' },
  { key: 'sat28', day: 'Sat', date: '28' },
  { key: 'sun29', day: 'Sun', date: '29' },
  { key: 'mon30', day: 'Mon', date: '30' },
  { key: 'tue01', day: 'Tue', date: '01', disabled: true },
];

interface TimeOption {
  key: string;
  label: string;
  disabled?: boolean;
}

const TIME_OPTIONS: TimeOption[] = [
  { key: '9am', label: '9:00 AM' },
  { key: '10am', label: '10:00 AM' },
  { key: '11am', label: '11:00 AM' },
  { key: '2pm', label: '2:00 PM' },
  { key: '3pm', label: '3:00 PM' },
  { key: '4pm', label: '4:00 PM', disabled: true },
];

// TODO: replace with the actual service/pro selected on the profile screen
const BOOKING_SUMMARY = {
  serviceName: 'AC Deep Cleaning',
  units: 1,
  proName: 'Mohammed Al-Balushi',
  matchScore: 94,
  price: 15,
};

const ADDRESS = {
  line1: 'Villa 14, Street 16, Qurum',
  line2: 'Al Khuwair, Muscat',
};

const PLATFORM_FEE = 2;

export default function ScheduleServiceScreen() {
  useLocalSearchParams<{ proId?: string; serviceId?: string }>();
  const [selectedDate, setSelectedDate] = useState('sat28');
  const [selectedTime, setSelectedTime] = useState('10am');

  const servicePrice = BOOKING_SUMMARY.price;
  const total = servicePrice + PLATFORM_FEE;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Schedule Service</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Step progress */}
        <View style={styles.stepCard}>
          {STEPS.map((step, i) => {
            const isDone = step.index < CURRENT_STEP;
            const isActive = step.index === CURRENT_STEP;
            return (
              <View key={step.key} style={styles.stepItemWrap}>
                <View style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      isDone && styles.stepCircleDone,
                      isActive && styles.stepCircleActive,
                    ]}
                  >
                    {isDone ? (
                      <Ionicons name="checkmark" size={14} color="#FFF" />
                    ) : (
                      <Text style={[styles.stepNumber, isActive && styles.stepNumberActive]}>
                        {step.index}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isDone && styles.stepLabelDone,
                      isActive && styles.stepLabelActive,
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
                {i < STEPS.length - 1 && (
                  <View style={[styles.stepConnector, isDone && styles.stepConnectorDone]} />
                )}
              </View>
            );
          })}
        </View>

        {/* Service summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconWrap}>
            <Ionicons name="snow-outline" size={22} color="#42A5F5" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>
              {BOOKING_SUMMARY.serviceName} · {BOOKING_SUMMARY.units} unit
            </Text>
            <Text style={styles.summarySubtitle}>
              {BOOKING_SUMMARY.proName} · AI Match: {BOOKING_SUMMARY.matchScore}%
            </Text>
          </View>
          <Text style={styles.summaryPrice}>OMR {servicePrice}</Text>
        </View>

        {/* Pick a date */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Pick a Date</Text>
            <View style={styles.aiSuggestBadge}>
              <Ionicons name="sparkles" size={10} color="#8E24AA" />
              <Text style={styles.aiSuggestText}>AI suggests Sat 28</Text>
            </View>
          </View>

          <View style={styles.dateRow}>
            {DATE_OPTIONS.map((option) => {
              const active = option.key === selectedDate;
              return (
                <TouchableOpacity
                  key={option.key}
                  disabled={option.disabled}
                  style={[styles.dateChip, active && styles.dateChipActive, option.disabled && styles.dateChipDisabled]}
                  onPress={() => setSelectedDate(option.key)}
                >
                  {active ? (
                    <LinearGradient
                      colors={['#E91E8C', '#7C4DFF']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.dateChipGradient}
                    >
                      <Text style={[styles.dateChipDay, styles.dateChipTextActive]}>{option.day}</Text>
                      <Text style={[styles.dateChipDate, styles.dateChipTextActive]}>{option.date}</Text>
                    </LinearGradient>
                  ) : (
                    <>
                      <Text style={[styles.dateChipDay, option.disabled && styles.dateChipTextDisabled]}>
                        {option.day}
                      </Text>
                      <Text style={[styles.dateChipDate, option.disabled && styles.dateChipTextDisabled]}>
                        {option.date}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Pick a time slot */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pick a Time Slot</Text>
          <View style={styles.timeGrid}>
            {TIME_OPTIONS.map((option) => {
              const active = option.key === selectedTime;
              return (
                <TouchableOpacity
                  key={option.key}
                  disabled={option.disabled}
                  onPress={() => setSelectedTime(option.key)}
                  style={styles.timeChipWrap}
                >
                  {active ? (
                    <LinearGradient
                      colors={['#E91E8C', '#7C4DFF']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.timeChip}
                    >
                      <Text style={styles.timeChipTextActive}>{option.label}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={[styles.timeChip, styles.timeChipInactive, option.disabled && styles.timeChipDisabled]}>
                      <Text style={[styles.timeChipText, option.disabled && styles.timeChipTextDisabled]}>
                        {option.label}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Address */}
        <View style={styles.addressCard}>
          <View style={styles.addressLeft}>
            <Ionicons name="location" size={18} color="#E91E8C" />
            <View>
              <Text style={styles.addressLine1}>{ADDRESS.line1}</Text>
              <Text style={styles.addressLine2}>{ADDRESS.line2}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Price breakdown */}
        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              {BOOKING_SUMMARY.serviceName} × {BOOKING_SUMMARY.units}
            </Text>
            <Text style={styles.priceValue}>OMR {servicePrice}.000</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Platform fee</Text>
            <Text style={styles.priceValue}>OMR {PLATFORM_FEE}.000</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>OMR {total}.000</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky proceed button */}
      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.9} 
        onPress={() => router.push('/bookings/payment')}
        >
          <LinearGradient
            colors={['#E91E8C', '#7C4DFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.proceedBtn}
          >
            <Text style={styles.proceedBtnText}>Proceed to Payment</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  topBarTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 18,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  stepItemWrap: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  stepItem: { alignItems: 'center', gap: 6 },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
  },
  stepCircleDone: { backgroundColor: '#2E7D32' },
  stepCircleActive: { backgroundColor: '#E91E8C' },
  stepNumber: { fontSize: 12, fontWeight: '700', color: '#9E9E9E' },
  stepNumberActive: { color: '#FFF' },
  stepLabel: { fontSize: 10.5, fontWeight: '600', color: '#BDBDBD' },
  stepLabelDone: { color: '#2E7D32' },
  stepLabelActive: { color: '#E91E8C' },
  stepConnector: { flex: 1, height: 2, backgroundColor: '#F0F0F0', marginHorizontal: 4, marginBottom: 16 },
  stepConnectorDone: { backgroundColor: '#E91E8C' },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 22,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  summaryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: { fontSize: 13.5, fontWeight: '800', color: '#1A1A1A', marginBottom: 2 },
  summarySubtitle: { fontSize: 11.5, fontWeight: '500', color: '#9E9E9E' },
  summaryPrice: { fontSize: 15, fontWeight: '800', color: '#E91E8C' },
  section: { paddingHorizontal: 16, marginBottom: 22 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', marginBottom: 12 },
  aiSuggestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FBEAFB',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
  },
  aiSuggestText: { fontSize: 10.5, fontWeight: '700', color: '#8E24AA' },
  dateRow: { flexDirection: 'row', gap: 8 },
  dateChip: {
    flex: 1,
    height: 66,
    borderRadius: 16,
    backgroundColor: '#F7F7F9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dateChipActive: { backgroundColor: 'transparent' },
  dateChipDisabled: { opacity: 0.5 },
  dateChipGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  dateChipDay: { fontSize: 11.5, fontWeight: '600', color: '#777', marginBottom: 3 },
  dateChipDate: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  dateChipTextActive: { color: '#FFF' },
  dateChipTextDisabled: { color: '#CCC' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeChipWrap: { width: '31%' },
  timeChip: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeChipInactive: { backgroundColor: '#F7F7F9', borderWidth: 1, borderColor: '#EDEDED' },
  timeChipDisabled: { opacity: 0.5 },
  timeChipText: { fontSize: 12.5, fontWeight: '700', color: '#444' },
  timeChipTextActive: { fontSize: 12.5, fontWeight: '800', color: '#FFF' },
  timeChipTextDisabled: { color: '#BDBDBD' },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 18,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  addressLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  addressLine1: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  addressLine2: { fontSize: 11.5, fontWeight: '500', color: '#9E9E9E', marginTop: 1 },
  changeText: { fontSize: 12.5, fontWeight: '700', color: '#E91E8C' },
  priceCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  priceLabel: { fontSize: 12.5, fontWeight: '500', color: '#777' },
  priceValue: { fontSize: 12.5, fontWeight: '700', color: '#1A1A1A' },
  priceDivider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 6 },
  totalLabel: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  totalValue: { fontSize: 15, fontWeight: '800', color: '#E91E8C' },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  proceedBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  proceedBtnText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
});