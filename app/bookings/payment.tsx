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

interface PaymentMethod {
  key: string;
  name: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  badgeLetter?: string;
  disabled?: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    key: 'thawani',
    name: 'Thawani Pay',
    subtitle: 'Oman local · Instant · No fees',
    icon: 'card',
    iconBg: '#FF7043',
    iconColor: '#FFF',
    badgeLetter: 'T',
  },
  {
    key: 'card',
    name: 'Visa / Mastercard',
    subtitle: 'International cards accepted',
    icon: 'card-outline',
    iconBg: '#1A237E',
    iconColor: '#FFF',
  },
  {
    key: 'apple_pay',
    name: 'Apple Pay',
    subtitle: 'Touch ID or Face ID',
    icon: 'logo-apple',
    iconBg: '#000000',
    iconColor: '#FFF',
  },
  {
    key: 'cash',
    name: 'Cash on Delivery',
    subtitle: 'Pay after service completes',
    icon: 'cash-outline',
    iconBg: '#66BB6A',
    iconColor: '#FFF',
    disabled: true,
  },
];

// TODO: replace with the real total passed from the schedule screen
const TOTAL_AMOUNT = 17;

export default function PaymentScreen() {
  useLocalSearchParams<{ total?: string }>();
  const [selectedMethod, setSelectedMethod] = useState('thawani');

  const activeMethod = PAYMENT_METHODS.find((m) => m.key === selectedMethod);

  const handlePay = () => {
    // TODO: trigger real payment flow (e.g. Thawani checkout session) here
    router.push('/bookings/confirmation');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Payment</Text>
        <View style={styles.secureBadge}>
          <Ionicons name="lock-closed" size={11} color="#2E7D32" />
          <Text style={styles.secureBadgeText}>Secure</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* AI fraud protection banner */}
        <View style={styles.fraudBanner}>
          <View style={styles.fraudIconWrap}>
            <Ionicons name="shield-checkmark" size={18} color="#7C4DFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fraudTitle}>AI Fraud Protection Active</Text>
            <Text style={styles.fraudDesc}>
              Real-time risk scoring by AI. Your transaction is safe.
            </Text>
          </View>
        </View>

        {/* Payment methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>

          {PAYMENT_METHODS.map((method) => {
            const active = method.key === selectedMethod;
            return (
              <TouchableOpacity
                key={method.key}
                disabled={method.disabled}
                onPress={() => setSelectedMethod(method.key)}
                style={[
                  styles.methodCard,
                  active && styles.methodCardActive,
                  method.disabled && styles.methodCardDisabled,
                ]}
              >
                <View style={[styles.methodIconWrap, { backgroundColor: method.iconBg }]}>
                  {method.badgeLetter ? (
                    <Text style={styles.methodBadgeLetter}>{method.badgeLetter}</Text>
                  ) : (
                    <Ionicons name={method.icon} size={20} color={method.iconColor} />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                </View>

                <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                  {active && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky total + pay button */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total to Pay</Text>
          <Text style={styles.totalValue}>OMR {TOTAL_AMOUNT}.000</Text>
        </View>

        <TouchableOpacity activeOpacity={0.9} onPress={handlePay}>
          <LinearGradient
            colors={['#E91E8C', '#7C4DFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.payBtn}
          >
            <Text style={styles.payBtnText} >
              Pay with {activeMethod?.name ?? 'Selected Method'} — OMR {TOTAL_AMOUNT}
            </Text>
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
  topBarTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', flex: 1 },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  secureBadgeText: { fontSize: 11.5, fontWeight: '700', color: '#2E7D32' },
  fraudBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EEF3FF',
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 20,
    borderRadius: 16,
    padding: 14,
  },
  fraudIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fraudTitle: { fontSize: 13, fontWeight: '800', color: '#2E7D32', marginBottom: 2 },
  fraudDesc: { fontSize: 11.5, fontWeight: '500', color: '#6B7280', lineHeight: 16 },
  section: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 14.5, fontWeight: '800', color: '#1A1A1A', marginBottom: 12 },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
  },
  methodCardActive: { borderColor: '#E91E8C' },
  methodCardDisabled: { opacity: 0.45 },
  methodIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodBadgeLetter: { fontSize: 17, fontWeight: '800', color: '#FFF' },
  methodName: { fontSize: 13.5, fontWeight: '800', color: '#1A1A1A', marginBottom: 2 },
  methodSubtitle: { fontSize: 11.5, fontWeight: '500', color: '#9E9E9E' },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: { borderColor: '#E91E8C' },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#E91E8C',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  totalValue: { fontSize: 17, fontWeight: '800', color: '#E91E8C' },
  payBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  payBtnText: { fontSize: 14.5, fontWeight: '800', color: '#FFF' },
});