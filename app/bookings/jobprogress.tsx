import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

type ChecklistStatus = 'done' | 'in_progress' | 'pending';

interface ChecklistItem {
  id: string;
  label: string;
  status: ChecklistStatus;
}

const CHECKLIST: ChecklistItem[] = [
  { id: '1', label: 'Filter Removal & Clean', status: 'done' },
  { id: '2', label: 'Coil Wash & Flush', status: 'done' },
  { id: '3', label: 'Drain Pipe Clear', status: 'in_progress' },
  { id: '4', label: 'Disinfect & Sanitize', status: 'pending' },
  { id: '5', label: 'Reassemble & Test', status: 'pending' },
];

function ChecklistRow({ item }: { item: ChecklistItem }) {
  const statusMap: Record<ChecklistStatus, { label: string; color: string }> = {
    done: { label: 'Done ✓', color: '#22C55E' },
    in_progress: { label: 'In Progress', color: '#F59E0B' },
    pending: { label: 'Pending', color: '#B5B5C0' },
  };
  const s = statusMap[item.status];

  return (
    <View style={styles.checklistRow}>
      <View style={styles.checklistLeft}>
        {item.status === 'done' && (
          <View style={styles.dotDone}>
            <Ionicons name="checkmark" size={13} color="#FFF" />
          </View>
        )}
        {item.status === 'in_progress' && <View style={styles.dotInProgress} />}
        {item.status === 'pending' && <View style={styles.dotPending} />}
        <Text
          style={[
            styles.checklistLabel,
            item.status === 'pending' && styles.checklistLabelPending,
            item.status === 'in_progress' && styles.checklistLabelInProgress,
          ]}
        >
          {item.label}
        </Text>
      </View>
      <Text style={[styles.checklistStatus, { color: s.color }]}>{s.label}</Text>
    </View>
  );
}

export default function ServiceInProgressScreen() {
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Colors.background }]} edges={['top']}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Gradient header card */}
        <LinearGradient
          colors={['#f689a6', '#673aed']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerCard}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>M</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>AC Deep Cleaning In Progress</Text>
            <Text style={styles.headerSubtitle}>Started 10:02 AM · ~43 min remaining</Text>
          </View>
        </LinearGradient>

        {/* Service Checklist */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Service Checklist</Text>
          {CHECKLIST.map((item, i) => (
            <View key={item.id}>
              <ChecklistRow item={item} />
              {i < CHECKLIST.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Before & After Photos */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Before & After Photos</Text>
          <View style={styles.photoRow}>
            <View style={[styles.photoBox, { backgroundColor: '#DDE7FB' }]}>
              <Text style={styles.photoEmoji}>📷</Text>
            </View>
            <View style={[styles.photoBox, { backgroundColor: '#D8F5E4' }]}>
              <Text style={styles.photoEmoji}>✨</Text>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <Ionicons name="chatbubble-outline" size={16} color="#7C3AED" />
            <Text style={[styles.actionText, { color: '#7C3AED' }]}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
            <Ionicons name="call-outline" size={16} color="#E91E8C" />
            <Text style={[styles.actionText, { color: '#E91E8C' }]}>Call</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24, gap: 16 },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 18,
    gap: 14,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#7C3AED' },
  headerTitle: { fontSize: 15.5, fontWeight: '800', color: '#FFF', marginBottom: 3 },
  headerSubtitle: { fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.85)' },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#111114', marginBottom: 14 },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  checklistLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  dotDone: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInProgress: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F59E0B',
  },
  dotPending: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E4E4EA',
  },
  checklistLabel: { fontSize: 13.5, fontWeight: '700', color: '#111114' },
  checklistLabelPending: { color: '#B5B5C0' },
  checklistLabelInProgress: { color: '#D98A1F' },
  checklistStatus: { fontSize: 12, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F2F2F5' },
  photoRow: { flexDirection: 'row', gap: 12 },
  photoBox: {
    flex: 1,
    height: 88,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoEmoji: { fontSize: 26 },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFF',
    height: 50,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  actionText: { fontSize: 14, fontWeight: '700' },
});