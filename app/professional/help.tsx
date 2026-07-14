// app/help-support.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Linking,
    Alert,
    Modal,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const BRAND_GRADIENT = ['#D61CA8', '#8B2EF5'] as const;
const { height } = Dimensions.get('window');

interface IssueRow {
    id: string;
    emoji: string;
    title: string;
    answer: string;
}

const COMMON_ISSUES: IssueRow[] = [
    {
        id: 'cancel',
        emoji: '❓',
        title: 'How to cancel a booking',
        answer: 'To cancel a booking:\n\n1. Open the Unite app\n2. Go to "My Bookings"\n3. Select the booking you want to cancel\n4. Tap the "Cancel Booking" button\n5. Choose a reason for cancellation\n6. Confirm cancellation\n\n⚠️ Note: Cancellation fees may apply depending on the pro\'s policy. Cancellations made within 2 hours of the scheduled time may incur a 50% charge.'
    },
    {
        id: 'payment',
        emoji: '💳',
        title: 'Payment not working',
        answer: 'If your payment is not working:\n\n1. Check your internet connection\n2. Verify your card details are correct\n3. Ensure you have sufficient balance\n4. Try a different payment method\n5. Update your app to the latest version\n\nIf the issue persists:\n• Contact your bank to check for any blocks\n• Try using a different card\n• Use the WhatsApp chat option below for immediate assistance'
    },
    {
        id: 'pro-late',
        emoji: '🚗',
        title: "Pro hasn't arrived",
        answer: 'If your pro hasn\'t arrived:\n\n1. Check the app for real-time tracking\n2. Contact the pro directly through the app\n3. Wait 10-15 minutes as traffic may cause delays\n4. If still no show:\n   • Tap "Report Issue" in the booking\n   • Contact our support team\n   • We\'ll help you find an alternative pro\n\n💡 We\'ll automatically compensate you if the pro is significantly late.'
    },
    {
        id: 'report',
        emoji: '⭐',
        title: 'How to report a problem',
        answer: 'To report a problem:\n\n1. Go to your booking history\n2. Select the problematic booking\n3. Tap the "Report Issue" button\n4. Choose the issue type from the list\n5. Provide detailed description\n6. Add photos if applicable\n7. Submit the report\n\nOur team will review within 24 hours and get back to you with a resolution.'
    },
    {
        id: 'invoice',
        emoji: '🧾',
        title: 'Get my invoice / receipt',
        answer: 'To get your invoice/receipt:\n\n1. Open the Unite app\n2. Go to "My Bookings"\n3. Select the completed booking\n4. Tap "View Receipt"\n5. Choose "Download PDF" or "Email Receipt"\n6. For invoice with VAT, tap "Request Invoice"\n\nYou\'ll receive the invoice within 24 hours in your registered email.\n\n📧 For urgent invoices, contact support directly.'
    },
    {
        id: 'reschedule',
        emoji: '🔄',
        title: 'Reschedule a booking',
        answer: 'To reschedule a booking:\n\n1. Open "My Bookings" in the app\n2. Select the booking to reschedule\n3. Tap "Reschedule"\n4. Choose a new date and time\n5. Check pro\'s availability\n6. Confirm the new schedule\n\n⚠️ Important:\n• Rescheduling is free up to 24 hours before\n• Within 24 hours, a fee may apply\n• Pro must approve the new time\n• You\'ll get a confirmation notification'
    },
];

interface ContactRow {
    id: string;
    emoji: string;
    title: string;
    subtitle: string;
    action: () => void;
}

const WHATSAPP_NUMBER = '96892345678';
const SUPPORT_PHONE = '+96892345678';
const SUPPORT_EMAIL = 'support@uniteoman.com';

