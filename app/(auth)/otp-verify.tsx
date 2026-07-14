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
import { router, useLocalSearchParams } from 'expo-router';

const COLORS = {
    bgLight: '#FFFFFF',
    purpleStart: '#B829E3',
    purpleEnd: '#801DF7',
    textGray: '#8E8E93',
};

export default function OtpVerifyScreen() {
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const otpRefs = useRef<Array<TextInput | null>>([]);

    // Checks if all 6 code inputs are filled out completely
    const isOtpComplete = otp.every(digit => digit !== '');

    const navigateToHome = () => {
        // router.replace ensures a clean replacement without screen blinking or flash
        router.replace('/(tabs)');
    };

    const handleOtpChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Clean auto-focus stepping forward
        if (text && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        // Automatic seamless redirection once the last field fills up
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
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
                <ScrollView contentContainerStyle={styles.scrollGrow} keyboardShouldPersistTaps="handled">

                    <View style={styles.lightHeader}>
                        <Text style={styles.lightTitle}>Verify Details</Text>
                        <Text style={styles.lightSubtitle}>Code sent to +968 {phone}</Text>
                    </View>

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
                                    onChangeText={(text) => handleOtpChange(text, index)}
                                    onKeyPress={(e) => handleOtpKeyPress(e, index)}
                                    selectTextOnFocus
                                />
                            ))}
                        </View>

                        <TouchableOpacity activeOpacity={0.7} style={styles.resendButton}>
                            <Text style={styles.resendText}>
                                Resend in <Text style={styles.resendCountdown}>0:45</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Clean Action Submit button below card wrapper */}
                    {/* <TouchableOpacity 
                        activeOpacity={0.9} 
                        style={styles.submitButtonSpacing} 
                        onPress={navigateToHome}
                        disabled={!isOtpComplete}
                    >
                        <LinearGradient
                            colors={[COLORS.purpleStart, COLORS.purpleEnd]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[
                                styles.primaryGradientButton,
                                !isOtpComplete && styles.disabledButton
                            ]}
                        >
                            <Text style={styles.primaryButtonText}>Submit</Text>
                        </LinearGradient>
                    </TouchableOpacity> */}

                    <View style={styles.spacer} />
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    spacer: { flex: 1 },
    scrollGrow: { flexGrow: 1, paddingHorizontal: 24 },
    lightContainer: { flex: 1, backgroundColor: '#FFFFFF' },
    lightHeader: { marginTop: 40, marginBottom: 28 },
    lightTitle: { fontSize: 32, fontWeight: '800', color: '#000000', letterSpacing: -0.5 },
    lightSubtitle: { fontSize: 16, color: '#8E8E93', marginTop: 6, fontWeight: '400' },
    otpCard: { backgroundColor: '#F7F5FC', borderRadius: 20, padding: 20, alignItems: 'center', marginTop: 8, marginBottom: 28 },
    otpCardTitle: { fontSize: 13, fontWeight: '600', color: '#8E8E93', marginBottom: 16 },
    otpInputsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 6, marginBottom: 16 },
    otpBox: { flex: 1, aspectRatio: 0.9, borderRadius: 12, backgroundColor: '#FFFFFF', textAlign: 'center', fontSize: 20, fontWeight: '700', color: '#000000', borderWidth: 1.5 },
    otpBoxEmpty: { borderColor: '#EAEAEA' },
    otpBoxFilled: { borderColor: '#D01CD6' },
    resendButton: { paddingVertical: 4 },
    resendText: { fontSize: 13, fontWeight: '600', color: '#8E8E93' },
    resendCountdown: { color: '#D01CD6', fontWeight: '700' },
    submitButtonSpacing: { marginBottom: 24 },
    primaryGradientButton: { borderRadius: 16, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
    disabledButton: { opacity: 0.4 },
    primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});