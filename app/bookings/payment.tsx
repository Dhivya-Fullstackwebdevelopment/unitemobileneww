import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface StepInfo {
  index: number;
  label: string;
  state: 'active' | 'inactive' | 'done';
}

const WIZARD_STEPS: StepInfo[] = [
  { index: 1, label: 'Date', state: 'done' },
  { index: 2, label: 'Address', state: 'done' },
  { index: 3, label: 'Pay', state: 'active' },
];

interface PaymentMethod {
  key: string;
  name: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    key: 'muscat',
    name: 'Bank of Muscat',
    subtitle: 'Maisarah ****4521',
    icon: 'business',
    iconColor: '#757575',
    iconBg: '#F5F5F7',
  },
  {
    key: 'apple',
    name: 'Apple Pay',
    subtitle: 'One-tap payment',
    icon: 'logo-apple',
    iconColor: '#000',
    iconBg: '#F5F5F7',
  },
  {
    key: 'thawani',
    name: 'Thawani',
    subtitle: 'Oman local debit',
    icon: 'card',
    iconColor: '#0288D1',
    iconBg: '#F5F5F7',
  },
  {
    key: 'cash',
    name: 'Cash',
    subtitle: 'Pay on completion',
    icon: 'cash',
    iconColor: '#4CAF50',
    iconBg: '#F5F5F7',
  },
];

