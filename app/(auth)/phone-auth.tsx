import React, { useState, useRef } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    TextInput, 
    StatusBar, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const COLORS = {
    bgLight: '#FFFFFF',
    purpleStart: '#B829E3',
    purpleEnd: '#801DF7',
    inputBg: '#F8F9FB',
    inputBorder: '#F0E2F5',
    textGray: '#8E8E93',
    accentPink: '#D01CD6',
};

export default function CombinedPhoneAuthScreen() {
    // Stage controller: 'PHONE' or 'OTP'
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const otpRefs = useRef<Array<TextInput | null>>([]);

    const isPhoneValid = phoneNumber.trim().length >= 8;
    const isOtpComplete = otp.every(digit => digit !== '');

    const handleActionSubmit = () => {
        if (step === 'PHONE') {
            if (isPhoneValid) {
                // Switch dynamically to the OTP entry form section
                setStep('OTP');
            }
        } else {
            if (isOtpComplete) {
                // Instantly navigate straight home with zero screen flash or blink
                router.replace('/(tabs)');
            }
        }
    };

    const handleOtpChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto focus forward parsing step
        if (text && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        // Seamless redirect when the final field is fully typed
        if (text && index === 5 && newOtp.every(d => d !== '')) {
            router.replace('/(tabs)');
        }
    };

    const handleOtpKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={styles.lightContainer}
        >
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgLight} />
            <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
                <ScrollView contentContainerStyle={styles.scrollGrow} keyboardShouldPersistTaps="handled">
                    
                    {/* Header Stack Container */}
                    <View style={styles.lightHeader}>
                        <Text style={styles.lightTitle}>
                            {step === 'PHONE' ? 'Enter your\nphone number' : 'Verify Details'}
                        </Text>
                        <Text style={styles.lightSubtitle}>
                            {step === 'PHONE' ? "We'll send a code via SMS" : `Code sent to +968 ${phoneNumber}`}
                        </Text>
                    </View>

                    {/* Phone Layout Input Bar Row */}
                    <View style={styles.phoneInputRow}>
                        <View style={styles.countryCodeBox}>
                            <Text style={styles.countryCodeText}>
                                <Text style={styles.countryCodeGeo}>OM </Text>+968
                            </Text>
                        </View>
                        <TextInput
                            style={[styles.phoneInput, step === 'OTP' && styles.disabledInput]}
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder="9234 5678"
                            placeholderTextColor="#A0A0A0"
                            maxLength={8}
                            editable={step === 'PHONE'}
                        />
                    </View>

                    {/* Shared CTA Flow Action Button (Transitions Text dynamically) */}
                    <TouchableOpacity 
                        activeOpacity={0.9} 
                        style={styles.actionButtonSpacing} 
                        onPress={handleActionSubmit}
                        disabled={step === 'PHONE' ? !isPhoneValid : !isOtpComplete}
                    >
                        <LinearGradient
                            colors={[COLORS.purpleStart, COLORS.purpleEnd]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[
                                styles.primaryGradientButton,
                                ((step === 'PHONE' && !isPhoneValid) || (step === 'OTP' && !isOtpComplete)) && styles.disabledButton
                            ]}
                        >
                            <Text style={styles.primaryButtonText}>
                                {step === 'PHONE' ? 'Send OTP' : 'Submit'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Sub Container Box for the 6-Digit Verification grid */}
                    {step === 'OTP' && (
                        <View style={styles.otpCard}>
                            <Text style={styles.otpCardTitle}>Enter the 6-digit code</Text>

                            <View style={styles.otpInputsContainer}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(el) => { otpRefs.current[index] = el; }}
                                        style={[
                                            styles.otpBox,
                                            digit ? styles.otpBoxFilled : styles.otpBoxEmpty
                                        ]}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        value={digit}
                                        placeholder="—"
                                        placeholderTextColor="#C7C7CC"
                                        onChangeText={(text) => handleOtpChange(text, index)}
                                        onKeyPress={(e) => handleOtpKeyPress(e, index)}
                                        selectTextOnFocus
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </View>

                            <TouchableOpacity activeOpacity={0.7}>
                                <Text style={styles.resendText}>
                                    Resend in <Text style={styles.resendCountdown}>0:45</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.spacer} />
                    <Text style={styles.termsText}>Via Unifonic SMS · By continuing you agree to our Terms</Text>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    spacer: { flex: 1 },
    scrollGrow: { flexGrow: 1, paddingHorizontal: 24 },
    lightContainer: { flex: 1, backgroundColor: COLORS.bgLight },
    lightHeader: { marginTop: 40, marginBottom: 28 },
    lightTitle: { fontSize: 34, fontWeight: '800', color: '#000000', letterSpacing: -0.5, lineHeight: 42 },
    lightSubtitle: { fontSize: 16, color: '#8E8E93', marginTop: 8, fontWeight: '400' },
    phoneInputRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    countryCodeBox: { backgroundColor: COLORS.inputBg, borderRadius: 14, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center', height: 58, borderWidth: 1, borderColor: '#EFEFEF' },
    countryCodeText: { fontSize: 16, fontWeight: '700', color: '#000000' },
    countryCodeGeo: { color: '#8E8E93', fontSize: 13, fontWeight: '600' },
    phoneInput: { flex: 1, backgroundColor: COLORS.inputBg, borderRadius: 14, paddingHorizontal: 18, fontSize: 18, fontWeight: '700', color: '#000000', height: 58, borderWidth: 1, borderColor: COLORS.inputBorder },
    disabledInput: { opacity: 0.6, backgroundColor: '#EFEFEF', borderColor: '#EAEAEA' },
    actionButtonSpacing: { marginBottom: 24 },
    primaryGradientButton: { borderRadius: 16, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
    disabledButton: { opacity: 0.4 },
    primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    otpCard: { backgroundColor: '#F7F5FC', borderRadius: 20, padding: 20, alignItems: 'center', marginTop: 4 },
    otpCardTitle: { fontSize: 13, fontWeight: '600', color: '#8E8E93', marginBottom: 16 },
    otpInputsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 6, marginBottom: 16 },
    otpBox: { flex: 1, aspectRatio: 0.9, borderRadius: 12, backgroundColor: '#FFFFFF', textAlign: 'center', fontSize: 20, fontWeight: '700', color: '#000000', borderWidth: 1.5 },
    otpBoxEmpty: { borderColor: '#EAEAEA' },
    otpBoxFilled: { borderColor: COLORS.accentPink },
    resendText: { fontSize: 13, fontWeight: '600', color: '#8E8E93' },
    resendCountdown: { color: COLORS.accentPink, fontWeight: '700' },
    termsText: { textAlign: 'center', fontSize: 12, color: '#A8A7AD', paddingVertical: 16, fontWeight: '400' },
});