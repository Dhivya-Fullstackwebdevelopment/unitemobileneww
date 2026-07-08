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
import { Colors } from '../../constants/Colors';
import { THEME } from '@/components/Reuse/Reusecolor';
import FloatingAIButton from '@/components/FloatingAIButton';

// Replace with the logged-in user's real first name from your auth store
const USER_NAME = 'Ahmed';
const DELIVERY_AREA = 'Qurum, Muscat';

interface ServiceItem {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  bg: string;
  iconColor: string;
}

const SERVICES: ServiceItem[] = [
  { key: 'ac', label: 'AC Service', icon: 'snow-outline', bg: '#E3F2FD', iconColor: '#42A5F5' },
  { key: 'cleaning', label: 'Cleaning', icon: 'sparkles-outline', bg: '#E8F5E9', iconColor: '#66BB6A' },
  { key: 'plumbing', label: 'Plumbing', icon: 'water-outline', bg: '#E0F7FA', iconColor: '#26C6DA' },
  { key: 'electrical', label: 'Electrical', icon: 'flash-outline', bg: '#FFF8E1', iconColor: '#FFB300' },
  { key: 'beauty', label: 'Beauty', icon: 'color-wand-outline', bg: '#FCE4EC', iconColor: '#EC407A' },
  { key: 'pest', label: 'Pest', icon: 'bug-outline', bg: '#F1F8E9', iconColor: '#9CCC65' },
  { key: 'carwash', label: 'Car Wash', icon: 'car-sport-outline', bg: '#E1F5FE', iconColor: '#29B6F6' },
];

interface ProDetails {
  id: string;
  name: string;
  role: string;
  rating: number;
  price: number;
  avatarColor: string;
  initial: string;
}

const TOP_RATED: ProDetails[] = [
  { id: '1', name: 'Mohammed A.', role: 'AC Specialist', rating: 4.9, price: 15, avatarColor: '#AB47BC', initial: 'M' },
  { id: '2', name: 'Salim Al-Habsi', role: 'Plumber', rating: 4.8, price: 8, avatarColor: '#5C6BC0', initial: 'S' },
];