export default function HelpSupportScreen() {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [selectedIssue, setSelectedIssue] = useState<IssueRow | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const openLink = async (url: string, id: string) => {
        try {
            setLoadingId(id);
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Unable to open', 'This action is not supported on your device.');
            }
        } catch {
            Alert.alert('Something went wrong', 'Please try again.');
        } finally {
            setLoadingId(null);
        }
    };

    const handleIssuePress = (issue: IssueRow) => {
        setSelectedIssue(issue);
        setModalVisible(true);
    };

    const handleAIChat = () => {
        router.push('/(tabs)/ai-chat');
    };

    const CONTACT_ROWS: ContactRow[] = [
        {
            id: 'whatsapp',
            emoji: '💬',
            title: 'WhatsApp Chat',
            subtitle: '+968 9234 5678',
            action: () => openLink(`https://wa.me/${WHATSAPP_NUMBER}`, 'whatsapp'),
        },
        {
            id: 'call',
            emoji: '📞',
            title: 'Call Support',
            subtitle: '24/7 available',
            action: () => openLink(`tel:${SUPPORT_PHONE}`, 'call'),
        },
        {
            id: 'email',
            emoji: '📧',
            title: 'Email',
            subtitle: SUPPORT_EMAIL,
            action: () => openLink(`mailto:${SUPPORT_EMAIL}`, 'email'),
        },
    ];

    const renderAnswerModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            hitSlop={10}
                        >
                            <Ionicons name="close" size={24} color="#1A1A1A" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>{selectedIssue?.title}</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    {/* Modal Body */}
                    <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                        <View style={styles.answerContainer}>
                            <Text style={styles.answerEmoji}>{selectedIssue?.emoji}</Text>
                            <Text style={styles.answerText}>{selectedIssue?.answer}</Text>
                        </View>

                        {/* Quick Actions */}
                        <View style={styles.quickActions}>
                            <Text style={styles.quickActionsTitle}>Need more help?</Text>
                            <TouchableOpacity
                                style={styles.quickActionButton}
                                onPress={() => {
                                    setModalVisible(false);
                                    handleAIChat();
                                }}
                            >
                                <LinearGradient
                                    colors={BRAND_GRADIENT}
                                    style={styles.quickActionGradient}
                                >
                                    <Text style={styles.quickActionText}>💬 Chat with AI</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.quickActionButton, styles.quickActionSecondary]}
                                onPress={() => {
                                    setModalVisible(false);
                                    // Open WhatsApp
                                    openLink(`https://wa.me/${WHATSAPP_NUMBER}`, 'whatsapp');
                                }}
                            >
                                <Text style={styles.quickActionSecondaryText}>📱 Contact Support</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
                    <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Help & Support</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* AI Assistant Card */}
                <TouchableOpacity activeOpacity={0.85} onPress={handleAIChat}>
                    <LinearGradient
                        colors={BRAND_GRADIENT}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.aiCard}
                    >
                        <View style={styles.aiIconWrap}>
                            <Text style={styles.aiIconText}>🤖</Text>
                        </View>
                        <View style={styles.aiTextBlock}>
                            <Text style={styles.aiTitle}>Chat with AI Assistant</Text>
                            <Text style={styles.aiSubtitle}>Get instant answers in English or Arabic</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Common Issues */}
                <Text style={styles.sectionLabel}>COMMON ISSUES</Text>
                <View style={styles.card}>
                    {COMMON_ISSUES.map((issue, i) => (
                        <TouchableOpacity
                            key={issue.id}
                            style={[styles.row, i === COMMON_ISSUES.length - 1 && styles.rowLast]}
                            activeOpacity={0.7}
                            onPress={() => handleIssuePress(issue)}
                        >
                            <Text style={styles.rowEmoji}>{issue.emoji}</Text>
                            <Text style={styles.rowTitle}>{issue.title}</Text>
                            <Ionicons name="chevron-forward" size={18} color="#C0C0C0" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Contact Us */}
                <Text style={styles.sectionLabel}>CONTACT US</Text>
                <View style={{ gap: 12 }}>
                    {CONTACT_ROWS.map((contact) => (
                        <View key={contact.id} style={styles.contactCard}>
                            <View style={styles.contactIconWrap}>
                                <Text style={styles.contactEmoji}>{contact.emoji}</Text>
                            </View>
                            <View style={styles.contactTextBlock}>
                                <Text style={styles.contactTitle}>{contact.title}</Text>
                                <Text style={styles.contactSubtitle}>{contact.subtitle}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.chatButton}
                                activeOpacity={0.8}
                                onPress={contact.action}
                                disabled={loadingId === contact.id}
                            >
                                <Text style={styles.chatButtonText}>
                                    {loadingId === contact.id ? '...' : 'Chat'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Answer Modal */}
            {renderAnswerModal()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },

    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginTop: 15,
    },
    topBarTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1A1A1A',
    },

    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },

    aiCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        padding: 18,
        gap: 14,
        marginBottom: 22,
    },
    aiIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    aiIconText: {
        fontSize: 24,
    },
    aiTextBlock: {
        flex: 1,
    },
    aiTitle: {
        fontSize: 15.5,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 3,
    },
    aiSubtitle: {
        fontSize: 12.5,
        color: 'rgba(255,255,255,0.9)',
    },

    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9E9EA8',
        letterSpacing: 0.5,
        marginBottom: 10,
        marginTop: 4,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
        marginBottom: 22,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        gap: 14,
    },
    rowLast: {
        borderBottomWidth: 0,
    },
    rowEmoji: {
        fontSize: 18,
        width: 22,
        textAlign: 'center',
    },
    rowTitle: {
        flex: 1,
        fontSize: 14.5,
        color: '#1A1A1A',
        fontWeight: '700',
    },

    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    contactIconWrap: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#F5F0FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactEmoji: {
        fontSize: 19,
    },
    contactTextBlock: {
        flex: 1,
    },
    contactTitle: {
        fontSize: 14.5,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    contactSubtitle: {
        fontSize: 12.5,
        color: '#9E9EA8',
    },
    chatButton: {
        backgroundColor: '#B026C0',
        paddingHorizontal: 20,
        paddingVertical: 9,
        borderRadius: 20,
    },
    chatButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: height * 0.85,
        minHeight: height * 0.5,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 10,
    },
    modalBody: {
        padding: 20,
    },
    answerContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    answerEmoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    answerText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#1A1A1A',
        textAlign: 'left',
        width: '100%',
    },
    quickActions: {
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 20,
    },
    quickActionsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 12,
        textAlign: 'center',
    },
    quickActionButton: {
        marginBottom: 10,
        borderRadius: 12,
        overflow: 'hidden',
    },
    quickActionGradient: {
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 12,
    },
    quickActionText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    quickActionSecondary: {
        backgroundColor: '#F5F5F7',
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 12,
    },
    quickActionSecondaryText: {
        color: '#1A1A1A',
        fontSize: 15,
        fontWeight: '600',
    },
});