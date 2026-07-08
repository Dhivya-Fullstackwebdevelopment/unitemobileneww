import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// ---- Brand colors pulled from the design ----
const GRADIENT: [string, string] = ['#8B5CF6', '#A855F7']; // avatar / send button / selected chip
const HIGHLIGHT_GRADIENT: [string, string] = ['#FDF2FF', '#F5F0FF']; // AI "insight" card background
const BG = '#F7F6FB';
const BORDER = '#EDEBF5';
const TEXT_DARK = '#1A1A1A';
const TEXT_GRAY = '#8B8B95';
const PINK_ACCENT = '#D946A8';

const USER_NAME = 'Ahmed';

interface QuickReply {
  id: string;
  label: string;
}

interface Message {
  id: string;
  textAr?: string;
  textEn: string;
  sender: 'user' | 'ai';
  highlight?: boolean; // pink gradient "insight" card
  tag?: string; // small chip under the bubble, e.g. "✨ AI ETA · Updated 30s ago"
  quickReplies?: QuickReply[];
  selectedReplyId?: string;
}

// ---- Mock conversation matching the reference screenshot ----
const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    textAr: 'مرحباً أحمد! 👋',
    textEn: `Hello ${USER_NAME}! How can I help?`,
    sender: 'ai',
  },
  {
    id: '2',
    textEn: 'When will Mohammed arrive?',
    sender: 'user',
  },
  {
    id: '3',
    textEn:
      'Mohammed is **8 minutes away**. He left Al Khuwair at 9:52 AM via Sultan Qaboos Street.',
    sender: 'ai',
    highlight: true,
    tag: '✨ AI ETA · Updated 30s ago',
  },
  {
    id: '4',
    textAr: 'هل يمكن تغيير الموعد؟',
    textEn: '',
    sender: 'user',
  },
  {
    id: '5',
    textAr: 'بالتأكيد! يمكنني إعادة جدولة خدمتك. اختر وقتاً مناسباً:',
    textEn: '',
    sender: 'ai',
    quickReplies: [
      { id: 'sun10', label: 'Sun\n10am' },
      { id: 'sun2', label: 'Sun\n2pm' },
      { id: 'mon10', label: 'Mon\n10am' },
    ],
    selectedReplyId: 'mon10',
  },
];

// Renders "**bold**" segments inside otherwise plain text
function renderRichText(text: string, style: any, boldStyle: any) {
  const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
  return (
    <Text style={style}>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <Text key={i} style={boldStyle}>
            {part.slice(2, -2)}
          </Text>
        ) : (
          <Text key={i}>{part}</Text>
        )
      )}
    </Text>
  );
}