export default function HomeScreen() {
  const [query, setQuery] = useState('');

  const handleAIChatPress = () => {
    router.push('../chat/ai-chat');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Top delivery bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.deliveryWrap} activeOpacity={0.7}>
            <Ionicons name="location-outline" size={16} color={THEME.primary} />
            <View>
              <Text style={styles.deliverTo}>Deliver to</Text>
              <View style={styles.deliveryRow}>
                <Text style={styles.deliveryArea}>{DELIVERY_AREA}</Text>
                <Ionicons name="chevron-down" size={14} color={Colors.text} />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={Colors.text} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View style={styles.greetingWrap}>
          <Text style={styles.greeting}>Good morning, {USER_NAME} 👋</Text>
          <Text style={styles.greetingSub}>What service do you need today?</Text>
        </View>

        {/* Search bar with AI */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search any service..."
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
            onSubmitEditing={() => router.push('/(tabs)/explore')}
          />
          <TouchableOpacity style={styles.aiBtn} onPress={handleAIChatPress}>
            <LinearGradient
              colors={['#FF4081', '#7C4DFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiBtnGradient}
            >
              <Ionicons name="sparkles" size={13} color="#FFF" />
              <Text style={styles.aiBtnText}>AI</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Summer offer banner */}
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/category/it_software')}>
          <LinearGradient
            colors={['#AB47BC', '#7C4DFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.offerCard}
          >
            <View style={styles.offerBadge}>
              <Text style={styles.offerBadgeEmoji}>🏷️</Text>
              <Text style={styles.offerBadgeText}>SUMMER OFFER</Text>
            </View>
            <Text style={styles.offerTitle}>AC Service — 20% Off</Text>
            <View style={styles.offerPriceRow}>
              <Text style={styles.offerFrom}>From</Text>
              <Text style={styles.offerOldPrice}>OMR 20</Text>
              <Text style={styles.offerNewPrice}>OMR 15</Text>
            </View>
            <TouchableOpacity style={styles.bookNowBtn}>
              <Text style={styles.bookNowText}>Book Now</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>

        {/* Our Services grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Services</Text>
            <TouchableOpacity onPress={() => router.push('/categories')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.servicesGrid}>
            {SERVICES.map((service) => (
              <TouchableOpacity
                key={service.key}
                style={styles.serviceItem}
                onPress={() => router.push(`/category/${service.key}`)}
              >
                <View style={[styles.serviceCircle, { backgroundColor: service.bg }]}>
                  <Ionicons name={service.icon} size={22} color={service.iconColor} />
                </View>
                <Text style={styles.serviceLabel} numberOfLines={1}>
                  {service.label}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.serviceItem} onPress={() => router.push('/categories')}>
              <LinearGradient
                colors={['#FF4081', '#7C4DFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.serviceCircle}
              >
                <Text style={styles.moreText}>+12</Text>
              </LinearGradient>
              <Text style={styles.serviceLabel} numberOfLines={1}>
                More
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Pick for You */}
        <TouchableOpacity
          style={styles.aiPickCard}
          activeOpacity={0.9}
          onPress={() => router.push('/category/ac')}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.aiPickHeader}>
              <Ionicons name="sparkles" size={14} color={THEME.primary} />
              <Text style={styles.aiPickTitle}>AI Pick for You</Text>
            </View>
            <Text style={styles.aiPickDesc}>
              AC service recommended before July heat — your Qurum villa needs it.
            </Text>
          </View>
          <Text style={styles.aiPickCta}>Book →</Text>
        </TouchableOpacity>

        {/* Top Rated Near You */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Rated Near You</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.proRow}>
            {TOP_RATED.map((pro) => (
              <TouchableOpacity
                key={pro.id}
                style={styles.proCard}
                onPress={() => router.push(`/business/${pro.id}`)}
              >
                <View style={[styles.proAvatar, { backgroundColor: pro.avatarColor }]}>
                  <Text style={styles.proAvatarText}>{pro.initial}</Text>
                </View>
                <Text style={styles.proName} numberOfLines={1}>
                  {pro.name}
                </Text>
                <Text style={styles.proRole} numberOfLines={1}>
                  {pro.role}
                </Text>
                <View style={styles.proFooterRow}>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#FFB300" />
                    <Text style={styles.ratingText}>{pro.rating}</Text>
                  </View>
                  <Text style={styles.proPrice}>OMR {pro.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <FloatingAIButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  deliveryWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deliverTo: { fontSize: 11, fontWeight: '500', color: '#9E9E9E' },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  deliveryArea: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  notifBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF1744',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  greetingWrap: { paddingHorizontal: 20, marginTop: 8, marginBottom: 16 },
  greeting: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  greetingSub: { fontSize: 13, fontWeight: '500', color: '#9E9E9E', marginTop: 2 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '500', color: '#1A1A1A', paddingVertical: 12 },
  aiBtn: { marginLeft: 8 },
  aiBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  aiBtnText: { fontSize: 12, fontWeight: '800', color: '#FFF' },
  offerCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 22,
    padding: 20,
    overflow: 'hidden',
  },
  offerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 10,
  },
  offerBadgeEmoji: { fontSize: 11 },
  offerBadgeText: { fontSize: 10.5, fontWeight: '800', color: '#FFF', letterSpacing: 0.4 },
  offerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 10 },
  offerPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 16 },
  offerFrom: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  offerOldPrice: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    textDecorationLine: 'line-through',
  },
  offerNewPrice: { fontSize: 17, color: '#FFF', fontWeight: '800' },
  bookNowBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  bookNowText: { fontSize: 13, fontWeight: '800', color: '#8E24AA' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.2 },
  seeAll: { fontSize: 12.5, fontWeight: '700', color: '#E91E8C' },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: { width: '23%', alignItems: 'center', marginBottom: 18 },
  serviceCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  serviceLabel: { fontSize: 10.5, fontWeight: '600', color: '#444', textAlign: 'center' },
  moreText: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  aiPickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FBEAFB',
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  aiPickHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  aiPickTitle: { fontSize: 13.5, fontWeight: '800', color: '#8E24AA' },
  aiPickDesc: { fontSize: 12, fontWeight: '500', color: '#555', lineHeight: 17 },
  aiPickCta: { fontSize: 13, fontWeight: '800', color: '#8E24AA' },
  proRow: { flexDirection: 'row', gap: 12 },
  proCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  proAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  proAvatarText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  proName: { fontSize: 13.5, fontWeight: '700', color: '#1A1A1A' },
  proRole: { fontSize: 11.5, fontWeight: '500', color: '#9E9E9E', marginTop: 1, marginBottom: 10 },
  proFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#1A1A1A' },
  proPrice: { fontSize: 12.5, fontWeight: '800', color: '#E91E8C' },
  // Floating AI Button Styles
  floatingAIBtn: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    zIndex: 999,
    elevation: 10,
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  floatingAIGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  floatingAIBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF4081',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  floatingAIBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFF',
  },
});