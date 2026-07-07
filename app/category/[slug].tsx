import { useMemo, useState } from 'react';
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

interface CategoryInfo {
  title: string;
  subtitle: string;
  fromPrice: number;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: readonly [string, string];
  filters: string[];
}

interface ServiceListItem {
  id: string;
  title: string;
  subtitle: string;
  rating: number;
  reviews?: string;
  price: number;
  priceSuffix?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  tag?: string;
}

// Same static content is shown no matter which category slug is tapped.
// Swap this out later for a real lookup (catalogApi + businessApi by slug).
const STATIC_CATEGORY: CategoryInfo = {
  title: 'AC Service',
  subtitle: 'Cleaning · Repair · Installation',
  fromPrice: 10,
  icon: 'snow-outline',
  gradient: ['#2979FF', '#1565C0'],
  filters: ['All', 'Cleaning', 'Repair', 'Install'],
};

const STATIC_SERVICES: ServiceListItem[] = [
  {
    id: 'ac-deep-cleaning',
    title: 'AC Deep Cleaning',
    subtitle: 'Filter, coil wash, drain flush',
    rating: 4.9,
    reviews: '2.3k',
    price: 15,
    icon: 'snow-outline',
    iconBg: '#E3F2FD',
    iconColor: '#42A5F5',
    tag: 'Cleaning',
  },
  {
    id: 'ac-repair-diagnosis',
    title: 'AC Repair & Diagnosis',
    subtitle: 'Gas refill, fault diagnosis',
    rating: 4.8,
    reviews: '1.1k',
    price: 25,
    icon: 'build-outline',
    iconBg: '#FFF8E1',
    iconColor: '#FFB300',
    tag: 'Repair',
  },
  {
    id: 'ac-annual-contract',
    title: 'AC Annual Contract',
    subtitle: '2 full services + priority',
    rating: 4.9,
    price: 89,
    priceSuffix: '/yr',
    icon: 'document-text-outline',
    iconBg: '#E8F5E9',
    iconColor: '#66BB6A',
    tag: 'Install',
  },
];

export default function CategoryScreen() {
  // slug is still read (so the route works per-category and back navigation
  // is correct) but is intentionally not used to change the content shown.
  useLocalSearchParams<{ slug: string }>();
  const [activeFilter, setActiveFilter] = useState('All');

  const category = STATIC_CATEGORY;
  const allServices = STATIC_SERVICES;

  const filteredServices = useMemo(() => {
    if (activeFilter === 'All') return allServices;
    return allServices.filter((s) => s.tag === activeFilter);
  }, [activeFilter, allServices]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>AC Services</Text>
        <TouchableOpacity style={[styles.iconBtn, styles.filterBtn]}>
          <Ionicons name="options-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Banner */}
        <LinearGradient
          colors={category.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>{category.title}</Text>
            <Text style={styles.bannerSubtitle}>{category.subtitle}</Text>
            <Text style={styles.bannerFrom}>From OMR {category.fromPrice}</Text>
          </View>
          <View style={styles.bannerIconWrap}>
            <Ionicons name={category.icon} size={30} color="rgba(255,255,255,0.9)" />
          </View>
        </LinearGradient>

        {/* Filter chips */}
        <View style={styles.filterRow}>
          {category.filters.map((filter) => {
            const active = filter === activeFilter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Results header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>{filteredServices.length} services found</Text>
          <View style={styles.aiSortedBadge}>
            <Ionicons name="sparkles" size={11} color="#8E24AA" />
            <Text style={styles.aiSortedText}>AI Sorted</Text>
          </View>
        </View>

        {/* Service list */}
        <View style={styles.list}>
          {filteredServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => router.push(`/business/${service.id}`)}
            >
              <View style={[styles.serviceIconWrap, { backgroundColor: service.iconBg }]}>
                <Ionicons name={service.icon} size={24} color={service.iconColor} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color="#FFB300" />
                  <Text style={styles.ratingText}>{service.rating}</Text>
                  {service.reviews && <Text style={styles.reviewsText}>({service.reviews})</Text>}
                </View>
              </View>

              <View style={styles.priceWrap}>
                <Text style={styles.priceText}>OMR {service.price}</Text>
                {service.priceSuffix && <Text style={styles.priceSuffix}>{service.priceSuffix}</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    gap: 8,
  },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  filterBtn: { marginLeft: 'auto' },
  topBarTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', textAlign: 'left' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
  },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: '#FFF', marginBottom: 6 },
  bannerSubtitle: { fontSize: 12.5, fontWeight: '500', color: 'rgba(255,255,255,0.85)', marginBottom: 10 },
  bannerFrom: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  bannerIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#F2F2F5',
  },
  filterChipActive: {
    backgroundColor: '#E91E8C',
  },
  filterChipText: { fontSize: 12.5, fontWeight: '700', color: '#777' },
  filterChipTextActive: { color: '#FFF' },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  resultsCount: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  aiSortedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FBEAFB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  aiSortedText: { fontSize: 11, fontWeight: '800', color: '#8E24AA' },
  list: { paddingHorizontal: 16, gap: 12 },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTitle: { fontSize: 14.5, fontWeight: '800', color: '#1A1A1A', marginBottom: 3 },
  serviceSubtitle: { fontSize: 12, fontWeight: '500', color: '#9E9E9E', marginBottom: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#1A1A1A' },
  reviewsText: { fontSize: 11.5, fontWeight: '500', color: '#9E9E9E' },
  priceWrap: { alignItems: 'flex-end' },
  priceText: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  priceSuffix: { fontSize: 10.5, fontWeight: '600', color: '#9E9E9E' },
});