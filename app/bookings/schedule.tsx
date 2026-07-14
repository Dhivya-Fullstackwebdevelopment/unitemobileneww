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
import { LinearGradient } from 'expo-linear-gradient';

interface StepInfo {
  index: number;
  label: string;
  state: 'active' | 'inactive';
}

const WIZARD_STEPS: StepInfo[] = [
  { index: 1, label: 'Date', state: 'active' },
  { index: 2, label: 'Address', state: 'inactive' },
  { index: 3, label: 'Pay', state: 'inactive' },
];

interface DateOption {
  id: string;
  day: string;
  date: string;
}

const DATE_OPTIONS: DateOption[] = [
  { id: 'wed9', day: 'Wed', date: '9' },
  { id: 'thu10', day: 'Thu', date: '10' },
  { id: 'fri11', day: 'Fri', date: '11' },
  { id: 'sat12', day: 'Sat', date: '12' },
  { id: 'sun13', day: 'Sun', date: '13' },
  { id: 'mon14', day: 'Mon', date: '14' },
];

interface TimeOption {
  id: string;
  time: string;
  state: 'selected' | 'available' | 'disabled';
}

const TIME_SLOTS: TimeOption[] = [
  { id: 't8', time: '8:00 AM', state: 'disabled' },
  { id: 't9', time: '9:00 AM', state: 'disabled' },
  { id: 't10', time: '10:00 AM', state: 'selected' },
  { id: 't11', time: '11:00 AM', state: 'available' },
  { id: 't12', time: '12:00 PM', state: 'available' },
  { id: 't2', time: '2:00 PM', state: 'available' },
  { id: 't3', time: '3:00 PM', state: 'available' },
  { id: 't4', time: '4:00 PM', state: 'available' },
  { id: 't5', time: '5:00 PM', state: 'available' },
];

