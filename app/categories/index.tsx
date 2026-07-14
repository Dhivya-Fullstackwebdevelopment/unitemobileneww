import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface StaticCategory {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  bg: string;
  iconColor: string;
}

const ALL_SERVICES: StaticCategory[] = [
  { id: '1', label: 'AC Service', icon: 'snow-outline', bg: '#E3F2FD', iconColor: '#42A5F5' },
  { id: '2', label: 'Cleaning', icon: 'brush-outline', bg: '#E8F5E9', iconColor: '#4CAF50' },
  { id: '3', label: 'Plumbing', icon: 'build-outline', bg: '#E0F7FA', iconColor: '#00BCD4' },
  { id: '4', label: 'Electrical', icon: 'flash-outline', bg: '#FFF8E1', iconColor: '#FF9800' },
  { id: '5', label: 'Beauty', icon: 'color-wand-outline', bg: '#FCE4EC', iconColor: '#E91E63' },
  { id: '6', label: 'Carpentry', icon: 'hammer-outline', bg: '#EFEBE9', iconColor: '#8D6E63' },
  { id: '7', label: 'Pest Control', icon: 'bug-outline', bg: '#F1F8E9', iconColor: '#7CB342' },
  { id: '8', label: 'Painting', icon: 'color-palette-outline', bg: '#F3E5F5', iconColor: '#9C27B0' },
  { id: '9', label: 'Car Detail', icon: 'car-sport-outline', bg: '#E1F5FE', iconColor: '#29B6F6' },
  { id: '10', label: 'Pool Service', icon: 'water-outline', bg: '#E0F2F1', iconColor: '#009688' },
  { id: '11', label: 'Appliance', icon: 'tv-outline', bg: '#ECEFF1', iconColor: '#607D8B' },
  { id: '12', label: 'Landscaping', icon: 'leaf-outline', bg: '#E8F5E9', iconColor: '#4CAF50' },
  { id: '13', label: 'Moving', icon: 'cube-outline', bg: '#FFF3E0', iconColor: '#FF9800' },
  { id: '14', label: 'Water Tank', icon: 'water-outline', bg: '#E1F5FE', iconColor: '#03A9F4' },
  { id: '15', label: 'CCTV', icon: 'videocam-outline', bg: '#F3E5F5', iconColor: '#9C27B0' },
  { id: '16', label: 'Glazing', icon: 'grid-outline', bg: '#E8EAF6', iconColor: '#3F51B5' },
  { id: '17', label: 'Fitness', icon: 'walk-outline', bg: '#E8F5E9', iconColor: '#4CAF50' },
  { id: '18', label: 'Babysitting', icon: 'happy-outline', bg: '#FFF3E0', iconColor: '#FF9800' },
  { id: '19', label: 'Pet Care', icon: 'paw-outline', bg: '#FFF8E1', iconColor: '#FFC107' },
  { id: '20', label: 'Laundry', icon: 'shirt-outline', bg: '#E3F2FD', iconColor: '#2196F3' },
  { id: '21', label: 'Renovation', icon: 'construct-outline', bg: '#EFEBE9', iconColor: '#795548' },
];

export default function CategoriesScreen() {
  const [search, setSearch] = useState('');

  const filteredServices = ALL_SERVICES.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* ── Top Header and Search Row ── */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.6}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Services</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={16} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#8E8E93"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* ── 3 Column Dynamic Service Grid ── */}
      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => router.push(`/category/${item.id}`)}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
              <Ionicons name={item.icon} size={26} color={item.iconColor} />
            </View>
            <Text style={styles.cardLabel} numberOfLines={1}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
    marginLeft: -4, 
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -0.5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F1F4',
    borderRadius: 10,
    paddingHorizontal: 10,
    width: '45%',
    height: 36,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingVertical: 0,
  },
  gridContainer: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 40,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFF',
    width: '31.5%',
    aspectRatio: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
});