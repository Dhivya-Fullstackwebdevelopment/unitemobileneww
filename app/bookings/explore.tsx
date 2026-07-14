import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfessionalPro {
  id: string;
  name: string;
  rating: number;
  jobsCount: number;
  distanceKm: number;
  availability: string;
  price: number;
  avatarColor: string;
  initial: string;
  badge?: 'Best' | 'Lowest';
}

const STATIC_PROS: ProfessionalPro[] = [
  {
    id: '1',
    name: 'Mohammed Al-Balushi',
    rating: 4.9,
    jobsCount: 847,
    distanceKm: 0.8,
    availability: 'Today 2pm',
    price: 15,
    avatarColor: '#AB47BC',
    initial: 'M',
    badge: 'Best',
  },
  {
    id: '2',
    name: 'Khalid Al-Farsi',
    rating: 4.8,
    jobsCount: 524,
    distanceKm: 1.2,
    availability: 'Today 4pm',
    price: 15,
    avatarColor: '#AB47BC',
    initial: 'K',
  },
  {
    id: '3',
    name: 'Ahmed Al-Rashdi',
    rating: 4.9,
    jobsCount: 312,
    distanceKm: 1.5,
    availability: 'Tomorrow',
    price: 14,
    avatarColor: '#AB47BC',
    initial: 'A',
    badge: 'Lowest',
  },
  {
    id: '4',
    name: 'Salim Al-Habsi',
    rating: 4.7,
    jobsCount: 215,
    distanceKm: 2.1,
    availability: 'Tomorrow',
    price: 15,
    avatarColor: '#AB47BC',
    initial: 'S',
  },
];

const FILTERS = [
  { key: 'all', label: 'All (14)' },
  { key: 'today', label: 'Today (9)' },
  { key: 'top', label: 'Top Rated' },
  { key: 'nearest', label: 'Nearest' },
];

export default function ExploreScreen() {
  const [query, setQuery] = useState('AC cleaning Qurum today');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* ── Top Fixed Search Header Section ── */}
      <View style={styles.headerSection}>
        <View style={styles.searchBarRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#555" />
          </TouchableOpacity>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={18} color="#8E8E93" style={{ marginRight: 8 }} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search services..."
              placeholderTextColor="#8E8E93"
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* AI Interpretation Notification Banner */}
        <View style={styles.aiNotificationBanner}>
          <Ionicons name="sparkles" size={14} color="#FF4081" style={{ marginRight: 6 }} />
          <Text style={styles.aiNotificationText}>
            <Text style={styles.aiBoldPrefix}>AI: </Text>
            14 results for AC Deep Cleaning in Qurum · Available today
          </Text>
        </View>
      </View>

      {/* ── Horizontal Segment Selectors ── */}
      <View style={styles.filterOuterWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map((item) => {
            const isActive = activeFilter === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setActiveFilter(item.key)}
              >
                <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── List Results ── */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        style={styles.bodyScroll}
      >
        {STATIC_PROS.map((pro) => (
          <View key={pro.id} style={styles.proCard}>
            
            {/* Avatar block */}
            <View style={[styles.avatarCircle, { backgroundColor: pro.avatarColor }]}>
              <Text style={styles.avatarText}>{pro.initial}</Text>
            </View>

            {/* Profile Content block */}
            <View style={styles.profileMiddleInfo}>
              <View style={styles.nameBadgeRow}>
                <Text style={styles.proName} numberOfLines={1}>{pro.name}</Text>
                
                {pro.badge === 'Best' && (
                  <View style={[styles.statusTag, styles.bestTagBg]}>
                    <Text style={[styles.statusTagText, styles.bestTagText]}>✨ Best</Text>
                  </View>
                )}
                {pro.badge === 'Lowest' && (
                  <View style={[styles.statusTag, styles.lowestTagBg]}>
                    <Text style={[styles.statusTagText, styles.lowestTagText]}>💰 Lowest</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.metaRatingDescription} numberOfLines={1}>
                ★{pro.rating} · {pro.jobsCount} jobs · {pro.distanceKm}km · {pro.availability}
              </Text>
            </View>

            {/* Booking Action block */}
            <View style={styles.actionRightStack}>
              <Text style={styles.priceHeading}>OMR {pro.price}</Text>
              <TouchableOpacity activeOpacity={0.85}>
                <LinearGradient
                  colors={['#BA00E5', '#8E24AA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.bookActionGradient}
                >
                  <Text style={styles.bookActionText}>Book →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  headerSection: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F2',
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -4,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    paddingVertical: 0,
  },
  aiNotificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F6',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
    borderWidth: 0.5,
    borderColor: '#FFD3E8',
  },
  aiNotificationText: {
    fontSize: 12,
    color: '#656E8A',
    fontWeight: '500',
    flex: 1,
  },
  aiBoldPrefix: {
    color: '#E91E63',
    fontWeight: '800',
  },
  filterOuterWrap: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEBEF',
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F4F5F8',
  },
  filterPillActive: {
    backgroundColor: '#B319D8',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  filterPillTextActive: {
    color: '#FFF',
  },
  bodyScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 40,
  },
  proCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  profileMiddleInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  proName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0D0E10',
    maxWidth: '70%',
  },
  statusTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bestTagBg: {
    backgroundColor: '#E8F8F5',
  },
  bestTagText: {
    color: '#11B981',
  },
  lowestTagBg: {
    backgroundColor: '#FFF3E0',
  },
  lowestTagText: {
    color: '#FF9800',
  },
  statusTagText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  metaRatingDescription: {
    fontSize: 11.5,
    color: '#9296A5',
    fontWeight: '500',
  },
  actionRightStack: {
    alignItems: 'flex-end',
    gap: 6,
  },
  priceHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000',
  },
  bookActionGradient: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookActionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});