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
    reviewsCount: string;
    professionalInitial: string;
    avatarColor: string;
  }>();

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);

  const RATING_TAGS = [
    'On time',
    'Professional',
    'Friendly',
    'Great value',
    'Thorough',
    'Expertise',
  ];

  const professionalName = params.professionalName || 'Mohammed Al-Balushi';
  const professionalRole = params.professionalRole || 'AC Deep Cleaning';
  const reviewsCount = params.reviewsCount || '847';
  const professionalInitial = params.professionalInitial || 'M';
  const avatarColor = params.avatarColor || '#8E24AA';

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
      professional: professionalName,
      timestamp: new Date().toISOString(),
    });

    setIsRatingSubmitted(true);
    Alert.alert('✅ Review Submitted!', 'You earned 50 points!');

    // Navigate back after 2 seconds
    setTimeout(() => {
      router.back();
    }, 2000);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Rate Your Service</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Professional Info Card */}
        <View style={styles.professionalCard}>
          <View style={styles.professionalInfo}>
            <View style={[styles.avatarContainer, { backgroundColor: avatarColor }]}>
              <Text style={styles.avatarText}>{professionalInitial}</Text>
            </View>
            <View style={styles.professionalDetails}>
              <Text style={styles.professionalName}>{professionalName}</Text>
              <Text style={styles.professionalRole}>{professionalRole}</Text>
              <Text style={styles.professionalDate}>Sat 28 Jun</Text>
            </View>
          </View>
        </View>

        {/* Rating Section */}
        <View style={styles.ratingSection}>
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
                  size={48}
                  color={star <= rating ? '#FFB300' : '#D3D3D3'}
                />
              </TouchableOpacity>
            ))}
          </View>

          {rating > 0 && (
            <Text style={styles.ratingLabel}>
              {rating === 5 ? 'Excellent! ⭐⭐⭐⭐⭐' :
               rating === 4 ? 'Very Good! ⭐⭐⭐⭐' :
               rating === 3 ? 'Good ⭐⭐⭐' :
               rating === 2 ? 'Fair ⭐⭐' :
               'Poor ⭐'}
            </Text>
          )}

          {/* Tags */}
          <View style={styles.tagsContainer}>
            <Text style={styles.tagsLabel}>What stood out?</Text>
            <View style={styles.tagsRow}>
              {RATING_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagChip,
                    selectedTags.includes(tag) && styles.tagChipSelected,
                  ]}
                  onPress={() => handleTagToggle(tag)}
                >
                  <View style={styles.tagContent}>
                    <Text
                      style={[
                        styles.tagText,
                        selectedTags.includes(tag) && styles.tagTextSelected,
                      ]}
                    >
                      {tag}
                    </Text>
                    {selectedTags.includes(tag) && (
                      <Ionicons name="checkmark" size={15} color="#E91E8C" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Review Text Input */}
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Write your review..."
              placeholderTextColor="#B0B0B0"
              multiline
              numberOfLines={4}
              value={reviewText}
              onChangeText={setReviewText}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {reviewText.length}/500
            </Text>
          </View>

          {/* AI Tip */}
          <View style={styles.aiTipContainer}>
            <Ionicons name="sparkles" size={16} color="#E91E8C" />
            <Text style={styles.aiTipText}>
              <Text style={styles.aiTipBold}>AI tip: </Text>
              Your review will help {reviewsCount} customers find the right pro.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              (rating === 0 || reviewText.trim().length < 10) && styles.submitBtnDisabled,
            ]}
            onPress={handleSubmitReview}
            disabled={rating === 0 || reviewText.trim().length < 10 || isRatingSubmitted}
          >
            <LinearGradient
              colors={
                rating > 0 && reviewText.trim().length >= 10
                  ? ['#E91E8C', '#7C4DFF']
                  : ['#D3D3D3', '#D3D3D3']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitGradient}
            >
              <Text style={styles.submitBtnText}>
                {isRatingSubmitted ? '✅ Submitted!' : 'Submit Review & Earn 50 pts'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconBtn: { 
    width: 40, 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginRight: 8,
  },
  topBarTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1A1A1A' 
  },
  professionalCard: {
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  professionalInfo: {
    alignItems: 'center',
    gap: 8,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
  },
  professionalDetails: {
    alignItems: 'center',
  },
  professionalName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  professionalRole: {
    fontSize: 13,
    fontWeight: '500',
    color: '#757575',
  },
  professionalDate: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9E9E9E',
  },
  ratingSection: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  ratingQuestion: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingLabel: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: '#FFB300',
    marginBottom: 20,
    marginTop: 4,
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9E9E9E',
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tagChipSelected: {
    backgroundColor: '#FDF1FA',
    borderColor: '#E91E8C',
  },
  tagContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#757575',
  },
  tagTextSelected: {
    color: '#E91E8C',
    fontWeight: '600',
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
    backgroundColor: '#FDF1FA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F6D9EF',
  },
  aiTipText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#8E24AA',
    lineHeight: 16,
  },
  aiTipBold: {
    fontWeight: '700',
    color: '#E91E8C',
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
    fontWeight: '700',
    color: '#FFF',
  },
});