export default function AIChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      textEn: inputText,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          textEn:
            "I can help you find services like AC technicians, electricians, plumbers, and cleaning services. What are you looking for?",
          sender: 'ai',
        },
      ]);
      setIsLoading(false);
    }, 1200);
  };

  const handleSelectReply = (messageId: string, replyId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, selectedReplyId: replyId } : m))
    );
  };

  const renderMessage = (message: Message) => {
    const isAI = message.sender === 'ai';

    return (
      <View
        key={message.id}
        style={[styles.messageRow, isAI ? styles.messageRowLeft : styles.messageRowRight]}
      >
        {isAI && (
          <LinearGradient
            colors={GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Ionicons name="happy-outline" size={18} color="#FFF" />
          </LinearGradient>
        )}

        <View style={{ maxWidth: '78%' }}>
          {message.highlight ? (
            <LinearGradient
              colors={HIGHLIGHT_GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.bubble, styles.aiBubbleShape, styles.highlightBorder]}
            >
              {message.textAr ? <Text style={styles.arabicText}>{message.textAr}</Text> : null}
              {renderRichText(message.textEn, styles.aiText, styles.aiTextBold)}
            </LinearGradient>
          ) : (
            <View
              style={[
                styles.bubble,
                isAI ? styles.aiBubble : styles.userBubble,
                isAI ? styles.aiBubbleShape : styles.userBubbleShape,
              ]}
            >
              {message.textAr ? (
                <Text style={isAI ? styles.arabicText : styles.arabicUserText}>
                  {message.textAr}
                </Text>
              ) : null}
              {message.textEn ? (
                renderRichText(
                  message.textEn,
                  isAI ? styles.aiText : styles.userText,
                  isAI ? styles.aiTextBold : styles.userTextBold
                )
              ) : null}
            </View>
          )}

          {message.tag && (
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>{message.tag}</Text>
            </View>
          )}

          {message.quickReplies && (
            <View style={styles.quickRepliesRow}>
              {message.quickReplies.map((reply) => {
                const selected = message.selectedReplyId === reply.id;
                return selected ? (
                  <LinearGradient
                    key={reply.id}
                    colors={GRADIENT}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.chip}
                  >
                    <Text style={styles.chipTextSelected}>{reply.label}</Text>
                  </LinearGradient>
                ) : (
                  <TouchableOpacity
                    key={reply.id}
                    style={[styles.chip, styles.chipInactive]}
                    onPress={() => handleSelectReply(message.id, reply.id)}
                  >
                    <Text style={styles.chipText}>{reply.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerAvatar}
          >
            <Ionicons name="happy-outline" size={20} color="#FFF" />
          </LinearGradient>

          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>UniteOman AI</Text>
            <View style={styles.headerSubtitleRow}>
              <View style={styles.statusDot} />
              <Text style={styles.headerSubtitle}>Always on · EN + عربي</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.langBtnOutline}>
            <Text style={styles.langBtnOutlineText}>EN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.langBtnCircle}>
            <Text style={styles.langBtnCircleText}>ع</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessage)}

          {isLoading && (
            <View style={[styles.messageRow, styles.messageRowLeft]}>
              <LinearGradient colors={GRADIENT} style={styles.avatar}>
                <Ionicons name="happy-outline" size={18} color="#FFF" />
              </LinearGradient>
              <View style={[styles.bubble, styles.aiBubble, styles.aiBubbleShape, styles.loadingBubble]}>
                <ActivityIndicator size="small" color="#8B5CF6" />
                <Text style={styles.loadingText}>AI is thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ask AI anything... / اسأل AI..."
              placeholderTextColor={TEXT_GRAY}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
              multiline
              maxLength={200}
            />
            <TouchableOpacity onPress={handleSendMessage} disabled={!inputText.trim()}>
              <LinearGradient
                colors={inputText.trim() ? GRADIENT : ['#E4E2EC', '#E4E2EC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendBtn}
              >
                <Ionicons name="send" size={16} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1, backgroundColor: BG },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    gap: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: TEXT_DARK },
  headerSubtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  headerSubtitle: { fontSize: 12, color: TEXT_GRAY },
  langBtnOutline: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  langBtnOutlineText: { fontSize: 12, fontWeight: '600', color: TEXT_DARK },
  langBtnCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langBtnCircleText: { fontSize: 13, fontWeight: '600', color: TEXT_DARK },

  // Messages
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 24 },
  messageRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-start' },
  messageRowLeft: { justifyContent: 'flex-start' },
  messageRowRight: { justifyContent: 'flex-end' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  bubble: { paddingHorizontal: 14, paddingVertical: 12 },
  aiBubble: { backgroundColor: '#FFF' },
  userBubble: { backgroundColor: '#EFEEF3', alignSelf: 'flex-end' },
  aiBubbleShape: { borderRadius: 18, borderTopLeftRadius: 4 },
  userBubbleShape: { borderRadius: 18, borderTopRightRadius: 4 },
  highlightBorder: { borderWidth: 1, borderColor: '#F0D6F0' },

  arabicText: {
    fontSize: 14,
    color: TEXT_DARK,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginBottom: 4,
  },
  arabicUserText: {
    fontSize: 14,
    color: TEXT_DARK,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  aiText: { fontSize: 14, lineHeight: 20, color: TEXT_DARK },
  aiTextBold: { fontWeight: '700', color: TEXT_DARK },
  userText: { fontSize: 14, lineHeight: 20, color: TEXT_DARK },
  userTextBold: { fontWeight: '700', color: TEXT_DARK },

  tagPill: { marginTop: 6, paddingHorizontal: 4 },
  tagText: { fontSize: 11, color: PINK_ACCENT, fontWeight: '500' },

  quickRepliesRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipInactive: { backgroundColor: '#F1F0F5' },
  chipText: { fontSize: 12, fontWeight: '600', color: TEXT_DARK, textAlign: 'center' },
  chipTextSelected: { fontSize: 12, fontWeight: '700', color: '#FFF', textAlign: 'center' },

  loadingBubble: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loadingText: { fontSize: 13, color: '#8B5CF6', fontWeight: '500' },

  // Input
  inputContainer: {
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 8 : 12,
    backgroundColor: BG,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 26,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: BORDER,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: TEXT_DARK,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
});