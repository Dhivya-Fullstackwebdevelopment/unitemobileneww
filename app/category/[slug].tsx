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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ServiceListItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  priceSuffix?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  isHot?: boolean;
}

const STATIC_SERVICES: ServiceListItem[] = [
  {
    id: '1',
    title: 'AC Deep Cleaning',
    subtitle: 'Filter + coil wash + disinfect · ⏱ 45 min',
    price: 15,
    icon: 'snow-outline',
    iconBg: '#E3F2FD',
    iconColor: '#42A5F5',
    isHot: true,
  },
  {
    id: '2',
    title: 'AC Repair',
    subtitle: 'Gas refill, PCB, compressor · ⏱ 60 min',
    price: 25,
    icon: 'build-outline',
    iconBg: '#EDE7F6',
    iconColor: '#7E57C2',
  },
  {
    id: '3',
    title: 'AC Installation',
    subtitle: 'New unit + pipe + testing · ⏱ 2 hrs',
    price: 35,
    icon: 'construct-outline',
    iconBg: '#E1F5FE',
    iconColor: '#29B6F6',
  },
  {
    id: '4',
    title: 'AC Gas Refill',
    subtitle: 'Refrigerant + leak check · ⏱ 30 min',
    price: 20,
    icon: 'color-fill-outline',
    iconBg: '#E0F2F1',
    iconColor: '#26A69A',
  },
  {
    id: '5',
    title: 'Annual Contract',
    subtitle: '2 services/yr + priority · ⏱ 2x/yr',
    price: 89,
    priceSuffix: '/yr',
    icon: 'home-outline',
    iconBg: '#E8F5E9',
    iconColor: '#66BB6A',
  },
  {
    id: '6',
    title: 'Duct Cleaning',
    subtitle: 'Central AC duct sanitization · ⏱ 90 min',
    price: 45,
    icon: 'leaf-outline',
    iconBg: '#E8EAF6',
    iconColor: '#5C6BC0',
  },
];

export default function CategoryScreen() {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#070B35" />

      {/* ── Deep Indigo Top Hero Canvas ── */}
      <View style={styles.heroCanvas}>
        <SafeAreaView edges={['top']}>
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.backCircle} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.centerHeroContent}>
            <View style={styles.heroAppIcon}>
              <Ionicons name="snow" size={32} color="#42A5F5" />
            </View>
            <Text style={styles.heroTitle}>AC Service</Text>
            <Text style={styles.heroMetaText}>★ 4.9 · 312 pros · From OMR 15</Text>
          </View>
        </SafeAreaView>
      </View>

      {/* ── Service Listing Fills ── */}
      <ScrollView 
        style={styles.bodyScroll} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {STATIC_SERVICES.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            
            {/* Left Decorative/Icon Element */}
            <View style={[styles.serviceIconWrap, { backgroundColor: service.iconBg }]}>
              <Ionicons name={service.icon} size={24} color={service.iconColor} />
            </View>

            {/* Middle Descriptions */}
            <View style={styles.middleInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                {service.isHot && (
                  <View style={styles.hotBadge}>
                    <Text style={styles.hotBadgeText}>HOT</Text>
                  </View>
                )}
              </View>
              <Text style={styles.serviceSubtitle} numberOfLines={2}>
                {service.subtitle}
              </Text>
            </View>

            {/* Right Booking Stack */}
            <View style={styles.rightActionStack}>
              <Text style={styles.priceText}>
                OMR {service.price}
                {service.priceSuffix && <Text style={styles.priceSuffixText}>{service.priceSuffix}</Text>}
              </Text>
              
              {/* Pressing Book now routes to Professional Profile Page */}
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => router.push(`/business/${service.id}`)}
              >
                <LinearGradient
                  colors={['#AA00FF', '#7B1FA2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.bookGradientBtn}
                >
                  <Text style={styles.bookBtnText}>Book</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F4F5F9',
  },
  heroCanvas: {
    backgroundColor: '#070B35',
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  backCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerHeroContent: {
    alignItems: 'center',
    marginTop: 4,
  },
  heroAppIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  heroMetaText: {
    fontSize: 13,
    color: '#A4A9C6',
    fontWeight: '600',
    marginTop: 4,
  },
  bodyScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 40,
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  serviceIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleInfo: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  hotBadge: {
    backgroundColor: '#FCE4EC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  hotBadgeText: {
    color: '#E91E63',
    fontSize: 9,
    fontWeight: '800',
  },
  serviceSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
  },
  rightActionStack: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    minWidth: 75,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
  },
  priceSuffixText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
  },
  bookGradientBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});