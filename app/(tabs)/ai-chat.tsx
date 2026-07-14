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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'pro';
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Assalamu alaikum! I\'m on my way, will be there in about 12 minutes.',
    sender: 'pro',
    time: '9:48 AM',
  },
  {
    id: '2',
    text: 'Ok, I\'ll leave the door open. Please call when you arrive.',
    sender: 'user',
    time: '9:50 AM',
  },
  {
    id: '3',
    text: 'Perfect, jazakallah khair! I have all my equipment. The AC unit — which floor please?',
    sender: 'pro',
    time: '9:51 AM',
  },
  {
    id: '4',
    text: 'Ground floor, living room and master bedroom please',
    sender: 'user',
    time: '9:52 AM',
  },
];

export default function AIChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 60);
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeStr = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      time: timeStr,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* ── Header Area ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#555" />
        </TouchableOpacity>

        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>M</Text>
        </View>

        <View style={styles.headerMetaBlock}>
          <Text style={styles.proNameText}>Mohammed Al-Balushi</Text>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>

        <View style={styles.rightActionIcons}>
          <TouchableOpacity style={styles.iconActionBtn}>
            <Ionicons name="call" size={20} color="#E91E63" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconActionBtn}>
            <Ionicons name="videocam" size={22} color="#5C6BC0" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Conversation Content Area ── */}
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Day Label Token */}
          <Text style={styles.dateLabelDivider}>Today · Booking #UO-4601</Text>

          {messages.map((msg) => {
            const isMe = msg.sender === 'user';
            
            return (
              <View key={msg.id} style={[styles.messageRow, isMe ? styles.rowRight : styles.rowLeft]}>
                {!isMe && (
                  <View style={styles.msgProfileAvatar}>
                    <Text style={styles.msgAvatarText}>M</Text>
                  </View>
                )}

                <View style={[styles.bubbleWrapper, isMe ? styles.wrapRight : styles.wrapLeft]}>
                  {isMe ? (
                    <LinearGradient
                      colors={['#fd59c9', '#7C4DFF']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.userBubble}
                    >
                      <Text style={styles.userMessageText}>{msg.text}</Text>
                      <View style={styles.userTimeStatusRow}>
                        <Text style={styles.userTimeText}>{msg.time}</Text>
                        <Ionicons name="checkmark-done" size={14} color="#FFF" style={{ marginLeft: 3 }} />
                      </View>
                    </LinearGradient>
                  ) : (
                    <View style={styles.proBubble}>
                      <Text style={styles.proMessageText}>{msg.text}</Text>
                      <Text style={styles.proTimeText}>{msg.time}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
          
          {/* Real-time typing bubble placeholder indicator */}
          <View style={[styles.messageRow, styles.rowLeft, { marginBottom: 0 }]}>
            <View style={styles.msgProfileAvatar}>
              <Text style={styles.msgAvatarText}>M</Text>
            </View>
            <View style={styles.typingBubble}>
              <Text style={styles.typingText}>Typing...</Text>
            </View>
          </View>
        </ScrollView>

        {/* ── Sticky Input Actions Bar Footer ── */}
        <View style={styles.inputBarArea}>
          <TextInput
            style={styles.textInputField}
            placeholder="Type a message..."
            placeholderTextColor="#8E93A1"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSendMessage}
            multiline
          />
          <TouchableOpacity 
            disabled={!inputText.trim()} 
            onPress={handleSendMessage}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={inputText.trim() ? ['#fd59c9', '#7C4DFF'] : ['#E0E0E6', '#D1D1D6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sendButtonCircle}
            >
              <Ionicons name="play" size={16} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F5',
  },
  backBtn: {
    padding: 4,
    marginRight: 4,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9C27B0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  headerMetaBlock: {
    flex: 1,
    paddingHorizontal: 10,
  },
  proNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#101426',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 4,
  },
  statusText: {
    fontSize: 11.5,
    color: '#9095A6',
    fontWeight: '600',
  },
  rightActionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconActionBtn: {
    padding: 4,
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 24,
  },
  dateLabelDivider: {
    alignSelf: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#9296A5',
    marginBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
    width: '100%',
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  rowRight: {
    justifyContent: 'flex-end',
  },
  msgProfileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#9C27B0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  msgAvatarText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bubbleWrapper: {
    maxWidth: '80%',
  },
  wrapLeft: {
    alignItems: 'flex-start',
  },
  wrapRight: {
    alignItems: 'flex-end',
  },
  proBubble: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  proMessageText: {
    fontSize: 14,
    color: '#0D0F1C',
    fontWeight: '500',
    lineHeight: 20,
  },
  proTimeText: {
    fontSize: 10,
    color: '#9296A5',
    fontWeight: '600',
    marginTop: 4,
  },
  userBubble: {
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  userMessageText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
    lineHeight: 20,
  },
  userTimeStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  userTimeText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
  },
  typingBubble: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 12.5,
    color: '#9296A5',
    fontWeight: '500',
  },
  inputBarArea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEF',
  },
  textInputField: {
    flex: 1,
    backgroundColor: '#F4F5F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: '#000',
    maxHeight: 80,
    marginRight: 10,
  },
  sendButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2, 
  },
});