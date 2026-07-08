import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Provider {
  id: string;
  name: string;
  rating: number;
  price: number;
  avatarColor?: string;
  initial?: string;
}

interface AIProviderCardProps {
  provider: Provider;
  onPress?: () => void;
}

export default function AIProviderCard({ provider, onPress }: AIProviderCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/business/${provider.id}`);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={[styles.avatar, { backgroundColor: provider.avatarColor || '#7C4DFF' }]}>
        <Text style={styles.avatarText}>{provider.initial || provider.name[0]}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{provider.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFB300" />
          <Text style={styles.rating}>{provider.rating}</Text>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>OMR {provider.price}</Text>
        <Text style={styles.perHour}>/hr</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  info: { flex: 1 },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E91E8C',
  },
  perHour: {
    fontSize: 10,
    color: '#9E9E9E',
    marginLeft: 2,
  },
});