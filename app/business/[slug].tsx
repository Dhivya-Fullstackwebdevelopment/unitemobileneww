import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

interface MatchStat {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  percent: number;
}

const MATCH_STATS: MatchStat[] = [
  { key: 'distance', label: 'Distance', icon: 'location', iconColor: '#EC407A', percent: 96 },
  { key: 'rating', label: 'Rating', icon: 'star', iconColor: '#FFB300', percent: 95 },
  { key: 'available', label: 'Available', icon: 'time', iconColor: '#26C6DA', percent: 89 },
  { key: 'experience', label: 'Experience', icon: 'briefcase', iconColor: '#8D6E63', percent: 97 },
];

interface QuickStat {
  key: string;
  value: string;
  label: string;
  valueColor: string;
}

const QUICK_STATS: QuickStat[] = [
  { key: 'jobs', value: '847', label: 'Jobs Done', valueColor: '#1A1A1A' },
  { key: 'rating', value: '4.9★', label: 'Rating', valueColor: '#FFA000' },
  { key: 'member', value: '3yr', label: 'Member', valueColor: '#2E7D32' },
];

interface Review {
  id: string;
  author: string;
  timeAgo: string;
  stars: number;
  text: string;
}

const PROFESSIONAL = {
  name: 'Mohammed Al-Balushi',
  role: 'AC & Appliance Specialist',
  initial: 'M',
  avatarColor: '#8E24AA',
  verified: true,
  rating: 4.9,
  reviewsCount: 847,
  matchScore: 94,
  matchNote: 'Perfect for your Qurum villa · 2.3km away',
  price: 15,
};

const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Ahmed K.',
    timeAgo: '2 days ago',
    stars: 5,
    text: 'Mohammed was punctual, professional and thorough. AC works like new. Highly recommended!',
  },
  {
    id: 'r2',
    author: 'Sara M.',
    timeAgo: '5 days ago',
    stars: 5,
    text: 'Excellent service! Very professional and clean work.',
  },
];

