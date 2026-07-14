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

type Stage = 'confirmed' | 'en_route' | 'arrived' | 'done';

export default function TrackServiceScreen() {
  const {
    professionalName = 'Mohammed Al-Balushi',
    service = 'AC Deep Cleaning',
    etaMinutes = '12',
    distance = '1.2 km away',
  } = useLocalSearchParams<{
    professionalName?: string;
    service?: string;
    etaMinutes?: string;
    distance?: string;
  }>();

  const [currentStage] = useState<Stage>('en_route');
  const initial = String(professionalName).trim().charAt(0).toUpperCase();

  // Pulse animation on the map destination pin marker
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* ── Background Canvas Mock Map ── */}
      <View style={styles.mapArea}>
        {/* Map Grid Road Separators */}
        <View style={styles.roadV} />
        <View style={styles.roadH} />

        {/* Path Line Sequence */}
        <View pointerEvents="none" style={styles.pathVerticalTop} />
        <View pointerEvents="none" style={styles.pathHorizontal} />
        <View pointerEvents="none" style={styles.pathVerticalBottom} />

        {/* Round White Floating Back Control */}
        <TouchableOpacity style={styles.backCircle} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>

        {/* Target Destination Point Pin Marker */}
        <Animated.View style={[styles.destPin, { transform: [{ scale: pulse }] }]}>
          <View style={styles.destPinInner} />
        </Animated.View>

        {/* Professional Avatar Car Pin Movement Marker */}
        <View style={styles.proCarPin}>
          <LinearGradient
            colors={['#fd59c9', '#7C4DFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.proCarPinGradient}
          >
            <Text style={styles.proCarPinText}>{initial}</Text>
          </LinearGradient>
        </View>
      </View>

      {/* ── Fixed Bottom Context Tray Sheet ── */}
      <View style={styles.bottomTray}>
        <View style={styles.trayHandle} />

        {/* Status Messaging Row Area */}
        <View style={styles.statusRow}>
          <View style={styles.avatarCircleLeft}>
            <LinearGradient
              colors={['#fd59c9', '#7C4DFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradientLeft}
            >
              <Text style={styles.avatarCircleText}>{initial}</Text>
            </LinearGradient>
          </View>
          <View style={styles.statusInfoBlock}>
            <Text style={styles.statusTitleText}>{professionalName.split(' ')[0]} is on the way</Text>
            <Text style={styles.statusSubText}>{service} · {distance}</Text>
          </View>
          <View style={styles.etaDisplayBlock}>
            <Text style={styles.etaValueText}>12</Text>
            <Text style={styles.etaLabelText}>min</Text>
          </View>
        </View>

        {/* Integrated Custom Tab Bar Progress Tracker */}
        <View style={styles.tabProgressBarContainer}>
          <View style={[styles.tabBarCell, styles.tabBarCellDoneLeft]}>
            <Text style={styles.tabBarTextActive}>Confirmed</Text>
          </View>

          <LinearGradient
            colors={['#fd59c9', '#7C4DFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.tabBarCell}
          >
            <Text style={styles.tabBarTextActive}>En Route</Text>
          </LinearGradient>

          <View style={[styles.tabBarCell, styles.tabBarCellInactive]}>
            <Text style={styles.tabBarTextInactive}>Arrived</Text>
          </View>
          <View style={[styles.tabBarCell, styles.tabBarCellInactiveRight]}>
            <Text style={styles.tabBarTextInactive}>Done</Text>
          </View>
        </View>

        {/* Action Toolbox Shortcuts Footer */}
        <View style={styles.toolboxActionRow}>
          <TouchableOpacity style={styles.utilityIconBtn} activeOpacity={0.7} onPress={() => router.push('/chat/ai-chat')}>
            <Ionicons name="chatbubble" size={18} color="#7C4DFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.utilityIconBtn} activeOpacity={0.7}>
            <Ionicons name="call" size={18} color="#7C4DFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelActionBtn} activeOpacity={0.7}>
            <Text style={styles.cancelActionText}>✕ Cancel</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#E4E8F0',
  },
  mapArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 240,
    backgroundColor: '#EAEFF6',
  },
  roadV: {
    position: 'absolute',
    left: '40%',
    top: 0,
    bottom: 0,
    width: 30,
    backgroundColor: '#F0F3F8',
  },
  roadH: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: '#F0F3F8',
  },
  pathVerticalTop: {
    position: 'absolute',
    left: '72%',
    top: '16%',
    height: '15%',
    width: 3,
    borderLeftWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#FF4081',
  },
  pathHorizontal: {
    position: 'absolute',
    left: '46%',
    top: '31%',
    width: '26%',
    height: 3,
    borderTopWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#7C4DFF',
  },
  pathVerticalBottom: {
    position: 'absolute',
    left: '46%',
    top: '31%',
    height: '10%',
    width: 3,
    borderLeftWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#7C4DFF',
  },
  backCircle: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  destPin: {
    position: 'absolute',
    left: '72%',
    top: '15%',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 64, 129, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -8 }, { translateY: -8 }],
  },
  destPinInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF4081',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  proCarPin: {
    position: 'absolute',
    left: '46%',
    top: '38%',
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    transform: [{ translateX: -17 }, { translateY: -17 }],
  },
  proCarPinGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proCarPinText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  bottomTray: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 34,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 5,
  },
  trayHandle: {
    alignSelf: 'center',
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E4E6ED',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircleLeft: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  avatarGradientLeft: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircleText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  statusInfoBlock: {
    flex: 1,
    paddingHorizontal: 12,
  },
  statusTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B1128',
  },
  statusSubText: {
    fontSize: 12.5,
    color: '#9095A6',
    fontWeight: '500',
    marginTop: 2,
  },
  etaDisplayBlock: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  etaValueText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FF4081',
    lineHeight: 26,
  },
  etaLabelText: {
    fontSize: 11,
    color: '#9095A6',
    fontWeight: '600',
  },
  tabProgressBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#F4F5F8',
    borderRadius: 14,
    height: 36,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tabBarCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarCellDoneLeft: {
    backgroundColor: '#FF4081',
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  tabBarCellInactive: {
    backgroundColor: '#F4F5F8',
  },
  tabBarCellInactiveRight: {
    backgroundColor: '#F4F5F8',
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
  tabBarTextActive: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  tabBarTextInactive: {
    color: '#B3B7C5',
    fontSize: 11,
    fontWeight: '600',
  },
  toolboxActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  utilityIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F4F5F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelActionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFEBF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelActionText: {
    color: '#FF3366',
    fontSize: 14,
    fontWeight: '700',
  },
});