export default function ScheduleServiceScreen() {
  const [selectedDate, setSelectedDate] = useState('wed9');
  const [selectedTime, setSelectedTime] = useState('t10');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* ── Top Wizard Indicator Line ── */}
      <View style={styles.wizardHeaderBar}>
        {WIZARD_STEPS.map((step, idx) => {
          const isActive = step.state === 'active';
          return (
            <View key={step.index} style={styles.stepBlock}>
              <View style={styles.stepItemCenter}>
                <View style={[styles.stepCircleCircle, isActive ? styles.circleActive : styles.circleInactive]}>
                  <Text style={[styles.stepCircleNumberText, isActive ? styles.numTextActive : styles.numTextInactive]}>
                    {step.index}
                  </Text>
                </View>
                <Text style={[styles.stepLabelTitle, isActive ? styles.labelActive : styles.labelInactive]}>
                  {step.label}
                </Text>
              </View>
              {idx < WIZARD_STEPS.length - 1 && <View style={styles.stepHorizontalLineDivider} />}
            </View>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Choose Date Layout Heading */}
        <Text style={styles.mainTitleHeader}>Choose Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateSelectorSliderRow}>
          {DATE_OPTIONS.map((item) => {
            const isChosen = item.id === selectedDate;
            if (isChosen) {
              return (
                <TouchableOpacity key={item.id} activeOpacity={0.9} style={styles.dateCardWrapper}>
                  <LinearGradient
                    colors={['#D500F9', '#8E24AA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientDateCard}
                  >
                    <Text style={styles.dateCardDayTextActive}>{item.day}</Text>
                    <Text style={styles.dateCardNumberTextActive}>{item.date}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity 
                key={item.id} 
                style={styles.plainDateCard}
                activeOpacity={0.7}
                onPress={() => setSelectedDate(item.id)}
              >
                <Text style={styles.dateCardDayTextInactive}>{item.day}</Text>
                <Text style={styles.dateCardNumberTextInactive}>{item.date}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Available Times Selection Header */}
        <Text style={styles.mainTitleHeader}>Available Times</Text>
        <View style={styles.timesGridWrapper}>
          {TIME_SLOTS.map((slot) => {
            const isSelected = slot.id === selectedTime;
            const isDisabled = slot.state === 'disabled';

            if (isSelected) {
              return (
                <TouchableOpacity key={slot.id} activeOpacity={0.9} style={styles.timeSlotCardWrapper}>
                  <LinearGradient
                    colors={['#D500F9', '#8E24AA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientTimeCard}
                  >
                    <Text style={styles.timeCellTextActive}>{slot.time}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            }

            if (isDisabled) {
              return (
                <View key={slot.id} style={styles.timeSlotCardWrapper}>
                  <View style={styles.disabledTimeCard}>
                    <Text style={styles.disabledTimeText}>{slot.time} •</Text>
                  </View>
                </View>
              );
            }

            return (
              <TouchableOpacity
                key={slot.id}
                style={styles.timeSlotCardWrapper}
                activeOpacity={0.7}
                onPress={() => setSelectedTime(slot.id)}
              >
                <View style={styles.plainTimeCard}>
                  <Text style={styles.timeCellTextInactive}>{slot.time}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Informational Toast Callout Banner */}
        <View style={styles.infoToastCalloutCard}>
          <View style={styles.infoIconWrapper}>
            <Ionicons name="information-circle" size={18} color="#42A5F5" />
          </View>
          <Text style={styles.infoToastCaptionText}>
            AC Deep Clean ~45 min. Mohammed arrives at 10:00 AM on Wed 9 Jul.
          </Text>
        </View>

      </ScrollView>

      {/* ── Fixed Bottom Actions Footer ── */}
      <View style={styles.stickyFooterArea}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/bookings/address')}>
          <LinearGradient
            colors={['#D500F9', '#7B1FA2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fixedContinueButton}
          >
            <Text style={styles.fixedContinueButtonText}>Continue to Address →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF',
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 120,
  },
  mainTitleHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    marginBottom: 16,
  },
  dateSelectorSliderRow: {
    flexDirection: 'row',
    marginBottom: 28,
  },
  dateCardWrapper: {
    width: 58,
    height: 64,
    marginRight: 10,
  },
  gradientDateCard: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plainDateCard: {
    width: 58,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#F4F5F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  dateCardDayTextActive: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  dateCardNumberTextActive: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 2,
  },
  dateCardDayTextInactive: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E92A0',
  },
  dateCardNumberTextInactive: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    marginTop: 2,
  },
  timesGridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 24,
  },
  // ── Time slots now mirror the date-card structure: a fixed-size
  // wrapper (no overflow:hidden, no background) holding either a
  // LinearGradient (selected) or a plain/disabled inner card. This
  // matches the pattern used for date cards and avoids the white
  // flash that happened when TouchableOpacity's activeOpacity
  // animated a view that had overflow:hidden + conditional style
  // arrays applied directly to the touchable itself.
  timeSlotCardWrapper: {
    width: '31.5%',
    height: 42,
  },
  gradientTimeCard: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plainTimeCard: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#F4F5F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  disabledTimeCard: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#F8F9FB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0F1F4',
    opacity: 0.6,
  },
  timeCellTextActive: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  timeCellTextInactive: {
    color: '#0B1232',
    fontSize: 12.5,
    fontWeight: '600',
  },
  disabledTimeText: {
    color: '#B2B7C6',
    fontSize: 12.5,
    fontWeight: '600',
  },
  infoToastCalloutCard: {
    flexDirection: 'row',
    backgroundColor: '#F3F7FF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: 'flex-start',
    gap: 8,
  },
  infoIconWrapper: {
    marginTop: 1.5,
  },
  infoToastCaptionText: {
    fontSize: 12.5,
    color: '#5C6AC0',
    fontWeight: '500',
    lineHeight: 18,
    flex: 1,
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
  fixedContinueButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedContinueButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});