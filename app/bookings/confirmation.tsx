import React from 'react';
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

export default function BookingConfirmationScreen() {
  const {
    bookingId = 'UO-4601',
    service = 'AC Deep Cleaning',
    professionalName = 'Mohammed Al-Balushi',
    rating = '4.9',
    dateTime = 'Wed 9 Jul, 10:00 AM',
    address = 'Villa 12, Qurum',
    totalAmount = '17.985',
  } = useLocalSearchParams<{
    bookingId?: string;
    service?: string;
    professionalName?: string;
    rating?: string;
    dateTime?: string;
    address?: string;
    totalAmount?: string;
  }>();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0E12" />
      
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Gradient Success Checkmark Block ── */}
          <LinearGradient
            colors={['#10B981', '#1D4ED8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.checkmarkCard}
          >
            <Ionicons name="checkmark" size={42} color="#0D0E12" />
          </LinearGradient>

          {/* ── Main Titles ── */}
          <Text style={styles.confirmedHeading}>Booking Confirmed!</Text>
          <Text style={styles.notificationSubtitle}>
            Mohammed confirmed. SMS + WhatsApp sent.
          </Text>

          {/* ── Dark Statement Details Table Card ── */}
          <View style={styles.detailsTicketCard}>
            
            <View style={styles.ticketRow}>
              <Text style={styles.labelCol}>Booking</Text>
              <Text style={styles.valueColBold}>#{bookingId}</Text>
            </View>

            <View style={styles.ticketRow}>
              <Text style={styles.labelCol}>Service</Text>
              <Text style={styles.valueCol}>{service}</Text>
            </View>

            <View style={styles.ticketRow}>
              <Text style={styles.labelCol}>Pro</Text>
              <Text style={styles.valueCol}>{professionalName} ★{rating}</Text>
            </View>

            <View style={styles.ticketRow}>
              <Text style={styles.labelCol}>Date</Text>
              <Text style={styles.valueCol}>{dateTime}</Text>
            </View>

            <View style={styles.ticketRow}>
              <Text style={styles.labelCol}>Address</Text>
              <Text style={styles.valueCol}>{address}</Text>
            </View>

            <View style={styles.ticketRow}>
              <Text style={styles.labelCol}>Total</Text>
              <Text style={styles.valueCol}>{`OMR ${totalAmount}`}</Text>
            </View>

          </View>

          {/* ── Bottom Action Button Row ── */}
          <View style={styles.buttonActionRow}>
            
            {/* Chat Action Button */}
            <TouchableOpacity 
              style={styles.chatButton} 
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/ai-chat')}
            >
              <Ionicons name="chatbubble" size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.chatBtnText}>Chat</Text>
            </TouchableOpacity>

            {/* Live Track Action Button */}
            <TouchableOpacity 
              style={styles.trackButtonContainer} 
              activeOpacity={0.9}
              onPress={() => router.push('/bookings/track')}
            >
              <LinearGradient
                colors={['#D500F9', '#7B1FA2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.trackGradientBtn}
              >
                <Ionicons name="location" size={16} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.trackBtnText}>Track</Text>
              </LinearGradient>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0D0E12', // Pure deep dark background flow
  },
  safe: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  checkmarkCard: {
    width: 90,
    height: 90,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  confirmedHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  notificationSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7E8494',
    textAlign: 'center',
    marginBottom: 36,
  },
  detailsTicketCard: {
    backgroundColor: '#161822',
    borderRadius: 20,
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#222533',
    marginBottom: 36,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 7,
  },
  labelCol: {
    fontSize: 13,
    color: '#555B70',
    fontWeight: '600',
  },
  valueCol: {
    fontSize: 13,
    color: '#FFF',
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
  valueColBold: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '800',
    textAlign: 'right',
  },
  buttonActionRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  chatButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#1C1E29',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2C2F3F',
  },
  chatBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  trackButtonContainer: {
    flex: 1,
    height: 48,
  },
  trackGradientBtn: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});