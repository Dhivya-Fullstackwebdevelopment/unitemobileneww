// app/receipt.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';

const BRAND_GRADIENT = ['#D61CA8', '#8B2EF5'] as const;

interface ReceiptData {
  bookingId: string;
  service: string;
  professional: string;
  date: string;
  time: string;
  address: string;
  duration: string;
  paymentMethod: string;
  status: 'Completed' | 'Cancelled' | 'In Progress';
  serviceFee: number;
  platformFeePercent: number;
  vatPercent: number;
}

const defaultReceipt: ReceiptData = {
  bookingId: 'UO-4601',
  service: 'AC Deep Cleaning',
  professional: 'Mohammed Al-Balushi',
  date: 'Wednesday, 9 Jul 2026',
  time: '10:00 AM – 10:47 AM',
  address: 'Villa 12, Al Noor St, Qurum',
  duration: '47 minutes',
  paymentMethod: 'Bank of Muscat ****4521',
  status: 'Completed',
  serviceFee: 15.0,
  platformFeePercent: 10,
  vatPercent: 9,
};

const formatOMR = (value: number) => `OMR ${value.toFixed(3)}`;

export default function ReceiptScreen() {
  const params = useLocalSearchParams<{ bookingId?: string }>();
  const [downloading, setDownloading] = useState(false);

  // In a real app, fetch the receipt by params.bookingId. Falling back to sample data here.
  const receipt = defaultReceipt;

  const platformFee = (receipt.serviceFee * receipt.platformFeePercent) / 100;
  const vat = ((receipt.serviceFee + platformFee) * receipt.vatPercent) / 100;
  const total = receipt.serviceFee + platformFee + vat;

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      // Hook up to your PDF generation / download endpoint here
      // e.g. await downloadReceiptPdf(receipt.bookingId);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      Alert.alert('Downloaded', 'Your receipt has been saved.');
    } catch {
      Alert.alert('Download failed', 'Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleRateProfessional = () => {
    router.push({
      pathname: '/rate-professional',
      params: { bookingId: receipt.bookingId, professional: receipt.professional },
    } as any);
  };

  const handleBookAgain = () => {
    router.push({
      pathname: '/',
      params: { service: receipt.service, professional: receipt.professional },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F7" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={16} color="#1A1A1A" />
          <Text style={styles.backButtonText}>Back to Bookings</Text>
        </TouchableOpacity>

        <Text style={styles.topBarTitle} numberOfLines={1}>
          #{receipt.bookingId} — Receipt
        </Text>

        <TouchableOpacity
          style={styles.downloadButton}
          activeOpacity={0.85}
          onPress={handleDownloadPDF}
          disabled={downloading}
        >
          {downloading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="download-outline" size={15} color="#FFFFFF" />
              <Text style={styles.downloadButtonText}>Download PDF</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          {/* Brand */}
          <View style={styles.brandRow}>
            <Text style={styles.brandUnite}>Unite</Text>
            <Text style={styles.brandOman}>Oman</Text>
          </View>

          {/* Title */}
          <Text style={styles.receiptTitle}>Service Receipt</Text>
          <Text style={styles.receiptSubtitle}>
            Booking #{receipt.bookingId} · {receipt.date.split(',')[0]} {receipt.date.split(' ').slice(-2).join(' ')}
          </Text>

          <View style={styles.divider} />

          {/* Details grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailColumn}>
              <DetailField label="SERVICE" value={receipt.service} />
              <DetailField label="DATE" value={receipt.date} />
              <DetailField label="ADDRESS" value={receipt.address} />
              <DetailField label="PAYMENT" value={receipt.paymentMethod} />
            </View>
            <View style={styles.detailColumn}>
              <DetailField label="PROFESSIONAL" value={receipt.professional} />
              <DetailField label="TIME" value={receipt.time} />
              <DetailField label="DURATION" value={receipt.duration} />
              <DetailField
                label="STATUS"
                value={`${receipt.status} ${receipt.status === 'Completed' ? '✓' : ''}`}
              />
            </View>
          </View>

          {/* Price breakdown */}
          <View style={styles.priceBox}>
            <Text style={styles.priceBoxTitle}>Price Breakdown</Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service fee</Text>
              <Text style={styles.priceValue}>{formatOMR(receipt.serviceFee)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Platform fee ({receipt.platformFeePercent}%)</Text>
              <Text style={styles.priceValue}>{formatOMR(platformFee)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>VAT ({receipt.vatPercent}%)</Text>
              <Text style={styles.priceValue}>{formatOMR(vat)}</Text>
            </View>

            <View style={styles.totalDivider} />

            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalValue}>{formatOMR(total)}</Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity activeOpacity={0.85} onPress={handleRateProfessional} style={styles.rateButtonWrap}>
              <LinearGradient
                colors={BRAND_GRADIENT}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.rateButton}
              >
                <Ionicons name="star" size={16} color="#FFD400" />
                <Text style={styles.rateButtonText}>
                  Rate {receipt.professional.split(' ')[0]}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bookAgainButton}
              activeOpacity={0.7}
              onPress={handleBookAgain}
            >
              <Ionicons name="repeat" size={16} color="#2F80ED" />
              <Text style={styles.bookAgainText}>Book Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailField}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    marginTop: 18
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  backButtonText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#4A4A52',
  },
  topBarTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#B026C0',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
    minWidth: 100,
    justifyContent: 'center',
  },
  downloadButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  brandRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  brandUnite: {
    fontSize: 20,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#D61CA8',
  },
  brandOman: {
    fontSize: 20,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#3B2EF5',
  },

  receiptTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4,
  },
  receiptSubtitle: {
    fontSize: 12.5,
    color: '#9E9EA8',
    textAlign: 'center',
    marginBottom: 18,
  },

  divider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginBottom: 18,
  },

  detailsGrid: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  detailColumn: {
    flex: 1,
    gap: 14,
  },
  detailField: {
    gap: 3,
  },
  detailLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#B0B0B8',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  priceBox: {
    backgroundColor: '#F5F5F8',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  priceBoxTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 13,
    color: '#8E8E96',
  },
  priceValue: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  totalDivider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 6,
  },
  totalLabel: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#B026C0',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rateButtonWrap: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  rateButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bookAgainButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    paddingVertical: 14,
  },
  bookAgainText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});