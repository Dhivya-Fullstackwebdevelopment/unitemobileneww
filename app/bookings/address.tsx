import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface StepInfo {
  index: number;
  label: string;
  state: 'active' | 'inactive' | 'done';
}

const WIZARD_STEPS: StepInfo[] = [
  { index: 1, label: 'Date', state: 'done' },
  { index: 2, label: 'Address', state: 'active' },
  { index: 3, label: 'Pay', state: 'inactive' },
];

const MUSCAT_AREAS = [
  'Qurum',
  'Al Khuwair',
  'Bowsher',
  'MSQ Hills',
  'Al Ghubrah',
  'Seeb',
];

export default function AddressServiceScreen() {
  const [selectedArea, setSelectedArea] = useState('Qurum');
  const [villaApt, setVillaApt] = useState('Villa 12');
  const [street, setStreet] = useState('Al Noor Street');
  const [floor, setFloor] = useState('Ground');
  const [landmark, setLandmark] = useState('Near Al Qurum Park');
  const [isHomeAddress, setIsHomeAddress] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* ── Top Wizard Indicator Line ── */}
      <View style={styles.wizardHeaderBar}>
        {WIZARD_STEPS.map((step, idx) => {
          const isActive = step.state === 'active';
          const isDone = step.state === 'done';
          return (
            <View key={step.index} style={styles.stepBlock}>
              <View style={styles.stepItemCenter}>
                <View
                  style={[
                    styles.stepCircleCircle,
                    isActive && styles.circleActive,
                    isDone && styles.circleDone,
                    !isActive && !isDone && styles.circleInactive,
                  ]}
                >
                  {isDone ? (
                    <Ionicons name="checkmark" size={14} color="#FFF" />
                  ) : (
                    <Text
                      style={[
                        styles.stepCircleNumberText,
                        isActive ? styles.numTextActive : styles.numTextInactive,
                      ]}
                    >
                      {step.index}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabelTitle,
                    isActive || isDone ? styles.labelActive : styles.labelInactive,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
              {idx < WIZARD_STEPS.length - 1 && (
                <View
                  style={[
                    styles.stepHorizontalLineDivider,
                    isDone && styles.lineDividerActive,
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ── Map Visualizer Component Placeholder ── */}
        <View style={styles.mapContainerPlaceholder}>
          {/* Faux Grid Lines on Map */}
          <View style={styles.mapGridLineH} />
          <View style={styles.mapGridLineV} />
          {/* Map Pin Point */}
          <View style={styles.mapPinOuter}>
            <View style={styles.mapPinInner} />
          </View>
          {/* GPS Button Action Overlay */}
          <TouchableOpacity style={styles.useGpsButton} activeOpacity={0.8}>
            <Ionicons name="location" size={14} color="#FF4081" />
            <Text style={styles.useGpsText}>Use GPS</Text>
          </TouchableOpacity>
        </View>

        {/* ── Muscat Area Selection ── */}
        <Text style={styles.sectionLabelTitle}>MUSCAT AREA</Text>
        <View style={styles.chipsFlexContainer}>
          {MUSCAT_AREAS.map((area) => {
            const isChosen = area === selectedArea;
            if (isChosen) {
              return (
                <TouchableOpacity key={area} activeOpacity={0.9}>
                  <LinearGradient
                    colors={['#D500F9', '#8E24AA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientAreaChip}
                  >
                    <Text style={styles.areaChipTextActive}>{area}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity
                key={area}
                style={styles.plainAreaChip}
                activeOpacity={0.7}
                onPress={() => setSelectedArea(area)}
              >
                <Text style={styles.areaChipTextInactive}>{area}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Address Fields Form Inputs ── */}
        <View style={styles.formGroup}>
          <Text style={styles.inputLabelText}>Villa / Apt No. *</Text>
          <TextInput
            style={styles.formInputField}
            value={villaApt}
            onChangeText={setVillaApt}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabelText}>Street *</Text>
          <TextInput
            style={styles.formInputField}
            value={street}
            onChangeText={setStreet}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabelText}>Floor</Text>
          <TextInput
            style={styles.formInputField}
            value={floor}
            onChangeText={setFloor}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.inputLabelText}>Landmark</Text>
          <TextInput
            style={styles.formInputField}
            value={landmark}
            onChangeText={setLandmark}
          />
        </View>

        {/* ── Save Option Selection Row Card ── */}
        <View style={styles.saveAddressContainerRow}>
          <Switch
            value={isHomeAddress}
            onValueChange={setIsHomeAddress}
            trackColor={{ false: '#EAECEF', true: '#D500F9' }}
            thumbColor="#FFF"
            ios_backgroundColor="#EAECEF"
          />
          <Text style={styles.saveAddressTextLabel}>Save as Home address</Text>
        </View>
      </ScrollView>

      {/* ── Fixed Bottom Button Box Footer ── */}
      <View style={styles.stickyFooterArea}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/bookings/payment')}>
          <LinearGradient
            colors={['#D500F9', '#7B1FA2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fixedContinueButton}
          >
            <Text style={styles.fixedContinueButtonText}>Continue to Payment →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  wizardHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F7',
  },
  stepBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepItemCenter: {
    alignItems: 'center',
    minWidth: 50,
  },
  stepCircleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  circleActive: {
    backgroundColor: '#BA00E5',
  },
  circleDone: {
    backgroundColor: '#10B981',
  },
  circleInactive: {
    backgroundColor: '#EAECEF',
  },
  stepCircleNumberText: {
    fontSize: 12,
    fontWeight: '700',
  },
  numTextActive: {
    color: '#FFF',
  },
  numTextInactive: {
    color: '#9FA4B0',
  },
  stepLabelTitle: {
    fontSize: 10,
    fontWeight: '700',
  },
  labelActive: {
    color: '#BA00E5',
  },
  labelInactive: {
    color: '#B5B9C4',
  },
  stepHorizontalLineDivider: {
    flex: 1,
    height: 2,
    backgroundColor: '#EAECEF',
    marginHorizontal: 8,
    marginTop: -14,
  },
  lineDividerActive: {
    backgroundColor: '#10B981',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  mapContainerPlaceholder: {
    height: 170,
    backgroundColor: '#EDF1F6',
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 20,
  },
  mapGridLineH: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#E2E7EE',
  },
  mapGridLineV: {
    position: 'absolute',
    left: '35%',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#E2E7EE',
  },
  mapPinOuter: {
    position: 'absolute',
    left: '35%',
    top: '50%',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(213, 0, 249, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -9 }, { translateY: -9 }],
  },
  mapPinInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D500F9',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  useGpsButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  useGpsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2979FF',
  },
  sectionLabelTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#8E94A4',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  chipsFlexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  gradientAreaChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plainAreaChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F4F5F8',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  areaChipTextActive: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFF',
  },
  areaChipTextInactive: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#8E92A0',
  },
  formGroup: {
    marginBottom: 14,
  },
  inputLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E92A0',
    marginBottom: 6,
  },
  formInputField: {
    backgroundColor: '#F4F5F8',
    borderWidth: 1,
    borderColor: '#E8E8E9',
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  saveAddressContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF5FA',
    borderWidth: 1,
    borderColor: '#FCE4EC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 6,
  },
  saveAddressTextLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B1232',
  },
  stickyFooterArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
  fixedContinueButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedContinueButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});