export default function ProfessionalProfileScreen() {
  const params = useLocalSearchParams<{ slug: string }>();

  // Rating state
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const RATING_TAGS = [
    'On time',
    'Professional',
    'Friendly',
    'Great value',
    'Thorough',
    'Expertise',
  ];

  const handleStarPress = (value: number) => {
    setRating(value);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      Alert.alert('Please rate', 'Select a star rating before submitting.');
      return;
    }
    if (reviewText.trim().length < 10) {
      Alert.alert('Review too short', 'Please write at least 10 characters.');
      return;
    }

    // Submit review logic here
    console.log({
      rating,
      reviewText,
      selectedTags,
      professional: PROFESSIONAL.name,
      timestamp: new Date().toISOString(),
    });

    setIsRatingSubmitted(true);
    Alert.alert('✅ Review Submitted!', 'You earned 50 points!');

    // Reset form after 2 seconds
    setTimeout(() => {
      setRating(0);
      setReviewText('');
      setSelectedTags([]);
      setIsRatingSubmitted(false);
    }, 2000);
  };

  // Function to navigate to rating page
  const handleAddRating = () => {
    router.push({
      pathname: '/professional/rating',
      params: {
        professionalName: PROFESSIONAL.name,
        professionalRole: PROFESSIONAL.role,
        reviewsCount: PROFESSIONAL.reviewsCount.toString(),
        professionalInitial: PROFESSIONAL.initial,
        avatarColor: PROFESSIONAL.avatarColor,
      }
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Professional Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Profile card */}
        <View style={styles.card}>
          {/* Profile Row */}
          <View style={styles.profileRow}>
            <View style={[styles.avatar, { backgroundColor: PROFESSIONAL.avatarColor }]}>
              <Text style={styles.avatarText}>{PROFESSIONAL.initial}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{PROFESSIONAL.name}</Text>
              <Text style={styles.role}>{PROFESSIONAL.role}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={13} color="#FFB300" />
                <Text style={styles.ratingText}>{PROFESSIONAL.rating}</Text>
                <Text style={styles.reviewsText}>({PROFESSIONAL.reviewsCount} reviews)</Text>
              </View>
            </View>

            {PROFESSIONAL.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={12} color="#2E7D32" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>

          {/* AI Match Score */}
          <View style={styles.matchCard}>
            <View style={styles.matchHeader}>
              <View style={styles.matchHeaderLeft}>
                <Ionicons name="sparkles" size={14} color="#8E24AA" />
                <Text style={styles.matchTitle}>AI Match Score for You</Text>
              </View>
              <Text style={styles.matchPercent}>{PROFESSIONAL.matchScore}%</Text>
            </View>

            {MATCH_STATS.map((stat) => (
              <View key={stat.key} style={styles.matchStatRow}>
                <View style={styles.matchStatLabelWrap}>
                  <Ionicons name={stat.icon} size={13} color={stat.iconColor} />
                  <Text style={styles.matchStatLabel}>{stat.label}</Text>
                </View>
                <View style={styles.matchBarTrack}>
                  <LinearGradient
                    colors={['#EC407A', '#7C4DFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.matchBarFill, { width: `${stat.percent}%` }]}
                  />
                </View>
                <Text style={styles.matchStatPercent}>{stat.percent}%</Text>
              </View>
            ))}

            <Text style={styles.matchNote}>{PROFESSIONAL.matchNote}</Text>
          </View>

          {/* Quick stats */}
          <View style={styles.quickStatsRow}>
            {QUICK_STATS.map((stat) => (
              <View key={stat.key} style={styles.quickStatCard}>
                <Text style={[styles.quickStatValue, { color: stat.valueColor }]}>{stat.value}</Text>
                <Text style={styles.quickStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* ⭐ ADD RATING BUTTON - NEW */}
          <TouchableOpacity
            style={styles.addRatingButton}
            onPress={handleAddRating}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#E91E8C', '#7C4DFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addRatingGradient}
            >
              <Ionicons name="star-outline" size={22} color="#FFF" />
              <Text style={styles.addRatingButtonText}>Add Rating</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Recent reviews */}
          <View style={styles.reviewsSection}>
            <Text style={styles.reviewsSectionTitle}>Recent Reviews</Text>
            {REVIEWS.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewStars}>
                    {Array.from({ length: review.stars }).map((_, i) => (
                      <Ionicons key={i} name="star" size={12} color="#FFB300" />
                    ))}
                  </View>
                  <Text style={styles.reviewAuthor}>{review.author}</Text>
                  <Text style={styles.reviewDot}>·</Text>
                  <Text style={styles.reviewTime}>{review.timeAgo}</Text>
                </View>
                <Text style={styles.reviewText}>&quot;{review.text}&quot;</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky book button */}
      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/bookings/schedule')}>
          <LinearGradient
            colors={['#E91E8C', '#7C4DFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bookBtn}
          >
            <Text style={styles.bookBtnText}>
              Book with {PROFESSIONAL.name.split(' ')[0]} — OMR {PROFESSIONAL.price}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF',
  },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  card: {
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  profileRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 20 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  name: { fontSize: 17, fontWeight: '800', color: '#1A1A1A', marginBottom: 2 },
  role: { fontSize: 12.5, fontWeight: '500', color: '#9E9E9E', marginBottom: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, fontWeight: '800', color: '#1A1A1A' },
  reviewsText: { fontSize: 12, fontWeight: '500', color: '#9E9E9E' },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },
  verifiedText: { fontSize: 11, fontWeight: '700', color: '#2E7D32' },
  matchCard: {
    backgroundColor: '#FBEAFB',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  matchHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  matchTitle: { fontSize: 13, fontWeight: '800', color: '#6A1B9A' },
  matchPercent: { fontSize: 20, fontWeight: '800', color: '#7C4DFF' },
  matchStatRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  matchStatLabelWrap: { flexDirection: 'row', alignItems: 'center', gap: 5, width: 78 },
  matchStatLabel: { fontSize: 11.5, fontWeight: '600', color: '#555' },
  matchBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(124,77,255,0.15)',
    overflow: 'hidden',
  },
  matchBarFill: { height: '100%', borderRadius: 3 },
  matchStatPercent: { fontSize: 11.5, fontWeight: '700', color: '#1A1A1A', width: 32, textAlign: 'right' },
  matchNote: { fontSize: 11.5, fontWeight: '500', color: '#8E24AA', marginTop: 4 },
  quickStatsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  quickStatCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F7F7F9',
    borderRadius: 14,
    paddingVertical: 14,
  },
  quickStatValue: { fontSize: 17, fontWeight: '800', marginBottom: 2 },
  quickStatLabel: { fontSize: 10.5, fontWeight: '600', color: '#9E9E9E' },

  // ⭐ ADD RATING BUTTON STYLES
  addRatingButton: {
    marginBottom: 20,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addRatingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  addRatingButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },

  // ⭐ Rating Section Styles
  ratingSection: {
    marginTop: 8,
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  ratingHeader: {
    marginBottom: 16,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  ratingSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9E9E9E',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  starIcon: {
    marginHorizontal: 2,
  },
  ratingLabel: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tagChipSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
  },
  tagTextSelected: {
    color: '#2E7D32',
  },
  textInputContainer: {
    marginBottom: 12,
    position: 'relative',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 30,
    fontSize: 14,
    fontWeight: '400',
    color: '#1A1A1A',
    minHeight: 100,
    backgroundColor: '#FAFAFA',
  },
  charCount: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    fontSize: 11,
    fontWeight: '500',
    color: '#B0B0B0',
  },
  aiTipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FBEAFB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  aiTipText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#8E24AA',
    lineHeight: 16,
  },
  submitBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 14,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
  },

  // Existing reviews styles
  reviewsSection: {},
  reviewsSectionTitle: { fontSize: 14.5, fontWeight: '800', color: '#1A1A1A', marginBottom: 10 },
  reviewItem: { marginBottom: 12 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  reviewStars: { flexDirection: 'row', gap: 1 },
  reviewAuthor: { fontSize: 12, fontWeight: '600', color: '#777' },
  reviewDot: { fontSize: 12, color: '#CCC' },
  reviewTime: { fontSize: 12, fontWeight: '500', color: '#9E9E9E' },
  reviewText: { fontSize: 12.5, fontWeight: '500', color: '#444', lineHeight: 18 },

  // Footer styles
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  bookBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookBtnText: { fontSize: 15, fontWeight: '800', color: '#FFF' },
});