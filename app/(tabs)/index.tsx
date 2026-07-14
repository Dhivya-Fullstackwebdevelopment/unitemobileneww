import { useState } from 'react';
import {
  Pressable,
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
import FloatingAIButton from '@/components/FloatingAIButton';

const USER_NAME = 'Ahmed';

interface ServiceItem {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  bg: string;
  iconColor: string;
}

const SERVICES: ServiceItem[] = [
  { key: 'ac', label: 'AC', icon: 'snow-outline', bg: '#E3F2FD', iconColor: '#42A5F5' },
  { key: 'cleaning', label: 'Cleaning', icon: 'sparkles-outline', bg: '#E8F5E9', iconColor: '#66BB6A' },
  { key: 'plumbing', label: 'Plumbing', icon: 'water-outline', bg: '#E0F7FA', iconColor: '#26C6DA' },
  { key: 'electrical', label: 'Electrical', icon: 'flash-outline', bg: '#FFF8E1', iconColor: '#FFB300' },
  { key: 'beauty', label: 'Beauty', icon: 'color-wand-outline', bg: '#FCE4EC', iconColor: '#EC407A' },
  { key: 'carpentry', label: 'Carpentry', icon: 'hammer-outline', bg: '#F5F5F5', iconColor: '#8D6E63' },
  { key: 'pest', label: 'Pest', icon: 'bug-outline', bg: '#F3E5F5', iconColor: '#AB47BC' },
  { key: 'painting', label: 'Painting', icon: 'color-palette-outline', bg: '#FCE4EC', iconColor: '#EF5350' },
];

interface ProDetails {
  id: string;
  name: string;
  category: string;
  distanceKm: number;
  rating: number;
  avatarColor: string;
  initial: string;
}

const AI_TOP_PICKS: ProDetails[] = [
  { id: '1', name: 'Mohammed A.', category: 'AC', distanceKm: 0.8, rating: 4.9, avatarColor: '#7C4DFF', initial: 'M' },
  { id: '2', name: 'Fatima Z.', category: 'Beauty', distanceKm: 1.1, rating: 5.0, avatarColor: '#FF4081', initial: 'F' },
];

export default function HomeScreen() {
  const [query, setQuery] = useState('');

  const handleAIChatPress = () => {
    router.push('../chat/ai-chat');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Dark gradient header */}
      <LinearGradient
        colors={['#160B2E', '#2A1152', '#3A1470']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.topBar}>
            <View>
              <Text style={styles.greeting}>Good morning,</Text>
              <View style={styles.greetingRow}>
                <Text style={styles.greetingName}>{USER_NAME}</Text>
                <Text style={styles.wave}>👋</Text>
              </View>
            </View>

            <View style={styles.topBarIcons}>
              <TouchableOpacity style={styles.notifBtn}>
                <Ionicons name="notifications" size={18} color="#FFB300" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileBtn}>
                <Ionicons name="person" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search bar with AI */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#B0A8C4" style={{ marginRight: 8 }} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="What do you need?"
              placeholderTextColor="#B0A8C4"
              style={styles.searchInput}
              onSubmitEditing={() => router.push('/(tabs)/explore')}
            />
            <TouchableOpacity style={styles.aiBtn} onPress={handleAIChatPress}>
              <LinearGradient
                colors={['#fd59c9', '#7C4DFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.aiBtnGradient}
              >
                <Ionicons name="flash" size={12} color="#FFF" />
                <Text style={styles.aiBtnText}>AI</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={{ backgroundColor: Colors.background }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* Summer AC Deal banner using requested colors */}
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/category/ac')}>
          <LinearGradient
            colors={['#fd59c9', '#7C4DFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.offerCard}
          >
            <View style={styles.offerIconWrap}>
              <Text style={styles.offerIconEmoji}>☀️</Text>
            </View>

          
              <View style={{ flex: 1 }}>
                <Text style={styles.offerTitle}>Summer AC Deal</Text>
                <Text style={styles.offerSubtitle}>20% off AC Cleaning · Ends Jul 31</Text>
              </View>


          <Pressable onPress={() => router.push('/bookings/explore')}>
            <View style={styles.bookNowBtn}>
              <Text style={styles.bookNowText}>Book</Text>
              <Ionicons name="arrow-forward" size={13} color="#8E24AA" />
            </View>
          </Pressable >
          </LinearGradient>
        </TouchableOpacity>

        {/* Services grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>

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
              <View style={[styles.serviceCircle, { backgroundColor: '#EEEEEE' }]}>
                <Text style={styles.moreText}>+12</Text>
              </View>
              <Text style={styles.serviceLabel} numberOfLines={1}>
                More
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Top Picks */}
        <View style={styles.section}>
          <View style={styles.aiPicksHeader}>
            <Ionicons name="sparkles" size={16} color="#FFB300" />
            <Text style={styles.sectionTitle}>AI Top Picks</Text>
          </View>

          {AI_TOP_PICKS.map((pro) => (
            <TouchableOpacity
              key={pro.id}
              style={styles.proCard}
              onPress={() => router.push(`/business/${pro.id}`)}
            >
              <View style={[styles.proAvatar, { backgroundColor: pro.avatarColor }]}>
                <Text style={styles.proAvatarText}>{pro.initial}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.proName} numberOfLines={1}>
                  {pro.name}
                </Text>
                <Text style={styles.proMeta} numberOfLines={1}>
                  {pro.category} · {pro.distanceKm}km
                </Text>
              </View>

              <View style={styles.proRight}>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color="#FFB300" />
                  <Text style={styles.ratingText}>{pro.rating.toFixed(1)}</Text>
                </View>

                {/* Book button styled with LinearGradient background */}
                <TouchableOpacity activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#fd59c9', '#7C4DFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.proBookGradient}
                  >
                    <Text style={styles.proBookText}>Book</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <FloatingAIButton />
    </View >
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  headerGradient: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: 22,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 18,
  },
  greeting: { fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.6)' },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  greetingName: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  wave: { fontSize: 20 },
  topBarIcons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '500', color: '#FFF', paddingVertical: 12 },
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
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 24,
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  offerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerIconEmoji: { fontSize: 20 },
  offerTitle: { fontSize: 15.5, fontWeight: '800', color: '#FFF', marginBottom: 2 },
  offerSubtitle: { fontSize: 11.5, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  bookNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  bookNowText: { fontSize: 12.5, fontWeight: '800', color: '#8E24AA' },
  section: { paddingHorizontal: 20, marginBottom: 22 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.2 },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 14,
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
  moreText: { fontSize: 12.5, fontWeight: '800', color: '#777' },
  aiPicksHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  proCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  proAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proAvatarText: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  proName: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  proMeta: { fontSize: 12, fontWeight: '500', color: '#9E9E9E', marginTop: 2 },
  proRight: { alignItems: 'flex-end', gap: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 12.5, fontWeight: '700', color: '#1A1A1A' },
  proBookGradient: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proBookText: { fontSize: 11.5, fontWeight: '800', color: '#FFF' },
});