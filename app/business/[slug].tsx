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

interface MetricStat {
  value: string;
  label: string;
}

const STATS_GRID: MetricStat[] = [
  { value: '★4.9', label: 'Rating' },
  { value: '847', label: 'Jobs' },
  { value: '98%', label: 'Done' },
  { value: '0.8km', label: 'Dist' },
];

const CAPSULE_SERVICES = [
  'AC Deep Cleaning — OMR 15',
  'AC Repair — OMR 25',
  'Gas Refill — OMR 20',
  'Installation — OMR 35',
  'Electrical — OMR 18',
];

interface ReviewItem {
  id: string;
  author: string;
  stars: number;
  text: string;
}

const REVIEWS_DATA: ReviewItem[] = [
  {
    id: '1',
    author: 'Ahmed R.',
    stars: 5,
    text: 'Punctual and professional!',
  },
  {
    id: '2',
    author: 'Fatima B.',
    stars: 5,
    text: 'Excellent, fixed it perfectly.',
  },
];

const PROFESSIONAL = {
  name: 'Mohammed Al-Balushi',
  role: 'AC Specialist · 0.8km away',
  initial: 'M',
  price: 15,
};

export default function ProfessionalProfileScreen() {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#BA00E5" />

      {/* ── Top Scrollable View Area ── */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
      >
        {/* ── Purple Header Hero Area ── */}
        <LinearGradient
          colors={['#D500F9', '#8E24AA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <SafeAreaView edges={['top']} style={styles.safeHeader}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.avatarContainer}>
              <View style={styles.whiteAvatarCircle}>
                <Text style={styles.avatarInitial}>{PROFESSIONAL.initial}</Text>
              </View>
              <Text style={styles.proName}>{PROFESSIONAL.name}</Text>
              <Text style={styles.proRoleText}>{PROFESSIONAL.role}</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* ── Outer Content Body Area ── */}
        <View style={styles.contentBody}>
          
          {/* Quick Metrics Grid Row */}
          <View style={styles.metricsRow}>
            {STATS_GRID.map((stat, i) => (
              <View key={i} style={styles.metricCard}>
                <Text style={styles.metricValue}>{stat.value}</Text>
                <Text style={styles.metricLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* AI Banner Block */}
          <View style={styles.aiInsightBanner}>
            <Text style={styles.aiInsightText}>
              🤖 <Text style={styles.aiInsightBold}>AI Score: 98/100.</Text> Best match — 0 cancellations, highest AC rating, available today.
            </Text>
          </View>

          {/* Services Section */}
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionHeadingTitle}>Services</Text>
            <View style={styles.chipsFlexContainer}>
              {CAPSULE_SERVICES.map((label, idx) => (
                <View key={idx} style={styles.serviceChipTag}>
                  <Text style={styles.serviceChipText}>{label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Reviews Section */}
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionHeadingTitle}>Reviews</Text>
            {REVIEWS_DATA.map((review) => (
              <View key={review.id} style={styles.reviewCardItem}>
                <View style={styles.reviewHeaderRow}>
                  <Text style={styles.reviewAuthorName}>{review.author}</Text>
                  <View style={styles.starsRowWrap}>
                    {Array.from({ length: review.stars }).map((_, sIdx) => (
                      <Ionicons key={sIdx} name="star" size={13} color="#FFB300" />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewContentText}>{review.text}</Text>
              </View>
            ))}
          </View>

        </View>
      </ScrollView>

      {/* ── Fixed Bottom Booking Button Bar ── */}
      <View style={styles.stickyFooterBar}>
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={() => router.push('/bookings/schedule')}
        >
          <LinearGradient
            colors={['#D500F9', '#7B1FA2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fixedActionBookBtn}
          >
            <Text style={styles.fixedActionBookText}>
              Book Mohammed — OMR {PROFESSIONAL.price}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F3F4F7',
  },
  scrollContainer: {
    paddingBottom: 120,
  },
  heroGradient: {
    paddingBottom: 32,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  safeHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  whiteAvatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  avatarInitial: {
    fontSize: 42,
    fontWeight: '800',
    color: '#AA00FF',
  },
  proName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  proRoleText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
  },
  contentBody: {
    paddingHorizontal: 16,
    marginTop: -20,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
    marginTop: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9E9E9E',
    marginTop: 2,
  },
  aiInsightBanner: {
    backgroundColor: '#F5ECF7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
    borderColor: '#E1CBE7',
    marginBottom: 20,
  },
  aiInsightText: {
    fontSize: 12.5,
    color: '#656E8A',
    fontWeight: '500',
    lineHeight: 18,
  },
  aiInsightBold: {
    color: '#BA00E5',
    fontWeight: '800',
  },
  sectionWrap: {
    marginBottom: 22,
  },
  sectionHeadingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    marginBottom: 12,
  },
  chipsFlexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChipTag: {
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  serviceChipText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  reviewCardItem: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewAuthorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  starsRowWrap: {
    flexDirection: 'row',
    gap: 1,
  },
  reviewContentText: {
    fontSize: 13,
    color: '#7F8494',
    fontWeight: '500',
  },
  stickyFooterBar: {
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
  fixedActionBookBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedActionBookText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});