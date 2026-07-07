import { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const GRADIENT_COLORS = ['#E040FB', '#7C4DFF', '#5C1FD9'] as const;

interface ServiceChip {
    key: string;
    label: string;
    emoji: string;
}

const SERVICE_CHIPS: ServiceChip[] = [
    { key: 'ac', label: 'AC', emoji: '❄️' },
    { key: 'clean', label: 'CLEAN', emoji: '🧹' },
    { key: 'fix', label: 'FIX', emoji: '🔧' },
    { key: 'beauty', label: 'BEAUTY', emoji: '💅' },
];

export default function WelcomeScreen() {
    const [language, setLanguage] = useState<'en' | 'ar'>('en');

    return (
        <>
            {/* Hide bottom tab bar (Home/Search/Favourites/Profile) just for this screen */}
            <LinearGradient
                colors={GRADIENT_COLORS}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 0.9, y: 1 }}
                style={styles.flex}
            >
                <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
                    <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

                    <View style={styles.header}>
                        {/* Swap this Image for your real logo asset, same pattern as HomeScreen:
                <Image source={require('../../assets/logo.png')} style={styles.logoImage} /> */}
                        <Text style={styles.logoText}>
                            Unite<Text style={styles.logoTextAccent}>Oman</Text>
                        </Text>
                        <Text style={styles.tagline}>Oman&apos;s #1 Home Services Platform</Text>
                        <Text style={styles.taglineAr}>منصة الخدمات المنزلية في عُمان</Text>
                    </View>

                    <View style={styles.chipsRow}>
                        {SERVICE_CHIPS.map((chip) => (
                            <View key={chip.key} style={styles.chipCard}>
                                <Text style={styles.chipEmoji}>{chip.emoji}</Text>
                                <Text style={styles.chipLabel}>{chip.label}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.badgeWrap}>
                        <View style={styles.badge}>
                            <View style={styles.badgeDot} />
                            <Text style={styles.badgeText}>900+ pros live in Muscat</Text>
                        </View>
                    </View>

                    <View style={styles.spacer} />

                    <View style={styles.langToggleWrap}>
                        <View style={styles.langToggle}>
                            <TouchableOpacity
                                style={[styles.langOption, language === 'en' && styles.langOptionActive]}
                                onPress={() => setLanguage('en')}
                            >
                                <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>EN</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.langOption, language === 'ar' && styles.langOptionActive]}
                                onPress={() => setLanguage('ar')}
                            >
                                <Text style={[styles.langText, language === 'ar' && styles.langTextActive]}>عربي</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.getStartedBtn}
                            activeOpacity={0.85}
                            onPress={() => router.push('/(tabs)')}
                        >
                            <Text style={styles.getStartedText}>Get Started →</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.signInBtn}
                            activeOpacity={0.85}
                        //   onPress={() => router.push('/(auth)/signin')}
                        >
                            <Text style={styles.signInText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    header: {
        alignItems: 'center',
        paddingTop: 48,
        paddingHorizontal: 24,
    },
    logoImage: { width: 180, height: 56, resizeMode: 'contain' },
    logoText: {
        fontSize: 34,
        fontWeight: '800',
        fontStyle: 'italic',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    logoTextAccent: {
        color: '#FFFFFF',
    },
    tagline: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.92)',
    },
    taglineAr: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.75)',
    },
    chipsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginTop: 36,
        gap: 10,
    },
    chipCard: {
        flex: 1,
        aspectRatio: 0.82,
        backgroundColor: 'rgba(255,255,255,0.16)',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    chipEmoji: { fontSize: 26, marginBottom: 8 },
    chipLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
    badgeWrap: { alignItems: 'center', marginTop: 28 },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.18)',
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 20,
    },
    badgeDot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: '#69F0AE',
    },
    badgeText: {
        fontSize: 12.5,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    spacer: { flex: 1 },
    langToggleWrap: { alignItems: 'center', marginBottom: 18 },
    langToggle: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: 18,
        padding: 4,
    },
    langOption: {
        paddingHorizontal: 18,
        paddingVertical: 7,
        borderRadius: 14,
    },
    langOptionActive: {
        backgroundColor: '#FFFFFF',
    },
    langText: {
        fontSize: 13,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.85)',
    },
    langTextActive: {
        color: '#7C4DFF',
    },
    footer: {
        paddingHorizontal: 24,
        paddingBottom: 20,
        gap: 12,
    },
    getStartedBtn: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 3,
    },
    getStartedText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#9660BF',
    },
    signInBtn: {
        backgroundColor: 'rgba(255,255,255,0.16)',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.35)',
    },
    signInText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});