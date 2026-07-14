import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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
    purpleText: '#801DF7',
};

export default function LoginScreen() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const isPhoneValid = phoneNumber.trim().length >= 8;

    const handleLoginSubmit = () => {
        if (isPhoneValid) {
            router.replace('/(tabs)');
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.lightContainer}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgLight} />
            <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
                <ScrollView contentContainerStyle={styles.scrollGrow} keyboardShouldPersistTaps="handled">
                    
                    <View style={styles.lightHeader}>
                        <Text style={styles.lightTitle}>Welcome back</Text>
                        <Text style={styles.lightSubtitle}>Log in to manage your household bookings</Text>
                    </View>

                    <Text style={styles.inputLabel}>Mobile Number</Text>
                    <View style={styles.phoneInputRow}>
                        <View style={styles.countryCodeBox}>
                            <Text style={styles.countryCodeText}>
                                <Text style={styles.countryCodeGeo}>OM </Text>+968
                            </Text>
                        </View>
                        <TextInput
                            style={styles.phoneInput}
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder="9234 5678"
                            placeholderTextColor="#A0A0A0"
                            maxLength={8}
                            autoFocus
                        />
                    </View>

                    <TouchableOpacity 
                        activeOpacity={0.9} 
                        style={styles.ctaButtonSpacing} 
                        onPress={handleLoginSubmit}
                        disabled={!isPhoneValid}
                    >
                        <LinearGradient
                            colors={[COLORS.purpleStart, COLORS.purpleEnd]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.primaryGradientButton, !isPhoneValid && styles.disabledButton]}
                        >
                            <Text style={styles.primaryButtonText}>Log In</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.spacer} />

                    {/* Switch back to Create Account smoothly using router.replace */}
                    <View style={styles.footerRedirectContainer}>
                        <Text style={styles.footerRedirectText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.replace({ pathname: '/(auth)/phone-entry', params: { authMode: 'sign_up' } })}>
                            <Text style={styles.footerLinkText}>Create Account</Text>
                        </TouchableOpacity>
                    </View>
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
    lightHeader: { marginTop: 60, marginBottom: 40 },
    lightTitle: { fontSize: 32, fontWeight: '800', color: '#000000', letterSpacing: -0.5 },
    lightSubtitle: { fontSize: 16, color: COLORS.textGray, marginTop: 8, fontWeight: '400', lineHeight: 22 },
    inputLabel: { fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginBottom: 8, marginLeft: 4 },
    phoneInputRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    countryCodeBox: { backgroundColor: COLORS.inputBg, borderRadius: 14, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center', height: 58, borderWidth: 1, borderColor: '#EFEFEF' },
    countryCodeText: { fontSize: 16, fontWeight: '700', color: '#000000' },
    countryCodeGeo: { color: COLORS.textGray, fontSize: 13, fontWeight: '600' },
    phoneInput: { flex: 1, backgroundColor: COLORS.inputBg, borderRadius: 14, paddingHorizontal: 18, fontSize: 18, fontWeight: '700', color: '#000000', height: 58, borderWidth: 1, borderColor: COLORS.inputBorder },
    ctaButtonSpacing: { marginBottom: 24 },
    primaryGradientButton: { borderRadius: 16, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
    disabledButton: { opacity: 0.4 },
    primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    footerRedirectContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 24 },
    footerRedirectText: { fontSize: 14, color: COLORS.textGray, fontWeight: '500' },
    footerLinkText: { fontSize: 14, color: COLORS.purpleText, fontWeight: '700' },
});