export default function PaymentScreen() {
  const [selectedMethod, setSelectedMethod] = useState('muscat');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* ── Top Wizard Indicator Line ── */}
      <View style={styles.wizardHeaderBar}>
        {WIZARD_STEPS.map((step, idx) => {
          const isActive = step.state === 'active';
          const isDone = step.state === 'done';
          return (
            <View key={step.index} style={styles.stepBlock}>
              <View style={styles.stepItemCenter}>
                <View
                  style={[
                    styles.stepCircleCircle,
                    isActive && styles.circleActive,
                    isDone && styles.circleDone,
                    !isActive && !isDone && styles.circleInactive,
                  ]}
                >
                  {isDone ? (
                    <Ionicons name="checkmark" size={14} color="#FFF" />
                  ) : (
                    <Text
                      style={[
                        styles.stepCircleNumberText,
                        isActive ? styles.numTextActive : styles.numTextInactive,
                      ]}
                    >
                      {step.index}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabelTitle,
                    isActive || isDone ? styles.labelActive : styles.labelInactive,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
              {idx < WIZARD_STEPS.length - 1 && (
                <View
                  style={[
                    styles.stepHorizontalLineDivider,
                    isDone && styles.lineDividerActive,
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ── Dark Statement Ticket Summary Card ── */}
        <View style={styles.ticketCard}>
          <View style={styles.ticketRow}>
            <Text style={styles.ticketMetaText}>
              AC Deep Cleaning · Mohammed · Wed 9 Jul · Qurum
            </Text>
          </View>
          
          <View style={styles.breakdownItemRow}>
            <Text style={styles.breakdownLabel}>Service</Text>
            <Text style={styles.breakdownValue}>OMR 15.000</Text>
          </View>
          
          <View style={styles.breakdownItemRow}>
            <Text style={styles.breakdownLabel}>Platform</Text>
            <Text style={styles.breakdownValue}>OMR 1.500</Text>
          </View>
          
          <View style={styles.breakdownItemRow}>
            <Text style={styles.breakdownLabel}>VAT 9%</Text>
            <Text style={styles.breakdownValue}>OMR 1.485</Text>
          </View>

          <View style={styles.ticketDividerLine} />

          <View style={styles.ticketTotalRow}>
            <Text style={styles.ticketTotalLabel}>Total</Text>
            <Text style={styles.ticketTotalValue}>OMR 17.985</Text>
          </View>
        </View>

        {/* ── Payment Method Section ── */}
        <Text style={styles.sectionHeadingTitle}>Payment Method</Text>

        {PAYMENT_METHODS.map((method) => {
          const isSelected = method.key === selectedMethod;
          
          return (
            <TouchableOpacity
              key={method.key}
              activeOpacity={0.85}
              onPress={() => setSelectedMethod(method.key)}
              style={[
                styles.methodListItemCard,
                isSelected && styles.methodCardSelectedBorder
              ]}
            >
              <View style={[styles.methodIconBox, { backgroundColor: method.iconBg }]}>
                <Ionicons name={method.icon} size={22} color={method.iconColor} />
              </View>

              <View style={styles.methodInfoMiddleColumn}>
                <Text style={styles.methodTitleText}>{method.name}</Text>
                <Text style={styles.methodSubtitleText}>{method.subtitle}</Text>
              </View>

              <View style={[styles.customRadioOuterCircle, isSelected && styles.radioOuterSelected]}>
                {isSelected && <View style={styles.radioInnerSelectedDot} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Gateway Security Sub-caption label */}
        <View style={styles.secureGatewayCaptionWrap}>
          <Ionicons name="lock-closed" size={13} color="#A2A7B5" style={{ marginRight: 4 }} />
          <Text style={styles.secureGatewayCaptionText}>
            PCI DSS · Bank of Muscat gateway
          </Text>
        </View>

      </ScrollView>

      {/* ── Fixed Bottom Final Action Button ── */}
      <View style={styles.stickyFooterArea}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/bookings/confirmation')}>
          <LinearGradient
            colors={['#D500F9', '#7B1FA2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fixedPayConfirmButton}
          >
            <Text style={styles.fixedPayConfirmButtonText}>
              Pay OMR 17.985 & Confirm →
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  wizardHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  stepBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepItemCenter: {
    alignItems: 'center',
    minWidth: 50,
  },
  stepCircleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  circleActive: {
    backgroundColor: '#BA00E5',
  },
  circleDone: {
    backgroundColor: '#10B981',
  },
  circleInactive: {
    backgroundColor: '#EAECEF',
  },
  stepCircleNumberText: {
    fontSize: 12,
    fontWeight: '700',
  },
  numTextActive: {
    color: '#FFF',
  },
  numTextInactive: {
    color: '#9FA4B0',
  },
  stepLabelTitle: {
    fontSize: 10,
    fontWeight: '700',
  },
  labelActive: {
    color: '#BA00E5',
  },
  labelInactive: {
    color: '#B5B9C4',
  },
  stepHorizontalLineDivider: {
    flex: 1,
    height: 2,
    backgroundColor: '#EAECEF',
    marginHorizontal: 8,
    marginTop: -14,
  },
  lineDividerActive: {
    backgroundColor: '#10B981',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  ticketCard: {
    backgroundColor: '#0A0E1A',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  ticketRow: {
    marginBottom: 14,
  },
  ticketMetaText: {
    fontSize: 12.5,
    color: '#7E879C',
    fontWeight: '600',
    lineHeight: 18,
  },
  breakdownItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#7E879C',
    fontWeight: '600',
  },
  breakdownValue: {
    fontSize: 13,
    color: '#FFF',
    fontWeight: '700',
  },
  ticketDividerLine: {
    height: 1,
    backgroundColor: '#1E2538',
    marginVertical: 14,
  },
  ticketTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketTotalLabel: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '800',
  },
  ticketTotalValue: {
    fontSize: 20,
    color: '#D500F9',
    fontWeight: '900',
  },
  sectionHeadingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  methodListItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  methodCardSelectedBorder: {
    borderColor: '#FFD3E8',
    backgroundColor: '#FFF',
  },
  methodIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodInfoMiddleColumn: {
    flex: 1,
    paddingHorizontal: 14,
  },
  methodTitleText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0B1232',
  },
  methodSubtitleText: {
    fontSize: 12,
    color: '#9FA4B3',
    fontWeight: '500',
    marginTop: 2,
  },
  customRadioOuterCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D4D7E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#D500F9',
  },
  radioInnerSelectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D500F9',
  },
  secureGatewayCaptionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  secureGatewayCaptionText: {
    fontSize: 12,
    color: '#9FA4B3',
    fontWeight: '600',
  },
  stickyFooterArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
  fixedPayConfirmButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedPayConfirmButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});