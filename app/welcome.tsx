import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const COLORS = {
    bgDark: '#0A0119',
    purpleStart: '#B829E3',
    purpleEnd: '#801DF7',
    cardBg: '#150A2B',
    borderDark: '#2B1B4D',
    textGray: '#8F8A9A',
};

export default function WelcomeScreen() {
    return (
        <View style={styles.darkContainer}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
            <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>

                <View style={styles.welcomeCenterContent}>
                    <Text style={styles.welcomeTitle}>
                        Home services,{'\n'}
                        <Text style={styles.welcomeTitleAccent}>on demand.</Text>
                    </Text>

                    <Text style={styles.welcomeSubtitle}>
                        Book trusted pros for AC, cleaning, plumbing and more in Muscat.
                    </Text>

                    <View style={styles.serviceCard}>
                        <View style={styles.emojiRow}>
                            <Text style={styles.largeEmoji}>🏠</Text>
                            <Text style={styles.largeEmojiSparkle}>✨</Text>
                        </View>
                        <Text style={styles.serviceCardText}>21 household services</Text>
                    </View>
                </View>

                <View style={styles.welcomeFooter}>
                    <TouchableOpacity
                        style={styles.primaryButtonWrapper}
                        activeOpacity={0.9}
                        onPress={() => router.push({
                            pathname: '/(auth)/phone-entry',
                            params: { authMode: 'sign_up' }
                        })}
                    >
                        <LinearGradient
                            colors={[COLORS.purpleStart, COLORS.purpleEnd]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.primaryGradientButton}
                        >
                            <Text style={styles.primaryButtonText}>Get Started</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryDarkButton}
                        activeOpacity={0.8}
                        onPress={() => router.push({
                            pathname: '/(auth)/login',
                            params: { authMode: 'login' }
                        })}
                    >
                        <Text style={styles.secondaryButtonText}>I have an account</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    darkContainer: { flex: 1, backgroundColor: COLORS.bgDark },
    welcomeCenterContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12, marginTop: 40 },
    welcomeTitle: { fontSize: 38, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', lineHeight: 46, letterSpacing: -0.5 },
    welcomeTitleAccent: { color: '#BD34FA' },
    welcomeSubtitle: { fontSize: 15, fontWeight: '400', color: COLORS.textGray, textAlign: 'center', marginTop: 16, lineHeight: 22, paddingHorizontal: 20 },
    serviceCard: { width: '100%', backgroundColor: COLORS.cardBg, borderColor: COLORS.borderDark, borderWidth: 1, borderRadius: 24, paddingVertical: 36, alignItems: 'center', marginTop: 48 },
    emojiRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    largeEmoji: { fontSize: 50 },
    largeEmojiSparkle: { fontSize: 40, marginLeft: -5, marginTop: -20 },
    serviceCardText: { color: COLORS.textGray, fontSize: 14, fontWeight: '500' },
    welcomeFooter: { paddingHorizontal: 24, paddingBottom: 24, gap: 12 },
    primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    secondaryDarkButton: { backgroundColor: 'rgba(255, 255, 255, 0.06)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.12)', borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
    secondaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    primaryButtonWrapper: { width: '100%', borderRadius: 16, overflow: 'hidden' },
    primaryGradientButton: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
});