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

export default function RatingScreen() {
  const params = useLocalSearchParams<{
    professionalName: string;
    professionalRole: string;
    location: string;
    professionalInitial: string;
    avatarColor: string;
  }>();

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Punctual', 'Professional', 'Thorough']);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);

  const RATING_TAGS = ['Punctual', 'Professional', 'Thorough', 'Friendly', 'Fixed first time', 'Clean workspace'];

  const RATING_LABELS: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent!',
  };

  const professionalName = params.professionalName || 'Mohammed';
  const professionalRole = params.professionalRole || 'AC Deep Cleaning';
  const location = params.location || 'Qurum';
  const professionalInitial = params.professionalInitial || 'M';
  const avatarColor = params.avatarColor || '#9C27B0';

  const handleStarPress = (value: number) => setRating(value);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      Alert.alert('Please rate', 'Select a star rating before submitting.');
      return;
    }

    console.log({
      rating,
      reviewText,
      selectedTags,
      professional: professionalName,
      timestamp: new Date().toISOString(),
    });

    setIsRatingSubmitted(true);
    Alert.alert('✅ Review Submitted!', 'Thanks for your feedback!');

    setTimeout(() => {
      router.back();
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={[styles.avatarContainer, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{professionalInitial}</Text>
          </View>
        </View>

        {/* Title + Subtitle */}
        <Text style={styles.title}>Rate {professionalName}</Text>
        <Text style={styles.subtitle}>
          {professionalRole} · Today · {location}
        </Text>

        {/* Rating Question */}
        <Text style={styles.ratingQuestion}>How was the service?</Text>

        {/* Star Rating */}
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => handleStarPress(star)}
              activeOpacity={0.7}
              style={styles.starButton}
            >
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={34}
                color={star <= rating ? '#1A1A1A' : '#D3D3D3'}
              />
            </TouchableOpacity>
          ))}
        </View>

        {rating > 0 && <Text style={styles.ratingLabel}>{RATING_LABELS[rating]}</Text>}

        {/* Tags */}
        <View style={styles.tagsContainer}>
          <Text style={styles.sectionLabel}>WHAT WENT WELL?</Text>
          <View style={styles.tagsRow}>
            {RATING_TAGS.map((tag) => {
              const selected = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagChip, selected && styles.tagChipSelected]}
                  onPress={() => handleTagToggle(tag)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tagText, selected && styles.tagTextSelected]}>{tag}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Comment */}
        <View style={styles.commentContainer}>
          <Text style={styles.sectionLabel}>COMMENT</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Mohammed arrived on time and did a great job..."
            placeholderTextColor="#B0B0B0"
            multiline
            numberOfLines={4}
            value={reviewText}
            onChangeText={setReviewText}
            maxLength={500}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]}
          onPress={handleSubmitReview}
          disabled={rating === 0 || isRatingSubmitted}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={rating > 0 ? ['#E91E8C', '#7C3AED'] : ['#D3D3D3', '#D3D3D3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitGradient}
          >
            <Text style={styles.submitBtnText}>
              {isRatingSubmitted ? '✅ Submitted!' : 'Submit Review'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  avatarWrap: { alignItems: 'center', marginTop: 28, marginBottom: 16 },
  avatarContainer: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 28, fontWeight: '800', color: '#FFF' },
  title: { fontSize: 21, fontWeight: '800', color: '#111114', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 13, fontWeight: '500', color: '#9E9EA8', textAlign: 'center', marginBottom: 22 },
  ratingQuestion: { fontSize: 14, fontWeight: '600', color: '#9E9EA8', textAlign: 'center', marginBottom: 14 },
  starsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 8 },
  starButton: { padding: 2 },
  ratingLabel: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    color: '#F59E0B',
    marginBottom: 22,
    marginTop: 6,
  },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#9E9EA8',
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  tagsContainer: { paddingHorizontal: 20, marginBottom: 20 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E4E4EA',
  },
  tagChipSelected: {
    backgroundColor: '#FDE4F2',
    borderColor: '#FDE4F2',
  },
  tagText: { fontSize: 13, fontWeight: '600', color: '#6B6B76' },
  tagTextSelected: { color: '#E91E8C', fontWeight: '700' },
  commentContainer: { paddingHorizontal: 20, marginBottom: 22 },
  textInput: {
    borderWidth: 1,
    borderColor: '#E4E4EA',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13.5,
    fontWeight: '400',
    color: '#1A1A1A',
    minHeight: 90,
    backgroundColor: '#FAFAFB',
  },
  submitBtn: { marginHorizontal: 20, borderRadius: 16, overflow: 'hidden' },
  submitBtnDisabled: { opacity: 0.6 },
  submitGradient: { paddingVertical: 16, alignItems: 'center', borderRadius: 16 },
  submitBtnText: { fontSize: 15.5, fontWeight: '800', color: '#FFF' },
  skipBtn: { alignItems: 'center', marginTop: 16 },
  skipText: { fontSize: 13.5, fontWeight: '600', color: '#9E9EA8' },
});