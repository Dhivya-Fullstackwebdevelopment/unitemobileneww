// interface AIResponse {
//   text: string;
//   providers?: Array<{
//     name: string;
//     rating: number;
//     price: number;
//   }>;
// }

// interface ServiceIntent {
//   keywords: string[];
//   response: AIResponse;
// }

// const serviceIntents: ServiceIntent[] = [
//   {
//     keywords: ['ac', 'technician', 'cooling', 'air condition', 'hvac'],
//     response: {
//       text: "Sure! I found 5 nearby providers for AC service in your area. Here are the top ones:",
//       providers: [
//         { name: 'Mohammed A.', rating: 4.9, price: 15 },
//         { name: 'Salim Al-Habsi', rating: 4.8, price: 8 },
//         { name: 'Khalid Al-Rashdi', rating: 4.7, price: 12 },
//       ],
//     },
//   },
//   {
//     keywords: ['electrician', 'electrical', 'wiring', 'power'],
//     response: {
//       text: "I found 3 electricians available near you:",
//       providers: [
//         { name: 'Ahmed Al-Balushi', rating: 4.9, price: 10 },
//         { name: 'Rashid Al-Kindi', rating: 4.8, price: 12 },
//         { name: 'Saif Al-Harthy', rating: 4.7, price: 9 },
//       ],
//     },
//   },
//   {
//     keywords: ['clean', 'cleaning', 'maid', 'housekeeping'],
//     response: {
//       text: "Great! We have several cleaning services available:",
//       providers: [
//         { name: 'Sparkle Clean', rating: 4.9, price: 12 },
//         { name: 'Fresh & Shine', rating: 4.8, price: 10 },
//         { name: 'Deep Clean Co.', rating: 4.7, price: 15 },
//       ],
//     },
//   },
//   {
//     keywords: ['plumb', 'plumbing', 'pipe', 'drain'],
//     response: {
//       text: "Here are the plumbers available near you:",
//       providers: [
//         { name: 'Rashid Al-Hasani', rating: 4.9, price: 10 },
//         { name: 'Mohammed Al-Balushi', rating: 4.8, price: 8 },
//       ],
//     },
//   },
// ];

// export function getAIResponse(query: string): AIResponse {
//   const lowerQuery = query.toLowerCase();
  
//   // Check if query matches any service intent
//   for (const intent of serviceIntents) {
//     if (intent.keywords.some(keyword => lowerQuery.includes(keyword))) {
//       return intent.response;
//     }
//   }
  
//   // Default response
//   return {
//     text: "I can help you find services like AC technicians, electricians, plumbers, and cleaning services. What specific service are you looking for?",
//   };
// }

// export function generateSuggestion(text: string): string {
//   // Simple suggestion generation based on query
//   if (text.toLowerCase().includes('ac') || text.toLowerCase().includes('cooling')) {
//     return 'Would you like to book an AC technician?';
//   }
//   if (text.toLowerCase().includes('clean')) {
//     return 'I can help you find a cleaning service.';
//   }
//   if (text.toLowerCase().includes('electrician')) {
//     return 'Let me find electricians near you.';
//   }
//   return 'How can I help you with that?';
// }


import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  View,
  Text,
  Easing,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function FloatingAIButton() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseSequence.start();
    return () => pulseSequence.stop();
  }, []);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/chat/ai-chat')}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: pulseAnim }] }]}>
        <LinearGradient
          colors={['#FF4081', '#7C4DFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Ionicons name="chatbubble-ellipses" size={28} color="#FFF" />
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    zIndex: 999,
    elevation: 10,
    shadowColor: '#7C4DFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  gradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  aiBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF4081',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  aiBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFF',
  },
});