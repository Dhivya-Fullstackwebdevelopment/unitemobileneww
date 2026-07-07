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

const SUGGESTED_QUERIES = [
  'Clean my 3-bed villa in Qurum',
  'AC repair urgent, Muscat Hills',
  'Beauty at home this evening',
];

interface SmartResult {
  id: string;
  title: string;
  subtitle: string;
  rating: number;
  reviews: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
}

const MOCK_RESULT: SmartResult = {
  id: 'ac-deep-cleaning',
  title: 'AC Deep Cleaning',
  subtitle: '3 pros nearby · OMR 15–20',
  rating: 4.9,
  reviews: '2.3k',
  icon: 'snow-outline',
  iconBg: '#E3F2FD',
  iconColor: '#42A5F5',
};

export default function ExploreScreen() {
  const [query, setQuery] = useState('AC cleaning for my villa...');
  const [understood, setUnderstood] = useState(true);
  const [results, setResults] = useState<SmartResult[]>([MOCK_RESULT]);

  const runSearch = (text: string) => {
    setQuery(text);
    // TODO: replace with a real AI-parsed search call, e.g.
    // const parsed = await aiApi.parseQuery(text);
    // setResults(parsed.results);
    setUnderstood(text.trim().length > 0);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header: back + search + AI badge */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.text} />
          </TouchableOpacity>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={16} color={THEME.primary} style={{ marginRight: 8 }} />
            <TextInput
              value={query}
              onChangeText={runSearch}
              placeholder="Search any service..."
              placeholderTextColor={Colors.textMuted}
              style={styles.searchInput}
              autoFocus
            />
            <View style={styles.aiBadge}>
              <LinearGradient
                colors={['#FF4081', '#7C4DFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.aiBadgeGradient}
              >
                <Ionicons name="sparkles" size={12} color="#FFF" />
                <Text style={styles.aiBadgeText}>AI</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* AI understood card */}
        {understood && (
          <View style={styles.understoodCard}>
            <Text style={styles.understoodEmoji}>✨</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.understoodTitle}>AI understood your query</Text>
              <Text style={styles.understoodDesc}>
                AC Deep Cleaning · Qurum, Muscat · Available this week
              </Text>
            </View>
          </View>
        )}

        {/* Try Asking suggestions */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TRY ASKING</Text>
          {SUGGESTED_QUERIES.map((suggestion) => (
            <TouchableOpacity
              key={suggestion}
              style={styles.suggestionRow}
              onPress={() => runSearch(suggestion)}
            >
              <Ionicons name="search" size={16} color={Colors.textMuted} />
              <Text style={styles.suggestionText} numberOfLines={1}>
                &quot;{suggestion}&quot;
              </Text>
              <Ionicons name="arrow-forward" size={15} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Smart Results */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SMART RESULTS</Text>
          {results.map((result) => (
            <TouchableOpacity
              key={result.id}
              style={styles.resultCard}
              onPress={() => router.push(`/category/${result.id}`)}
            >
              <View style={[styles.resultIconWrap, { backgroundColor: result.iconBg }]}>
                <Ionicons name={result.icon} size={24} color={result.iconColor} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.resultTitle}>{result.title}</Text>
                <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
                <View style={styles.resultRatingRow}>
                  <Ionicons name="star" size={12} color="#FFB300" />
                  <Text style={styles.resultRating}>{result.rating}</Text>
                  <Text style={styles.resultReviews}>({result.reviews})</Text>
                </View>
              </View>

              <View style={styles.resultArrowWrap}>
                <LinearGradient
                  colors={['#AB47BC', '#7C4DFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.resultArrowGradient}
                >
                  <Ionicons name="arrow-forward" size={16} color="#FFF" />
                </LinearGradient>
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
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCE4EC',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  searchInput: { flex: 1, fontSize: 13.5, fontWeight: '600', color: '#8E24AA', paddingVertical: 12 },
  aiBadge: { marginLeft: 6 },
  aiBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
  },
  aiBadgeText: { fontSize: 11.5, fontWeight: '800', color: '#FFF' },
  understoodCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#FBEAFB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F3D9F5',
  },
  understoodEmoji: { fontSize: 16, marginTop: 1 },
  understoodTitle: { fontSize: 13.5, fontWeight: '800', color: '#8E24AA', marginBottom: 3 },
  understoodDesc: { fontSize: 12, fontWeight: '500', color: '#666', lineHeight: 17 },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9E9E9E',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F7F7F9',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ECECEF',
  },
  suggestionText: { flex: 1, fontSize: 13, fontWeight: '500', color: '#555' },
  resultCard: {
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
  resultIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitle: { fontSize: 14.5, fontWeight: '800', color: '#1A1A1A', marginBottom: 3 },
  resultSubtitle: { fontSize: 12, fontWeight: '500', color: '#9E9E9E', marginBottom: 6 },
  resultRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resultRating: { fontSize: 12, fontWeight: '700', color: '#1A1A1A' },
  resultReviews: { fontSize: 11.5, fontWeight: '500', color: '#9E9E9E' },
  resultArrowWrap: { borderRadius: 12, overflow: 'hidden' },
  resultArrowGradient: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
});