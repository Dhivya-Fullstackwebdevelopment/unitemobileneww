import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

type Stage = 'confirmed' | 'en_route' | 'at_door';

const STAGES: { key: Stage; label: string }[] = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'en_route', label: 'En Route' },
  { key: 'at_door', label: 'At Door' },
];

export default function TrackServiceScreen() {
  const {
    professionalName = 'Mohammed Al-Balushi',
    professionalRole = 'AC Specialist',
    rating = '4.9',
    service = 'AC Deep Cleaning',
    address = 'Qurum',
    vehicle = 'Toyota Hiace · White',
    plate = 'AB 1234',
    etaMinutes = '8',
  } = useLocalSearchParams<{
    professionalName?: string;
    professionalRole?: string;
    rating?: string;
    service?: string;
    address?: string;
    vehicle?: string;
    plate?: string;
    etaMinutes?: string;
  }>();

  const [stage, setStage] = useState<Stage>('en_route');
  const initial = String(professionalName).trim().charAt(0).toUpperCase();
  const stageIndex = STAGES.findIndex((s) => s.key === stage);

  // Subtle pulse animation on the pin marker
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.15,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Map placeholder */}
      <View style={styles.mapArea}>
        {/* fake map grid blocks */}
        <View style={styles.mapGridRow}>
          <View style={styles.mapBlock} />
          <View style={styles.mapBlock} />
          <View style={styles.mapBlock} />
        </View>
        <View style={styles.mapGridRow}>
          <View style={styles.mapBlock} />
          <View style={[styles.mapBlock, styles.mapBlockGreen]} />
          <View style={styles.mapBlock} />
        </View>
        <View style={styles.mapGridRow}>
          <View style={styles.mapBlock} />
          <View style={styles.mapBlock} />
          <View style={styles.mapBlock} />
        </View>

        {/* dashed route */}
        <View pointerEvents="none" style={styles.routeVertical} />
        <View pointerEvents="none" style={styles.routeHorizontal} />

        {/* back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#1A1A1A" />
        </TouchableOpacity>

        {/* pin marker */}
        <Animated.View style={[styles.pin, { transform: [{ scale: pulse }] }]}>
          <Ionicons name="build" size={16} color="#FFF" />
        </Animated.View>

        {/* top status card */}
        <View style={styles.statusCard}>
          <View style={{ flex: 1 }}>
            <View style={styles.statusDotRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusTitle}>En Route to You</Text>
            </View>
            <Text style={styles.statusSubtitle}>
              {service} · {address}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.etaValue}>{etaMinutes} min</Text>
            <Text style={styles.etaLabel}>AI ETA</Text>
          </View>
        </View>
      </View>

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />

        {/* Progress stepper */}
        <View style={styles.stepperRow}>
          {STAGES.map((s, i) => {
            const done = i < stageIndex;
            const active = i === stageIndex;
            const isLast = i === STAGES.length - 1;
            return (
              <View key={s.key} style={styles.stepItem}>
                <View style={styles.stepNodeRow}>
                  <View
                    style={[
                      styles.stepNode,
                      done && styles.stepNodeDone,
                      active && styles.stepNodeActive,
                    ]}
                  >
                    {done && <Ionicons name="checkmark" size={12} color="#FFF" />}
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.stepLine,
                        (done || active) && styles.stepLineDone,
                      ]}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    done && styles.stepLabelDone,
                    active && styles.stepLabelActive,
                  ]}
                >
                  {s.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Professional card */}
        <View style={styles.proRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.proName}>{professionalName}</Text>
            <View style={styles.proMetaRow}>
              <Text style={styles.proMeta}>{professionalRole}</Text>
              <Ionicons name="star" size={12} color="#FFB300" style={{ marginLeft: 6 }} />
              <Text style={styles.proMeta}>{rating}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.aiEtaLabel}>AI ETA</Text>
            <Text style={styles.aiEtaValue}>{etaMinutes} min</Text>
          </View>
        </View>

        {/* Vehicle info */}
        <View style={styles.vehicleRow}>
          <View>
            <Text style={styles.vehicleLabel}>Vehicle</Text>
            <Text style={styles.vehicleValue}>{vehicle}</Text>
          </View>
          <View style={styles.plateBadge}>
            <Text style={styles.plateText}>{plate}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.chatBtn} activeOpacity={0.85}>
            <Ionicons name="chatbubble-outline" size={16} color="#1A1A1A" />
            <Text style={styles.chatBtnText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.9}>
            <LinearGradient
              colors={['#E91E8C', '#7C4DFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.callBtn}
            >
              <Ionicons name="call" size={16} color="#FFF" />
              <Text style={styles.callBtnText}>Call Pro</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#DCE3EC' },
  mapArea: {
    flex: 1,
    backgroundColor: '#E4E9F0',
    paddingHorizontal: 12,
    paddingTop: 8,
    justifyContent: 'center',
  },
  mapGridRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  mapBlock: { width: '30%', height: 90, backgroundColor: '#D3DCE8', borderRadius: 6 },
  mapBlockGreen: { backgroundColor: '#CDEAD9' },
  routeVertical: {
    position: 'absolute',
    left: '38%',
    top: '18%',
    bottom: '30%',
    width: 3,
    borderLeftWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#E91E8C',
  },
  routeHorizontal: {
    position: 'absolute',
    left: '38%',
    top: '18%',
    width: '35%',
    height: 3,
    borderTopWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#E91E8C',
  },
  backBtn: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pin: {
    position: 'absolute',
    left: '35.5%',
    top: '55%',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E91E8C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  statusCard: {
    position: 'absolute',
    top: 60,
    left: 14,
    right: 14,
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  statusDotRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E91E8C' },
  statusTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  statusSubtitle: { fontSize: 11.5, fontWeight: '500', color: '#9E9E9E' },
  etaValue: { fontSize: 17, fontWeight: '800', color: '#E91E8C' },
  etaLabel: { fontSize: 10, fontWeight: '700', color: '#B0B0B0' },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 20,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 18,
  },
  stepperRow: { flexDirection: 'row', marginBottom: 22, paddingHorizontal: 4 },
  stepItem: { flex: 1, alignItems: 'center' },
  stepNodeRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  stepNode: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNodeDone: { backgroundColor: '#22B573' },
  stepNodeActive: { backgroundColor: '#E91E8C', width: 22, height: 22, borderRadius: 11 },
  stepLine: { flex: 1, height: 3, backgroundColor: '#EDEDED', marginHorizontal: 2 },
  stepLineDone: { backgroundColor: '#22B573' },
  stepLabel: { fontSize: 11, fontWeight: '600', color: '#BDBDBD', marginTop: 6 },
  stepLabelDone: { color: '#22B573' },
  stepLabelActive: { color: '#E91E8C', fontWeight: '800' },
  proRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8E24AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFF', fontSize: 19, fontWeight: '800' },
  proName: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', marginBottom: 2 },
  proMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  proMeta: { fontSize: 12, fontWeight: '600', color: '#9E9E9E' },
  aiEtaLabel: { fontSize: 10, fontWeight: '700', color: '#B0B0B0' },
  aiEtaValue: { fontSize: 16, fontWeight: '800', color: '#E91E8C' },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F7F9',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  vehicleLabel: { fontSize: 11, fontWeight: '600', color: '#9E9E9E', marginBottom: 2 },
  vehicleValue: { fontSize: 13, fontWeight: '800', color: '#1A1A1A' },
  plateBadge: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  plateText: { fontSize: 13, fontWeight: '800', color: '#1A1A1A', letterSpacing: 0.5 },
  actionsRow: { flexDirection: 'row', gap: 12 },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 22,
  },
  chatBtnText: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 16,
    paddingVertical: 15,
  },
  callBtnText: { fontSize: 14, fontWeight: '800', color: '#FFF' },
});