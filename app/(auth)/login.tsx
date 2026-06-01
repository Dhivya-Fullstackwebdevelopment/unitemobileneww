// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   StatusBar,
//   Dimensions,
//   Animated,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useAuthStore } from '../../store/authStore';
// import { Colors, Gradients } from '../../constants/Colors';
// import { THEME } from '@/components/Reuse/Reusecolor';
// import { z } from 'zod';
// import Toast from 'react-native-toast-message';
// import { useLocalSearchParams } from 'expo-router';

// const { width: W, height: H } = Dimensions.get('window');

// // ── Floating service-icon bubble ──────────────────────────────────────────────
// function ServiceBubble({
//   icon, top, left, right, size = 42, opacity = 0.18, color = '#FFF',
// }: {
//   icon: keyof typeof Ionicons.glyphMap;
//   top?: number; left?: number; right?: number;
//   size?: number; opacity?: number; color?: string;
// }) {
//   return (
//     <View style={[
//       bubble.wrap,
//       { top, left, right, width: size, height: size, borderRadius: size / 2, opacity },
//     ]}>
//       <Ionicons name={icon} size={size * 0.48} color={color} />
//     </View>
//   );
// }
// const bubble = StyleSheet.create({
//   wrap: {
//     position: 'absolute',
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.25)',
//   },
// });

// // ── Category pill  ─────────────────────────────────────────────────────────────
// function CategoryPill({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
//   return (
//     <View style={pill.wrap}>
//       <Ionicons name={icon} size={13} color="#FFF" />
//       <Text style={pill.text}>{label}</Text>
//     </View>
//   );
// }
// const pill = StyleSheet.create({
//   wrap: {
//     flexDirection: 'row', alignItems: 'center', gap: 5,
//     backgroundColor: 'rgba(255,255,255,0.18)',
//     borderRadius: 20, paddingHorizontal: 11, paddingVertical: 6,
//     borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)',
//   },
//   text: { color: '#FFF', fontSize: 11, fontWeight: '600' },
// });

// const loginSchema = z.object({
//   email: z.string()
//     .min(1, 'Email is required')
//     .email('Please enter a valid email address'),
//   password: z.string()
//     .min(1, 'Password is required')
//     .min(6, 'Password must be at least 6 characters'),
// });

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isVendorMode, setIsVendorMode] = useState(false);
//   const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
//   const passwordRef = useRef<TextInput>(null);
//   const { login, isLoading } = useAuthStore();
//   const C = Colors;
//   const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
//   const params = useLocalSearchParams<{ returnTo?: string }>();


//   const handleLogin = async () => {
//     setErrors({});

//     const result = loginSchema.safeParse({
//       email: email.trim().toLowerCase(),
//       password
//     });

//     if (!result.success) {
//       const fieldErrors: { email?: string; password?: string } = {};
//       result.error.issues.forEach((err) => {
//         if (err.path[0] === 'email') fieldErrors.email = err.message;
//         if (err.path[0] === 'password') fieldErrors.password = err.message;
//       });
//       setErrors(fieldErrors);
//       Toast.show({
//         type: 'error',
//         text1: 'Validation Error',
//         text2: result.error.issues[0].message,
//         position: 'top',
//         visibilityTime: 3000,
//       });
//       return;
//     }

//     const STATIC_CUSTOMER_EMAIL = 'dhivyatest1@gmail.com';
//     const STATIC_CUSTOMER_PASSWORD = 'Dhivya@12';

//     if (!isVendorMode) {
//       if (
//         result.data.email === STATIC_CUSTOMER_EMAIL &&
//         result.data.password === STATIC_CUSTOMER_PASSWORD
//       ) {
//         // Save user to store so sidebar shows name
//         useAuthStore.getState().setUser({
//           name_en: 'Dhivya Test 1',
//           email: STATIC_CUSTOMER_EMAIL,
//           role: 'customer',
//           token: 'static-customer-token',
//         });

//         Toast.show({
//           type: 'success',
//           text1: 'Welcome Back, Dhivya! 👋',
//           text2: 'Redirecting...',
//           position: 'top',
//           visibilityTime: 1500,
//         });

//         setTimeout(() => {
//           if (params.returnTo) {
//             router.replace(params.returnTo as any);
//           } else if (router.canGoBack()) {
//             router.back();
//           } else {
//             router.replace('/(tabs)');
//           }
//         }, 600);
//         return;
//       } else {
//         Toast.show({
//           type: 'error',
//           text1: 'Login Failed ❌',
//           text2: 'Invalid email or password.',
//           position: 'top',
//           visibilityTime: 4000,
//         });
//         return;
//       }
//     }

//     try {
//       await login(result.data.email, result.data.password);
//       Toast.show({
//         type: 'success',
//         text1: 'Welcome Back! 🎉',
//         text2: 'Vendor portal loading...',
//         position: 'top',
//         visibilityTime: 2000,
//       });
//       if (params.returnTo) {
//         router.replace(params.returnTo as any);
//       } else if (router.canGoBack()) {
//         router.back();
//       } else {
//         router.replace('/(tabs)');
//       }
//     } catch (err: any) {
//       const errorMsg =
//         err?.response?.data?.detail ||
//         err?.message ||
//         'Invalid credentials. Please try again.';
//       Toast.show({
//         type: 'error',
//         text1: 'Login Failed ❌',
//         text2: errorMsg,
//         position: 'top',
//         visibilityTime: 4000,
//       });
//     }
//   };

//   //const PINK = '#E91E63';
//   const PINK = '#9660BF';

//   //const PINK_LIGHT = '#FCE4EC';
//   const PINK_LIGHT = '#F3E5F5';

//   // Hero gradient (updated to pink → purple flow)
//   const heroColors: [string, string] = isVendorMode
//     ? ['#FF4081', '#7C4DFF']   // deep purple → pink (vendor mode)
//     : ['#7C4DFF', '#FF4081']; // pink → purple (main theme)

//   return (
//     <View style={{ flex: 1, backgroundColor: '#E91E63' }}>
//       <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={0}
//       >
//         <ScrollView
//           contentContainerStyle={{ flexGrow: 1 }}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//           bounces={false}
//         >
//           {/* ══ HERO SECTION ════════════════════════════════════════════════ */}
//           <LinearGradient
//             colors={heroColors}
//             start={{ x: 0.1, y: 0 }}
//             end={{ x: 0.9, y: 1 }}
//             style={styles.hero}
//           >
//             {/* Floating decorative blobs */}
//             <View style={styles.blob1} />
//             <View style={styles.blob2} />
//             <View style={styles.blob3} />

//             {/* Floating service icons — Urban Company style */}
//             <ServiceBubble icon="cut-outline" top={90} left={22} size={46} opacity={0.22} />
//             <ServiceBubble icon="car-outline" top={65} right={30} size={40} opacity={0.18} />
//             <ServiceBubble icon="home-outline" top={145} right={60} size={50} opacity={0.14} />
//             <ServiceBubble icon="restaurant-outline" top={175} left={55} size={36} opacity={0.16} />
//             <ServiceBubble icon="fitness-outline" top={110} left={120} size={34} opacity={0.12} />
//             <ServiceBubble icon="sparkles-outline" top={50} left={160} size={38} opacity={0.15} />

//             <SafeAreaView edges={['top']}>
//               <View style={styles.heroContent}>
//                 {/* Logo mark */}
//                 <View style={styles.logoMark}>
//                   <LinearGradient
//                     colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.08)']}
//                     style={styles.logoGradient}
//                   >
//                     <Ionicons name="business" size={28} color="#FFF" />
//                   </LinearGradient>
//                 </View>

//                 {/* App name */}
//                 <Text style={styles.appName}>Unite Oman</Text>
//                 <Text style={styles.appTagline}>
//                   Your city's best services, at your fingertips
//                 </Text>

//                 {/* Service category pills — Justdial style */}
//                 <View style={styles.pillsRow}>
//                   <CategoryPill icon="cut-outline" label="Salons" />
//                   <CategoryPill icon="car-outline" label="Auto" />
//                   <CategoryPill icon="restaurant-outline" label="Dining" />
//                   <CategoryPill icon="home-outline" label="Home" />
//                 </View>

//                 {/* Trust strip */}
//                 <View style={styles.trustStrip}>
//                   <View style={styles.trustItem}>
//                     <Ionicons name="star" size={12} color="#FBBF24" />
//                     <Text style={styles.trustText}>4.8 Rated</Text>
//                   </View>
//                   <View style={styles.trustDivider} />
//                   <View style={styles.trustItem}>
//                     <Ionicons name="shield-checkmark" size={12} color="#34D399" />
//                     <Text style={styles.trustText}>Verified</Text>
//                   </View>
//                   <View style={styles.trustDivider} />
//                   <View style={styles.trustItem}>
//                     <Ionicons name="business" size={12} color="#A5B4FC" />
//                     <Text style={styles.trustText}>1000+ Shops</Text>
//                   </View>
//                 </View>
//               </View>
//             </SafeAreaView>
//           </LinearGradient>

//           {/* ══ FORM SHEET ══════════════════════════════════════════════════ */}
//           <View style={[styles.sheet, { backgroundColor: C.card }]}>
//             {/* Sheet handle */}
//             <View style={styles.sheetHandle} />

//             {/* Mode toggle row */}
//             <View style={[styles.modeRow, { backgroundColor: PINK_LIGHT }]}>
//               <TouchableOpacity
//                 style={[
//                   styles.modeTab,
//                   {
//                     backgroundColor: !isVendorMode ? '#FFF' : 'transparent',
//                     borderWidth: !isVendorMode ? 1 : 0,
//                     borderColor: PINK,
//                   },
//                 ]}
//                 onPress={() => setIsVendorMode(false)}
//                 activeOpacity={0.8}
//               >
//                 <Ionicons
//                   name="person-outline"
//                   size={14}
//                   color={!isVendorMode ? PINK : '#888'}
//                 />
//                 <Text
//                   style={[
//                     styles.modeTabText,
//                     { color: !isVendorMode ? PINK : '#888' },
//                   ]}
//                 >
//                   Customer
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.modeTab,
//                   {
//                     backgroundColor: isVendorMode ? '#FFF' : 'transparent',
//                     borderWidth: isVendorMode ? 1 : 0,
//                     borderColor: PINK,
//                   },
//                 ]}
//                 onPress={() => setIsVendorMode(true)}
//                 activeOpacity={0.8}
//               >
//                 <Ionicons
//                   name="business-outline"
//                   size={14}
//                   color={isVendorMode ? PINK : '#888'}
//                 />
//                 <Text
//                   style={[
//                     styles.modeTabText,
//                     { color: isVendorMode ? PINK : '#888' },
//                   ]}
//                 >
//                   Business
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {/* Greeting */}
//             <Text style={[styles.sheetTitle, { color: C.text }]}>
//               {isVendorMode ? 'Vendor Portal 🏪' : 'Welcome back 👋'}
//             </Text>
//             <Text style={[styles.sheetSub, { color: C.textSecondary }]}>
//               {isVendorMode
//                 ? 'Manage your shops, bookings & analytics'
//                 : 'Find and book the best services in Oman'}
//             </Text>

//             {/* Email field */}
//             <View style={styles.fieldGroup}>
//               <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>Email Address</Text>
//               <View style={[
//                 styles.fieldBox,
//                 {
//                   borderColor: errors.email ? '#EF4444' : (focusedField === 'email' ? THEME.darkcolor : '#E0E0E0'),
//                   backgroundColor: focusedField === 'email' ? '#FAFBFF' : C.divider,
//                 },
//               ]}>
//                 <View style={[
//                   styles.fieldIconBox,
//                   { backgroundColor: focusedField === 'email' ? C.primaryBg : 'transparent' },
//                 ]}>
//                   <Ionicons
//                     name="mail-outline"
//                     size={16}
//                     color={errors.email ? '#EF4444' : (focusedField === 'email' ? THEME.darkcolor : '#E0E0E0')}
//                   />
//                 </View>
//                 <TextInput
//                   style={[styles.fieldInput, { color: C.text }]}
//                   placeholder="you@example.com"
//                   placeholderTextColor={C.textMuted}
//                   value={email}
//                   onChangeText={(text) => {
//                     setEmail(text);
//                     if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
//                   }}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   autoComplete="email"
//                   returnKeyType="next"
//                   onFocus={() => setFocusedField('email')}
//                   onBlur={() => setFocusedField(null)}
//                   onSubmitEditing={() => passwordRef.current?.focus()}
//                 />
//                 {email.length > 0 && (
//                   <TouchableOpacity onPress={() => setEmail('')} style={styles.clearBtn}>
//                     <Ionicons name="close-circle" size={16} color={C.textMuted} />
//                   </TouchableOpacity>
//                 )}
//               </View>
//               {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
//             </View>

//             {/* Password field */}
//             {/* Password field */}
//             <View style={styles.fieldGroup}>
//               <View style={styles.fieldLabelRow}>
//                 <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>Password</Text>
//                 <TouchableOpacity onPress={() => {
//                   Toast.show({
//                     type: 'info',
//                     text1: 'Reset Password',
//                     text2: 'Please contact support to reset your password.',
//                     position: 'top',
//                   });
//                 }}>
//                   <Text style={[styles.forgotText, { color: THEME.darkcolor }]}>Forgot?</Text>
//                 </TouchableOpacity>
//               </View>
//               <View style={[
//                 styles.fieldBox,
//                 {
//                   borderColor: errors.password ? '#EF4444' : (focusedField === 'password' ? THEME.darkcolor : C.border),
//                   backgroundColor: focusedField === 'password' ? '#FAFBFF' : C.divider,
//                 },
//               ]}>
//                 <View style={[
//                   styles.fieldIconBox,
//                   { backgroundColor: focusedField === 'password' ? C.primaryBg : 'transparent' },
//                 ]}>
//                   <Ionicons
//                     name="lock-closed-outline"
//                     size={16}
//                     color={errors.password ? '#EF4444' : (focusedField === 'password' ? THEME.darkcolor : '#E0E0E0')}
//                   />
//                 </View>
//                 <TextInput
//                   ref={passwordRef}
//                   style={[styles.fieldInput, { color: C.text }]}
//                   placeholder="Enter your password"
//                   placeholderTextColor={C.textMuted}
//                   value={password}
//                   onChangeText={(text) => {
//                     setPassword(text);
//                     if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
//                   }}
//                   secureTextEntry={!showPassword}
//                   autoComplete="current-password"
//                   returnKeyType="done"
//                   onFocus={() => setFocusedField('password')}
//                   onBlur={() => setFocusedField(null)}
//                   onSubmitEditing={handleLogin}
//                 />
//                 <TouchableOpacity
//                   onPress={() => setShowPassword(v => !v)}
//                   hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
//                   style={styles.eyeBtn}
//                 >
//                   <Ionicons
//                     name={showPassword ? 'eye-off-outline' : 'eye-outline'}
//                     size={18}
//                     color={C.textMuted}
//                   />
//                 </TouchableOpacity>
//               </View>
//               {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
//             </View>

//             {/* Sign In CTA — Urban Company style bold button */}
//             <TouchableOpacity
//               style={[styles.signInBtn, isLoading && { opacity: 0.7 }]}
//               onPress={handleLogin}
//               disabled={isLoading}
//               activeOpacity={0.88}
//             >
//               <LinearGradient
//                 colors={THEME.darkGradient}
//                 style={styles.signInGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//               >
//                 {isLoading ? (
//                   <ActivityIndicator color="#FFF" size="small" />
//                 ) : (
//                   <>
//                     <Text style={styles.signInText}>
//                       {isVendorMode ? 'Access Vendor Portal' : 'Sign In'}
//                     </Text>
//                     <View style={styles.signInArrow}>
//                       <Ionicons name="arrow-forward" size={16} color="#ffffff" />
//                     </View>
//                   </>
//                 )}
//               </LinearGradient>
//             </TouchableOpacity>

//             {/* Divider */}
//             <View style={styles.divRow}>
//               <View style={[styles.divLine, { backgroundColor: C.border }]} />
//               <Text style={[styles.divText, { color: C.textMuted }]}>or</Text>
//               <View style={[styles.divLine, { backgroundColor: C.border }]} />
//             </View>

//             {/* Create account  */}
//             <TouchableOpacity
//               style={[styles.createBtn, { borderColor: C.border }]}
//               onPress={() => router.push('/(auth)/register')}
//               activeOpacity={0.85}
//             >
//               <View style={[styles.createIcon, { backgroundColor: C.primaryBg }]}>
//                 <Ionicons name="person-add-outline" size={16} color={THEME.primary} />
//               </View>
//               <Text style={[styles.createText, { color: C.text }]}>Create an Account</Text>
//             </TouchableOpacity>

//             {/* Guest */}
//             <TouchableOpacity style={styles.guestBtn} onPress={() => router.replace('/(tabs)')}>
//               <Ionicons name="eye-outline" size={14} color={C.textMuted} />
//               <Text style={[styles.guestText, { color: C.textMuted }]}>Continue as Guest</Text>
//             </TouchableOpacity>

//             {/* Legal */}
//             <Text style={[styles.legal, { color: C.textMuted }]}>
//               By signing in you agree to our{' '}
//               <Text style={{ color: THEME.darkcolor, fontWeight: '600' }}>Terms</Text>
//               {' & '}
//               <Text style={{ color: THEME.darkcolor, fontWeight: '600' }}>Privacy Policy</Text>
//             </Text>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//       <Toast />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   hero: {
//     paddingBottom: 72,
//     overflow: 'hidden',
//     minHeight: H * 0.42,
//   },
//   blob1: {
//     position: 'absolute', width: 260, height: 260, borderRadius: 130,
//     backgroundColor: 'rgba(255,255,255,0.05)',
//     top: -80, right: -80,
//   },
//   blob2: {
//     position: 'absolute', width: 160, height: 160, borderRadius: 80,
//     backgroundColor: 'rgba(255,255,255,0.04)',
//     bottom: 10, left: -50,
//   },
//   blob3: {
//     position: 'absolute', width: 90, height: 90, borderRadius: 45,
//     backgroundColor: 'rgba(255,255,255,0.06)',
//     top: H * 0.12, left: W * 0.42,
//   },
//   heroContent: {
//     alignItems: 'center',
//     paddingTop: 44,
//     paddingHorizontal: 24,
//     paddingBottom: 8,
//   },
//   logoMark: {
//     marginBottom: 14,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.25,
//     shadowRadius: 10,
//     elevation: 8,
//   },
//   logoGradient: {
//     width: 68, height: 68, borderRadius: 22,
//     alignItems: 'center', justifyContent: 'center',
//     borderWidth: 1.5,
//     borderColor: 'rgba(255,255,255,0.4)',
//   },

//   appName: {
//     fontSize: 30,
//     fontWeight: '800',
//     color: '#FFF',
//     letterSpacing: -0.5,
//     marginBottom: 6,
//   },
//   appTagline: {
//     fontSize: 13,
//     color: 'rgba(255,255,255,0.72)',
//     fontWeight: '500',
//     textAlign: 'center',
//     lineHeight: 19,
//     marginBottom: 18,
//     paddingHorizontal: 20,
//   },
//   pillsRow: {
//     flexDirection: 'row',
//     gap: 8,
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     marginBottom: 18,
//   },
//   trustStrip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     gap: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.18)',
//   },
//   trustItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
//   trustText: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600' },
//   trustDivider: { width: 1, height: 14, backgroundColor: 'rgba(255,255,255,0.25)' },
//   sheet: {
//     flex: 1,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     marginTop: -32,
//     paddingHorizontal: 24,
//     paddingTop: 14,
//     paddingBottom: 40,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -6 },
//     shadowOpacity: 0.08,
//     shadowRadius: 20,
//     elevation: 20,
//   },
//   sheetHandle: {
//     width: 40, height: 4, borderRadius: 2,
//     backgroundColor: '#D1D5DB',
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   modeRow: {
//     flexDirection: 'row',
//     backgroundColor: '#F1F5F9',
//     borderRadius: 14,
//     padding: 4,
//     marginBottom: 24,
//     gap: 4,
//   },
//   modeTab: {
//     flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
//     gap: 6, paddingVertical: 10, borderRadius: 11,
//   },
//   modeTabActive: {
//     backgroundColor: '#FFF',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.07,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   modeTabText: {
//     fontSize: 13, fontWeight: '700', color: Colors.textMuted,
//   },
//   sheetTitle: {
//     fontSize: 24,
//     fontWeight: '800',
//     letterSpacing: -0.4,
//     marginBottom: 4,
//   },
//   sheetSub: {
//     fontSize: 13,
//     fontWeight: '500',
//     marginBottom: 26,
//     lineHeight: 19,
//   },
//   fieldGroup: { marginBottom: 14 },
//   fieldLabelRow: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7,
//   },
//   fieldLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.2 },
//   forgotText: { fontSize: 12, fontWeight: '700' },
//   fieldBox: {
//     flexDirection: 'row', alignItems: 'center',
//     borderWidth: 1.5, borderRadius: 14,
//     paddingHorizontal: 6,
//     paddingVertical: Platform.OS === 'ios' ? 4 : 2,
//     gap: 4,
//   },
//   fieldIconBox: {
//     width: 34, height: 34, borderRadius: 10,
//     alignItems: 'center', justifyContent: 'center',
//   },
//   fieldInput: {
//     flex: 1, fontSize: 14, fontWeight: '500', paddingVertical: 9,
//   },
//   clearBtn: { padding: 6 },
//   eyeBtn: { padding: 8 },
//   signInBtn: {
//     borderRadius: 16,
//     overflow: 'hidden',
//     marginTop: 6,
//     shadowColor: '#4338CA',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.4,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   signInGradient: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
//     paddingVertical: 18,
//     gap: 10,
//     minHeight: 58,
//   },
//   signInText: { color: '#FFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
//   signInArrow: {
//     width: 28, height: 28, borderRadius: 14,
//     backgroundColor: '#010101',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   divRow: {
//     flexDirection: 'row', alignItems: 'center',
//     marginVertical: 18, gap: 12,
//   },
//   divLine: { flex: 1, height: 1 },
//   divText: { fontSize: 12, fontWeight: '500' },
//   createBtn: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
//     gap: 10,
//     borderWidth: 1.5, borderRadius: 14,
//     paddingVertical: 15,
//     backgroundColor: '#F8FAFF',
//   },
//   createIcon: {
//     width: 30, height: 30, borderRadius: 9,
//     alignItems: 'center', justifyContent: 'center',
//   },
//   createText: { fontSize: 15, fontWeight: '700' },
//   guestBtn: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
//     gap: 6, marginTop: 14, paddingVertical: 8,
//   },
//   guestText: { fontSize: 13, fontWeight: '500' },
//   legal: {
//     fontSize: 11, textAlign: 'center', marginTop: 18, lineHeight: 16,
//   },
//   errorText: {
//     color: '#EF4444',
//     fontSize: 11,
//     marginTop: 4,
//     marginLeft: 4,
//     fontWeight: '500',
//   },
// });

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
  ScrollView, StatusBar, Dimensions, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { Colors } from '../../constants/Colors';
import { THEME } from '@/components/Reuse/Reusecolor';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import { useLocalSearchParams } from 'expo-router';
import { API_BASE_URL } from '@/constants/api';
import * as ImagePicker from 'expo-image-picker';

// ─────────────────────────────────────────────────────────────────────────────
// API — uses API_BASE_URL from your constants (same backend as web)
// ─────────────────────────────────────────────────────────────────────────────
const customerAuthApi = {
  // LOGIN
  login: async (email: string, password: string) => {
    const payload = {
      email,
      password,
    };

    console.log("🚀 Customer Login API Called");
    console.log("📤 Request Body:", payload);

    const res = await fetch(
      `${API_BASE_URL}/api/customers/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("📥 Status:", res.status);

    const data = await res.json();

    console.log("📥 Response:", data);

    if (!res.ok) {
      throw data;
    }

    return data;
  },

  // SEND OTP
  sendOtp: async (
    full_name: string,
    email: string,
    password: string
  ) => {
    const payload = {
      full_name,
      email,
      password,
    };

    console.log("🚀 Send OTP API Called");
    console.log("📤 Request Body:", payload);

    const res = await fetch(
      `${API_BASE_URL}/api/customers/send-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("📥 Status:", res.status);

    const data = await res.json();

    console.log("📥 Response:", data);

    if (!res.ok) {
      throw data;
    }

    return data;
  },

  // VERIFY OTP
  verifyOtp: async (
    email: string,
    otp: string
  ) => {
    const payload = {
      email,
      otp,
    };

    console.log("🚀 Verify OTP API Called");
    console.log("📤 Request Body:", payload);

    const res = await fetch(
      `${API_BASE_URL}/api/customers/verify-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("📥 Status:", res.status);

    const data = await res.json();

    console.log("📥 Response:", data);

    if (!res.ok) {
      throw data;
    }

    return data;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required').min(6, 'At least 6 characters'),
});
const registerSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
const vendorRegisterSchema = z.object({
  business_name: z.string().min(1, 'Business name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
const { width: W, height: H } = Dimensions.get('window');
const PINK = '#9660BF';
const PINK_LIGHT = '#F3E5F5';

function ServiceBubble({ icon, top, left, right, size = 42, opacity = 0.18, color = '#FFF' }: {
  icon: keyof typeof Ionicons.glyphMap;
  top?: number; left?: number; right?: number;
  size?: number; opacity?: number; color?: string;
}) {
  return (
    <View style={[bubble.wrap, { top, left, right, width: size, height: size, borderRadius: size / 2, opacity }]}>
      <Ionicons name={icon} size={size * 0.48} color={color} />
    </View>
  );
}
const bubble = StyleSheet.create({
  wrap: {
    position: 'absolute', backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
});

function CategoryPill({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={pill.wrap}>
      <Ionicons name={icon} size={13} color="#FFF" />
      <Text style={pill.text}>{label}</Text>
    </View>
  );
}
const pill = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 20,
    paddingHorizontal: 11, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)',
  },
  text: { color: '#FFF', fontSize: 11, fontWeight: '600' },
});

// ─────────────────────────────────────────────────────────────────────────────
// OTP 6-box input
// ─────────────────────────────────────────────────────────────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputs = useRef<(TextInput | null)[]>([]);
  const digits = value.padEnd(6, ' ').split('').slice(0, 6);

  const handleDigit = (index: number, text: string) => {
    const digit = text.replace(/\D/g, '').slice(-1);
    const arr = [...digits];
    arr[index] = digit;
    onChange(arr.join('').replace(/ /g, ''));
    if (digit && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleBackspace = (index: number, key: string) => {
    if (key === 'Backspace') {
      const arr = [...digits];
      arr[index] = ' ';
      onChange(arr.join(''));
      if (index > 0) inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={otpS.row}>
      {Array.from({ length: 6 }).map((_, i) => (
        <TextInput
          key={i}
          ref={r => { inputs.current[i] = r; }}
          style={[otpS.box, digits[i]?.trim() ? otpS.boxFilled : {}]}
          value={digits[i]?.trim() || ''}
          onChangeText={t => handleDigit(i, t)}
          onKeyPress={({ nativeEvent }) => handleBackspace(i, nativeEvent.key)}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
          selectTextOnFocus
        />
      ))}
    </View>
  );
}
const otpS = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginVertical: 8 },
  box: {
    width: 46, height: 54, borderWidth: 1.5, borderColor: '#E0E0E0',
    borderRadius: 12, fontSize: 22, fontWeight: '700', color: '#1a1a1a',
    backgroundColor: '#F8F8F8',
  },
  boxFilled: { borderColor: PINK, backgroundColor: PINK_LIGHT },
});

// ─────────────────────────────────────────────────────────────────────────────
// Reusable field
// ─────────────────────────────────────────────────────────────────────────────
function FieldBox({ label, icon, placeholder, value, onChangeText, error, focusedField,
  fieldKey, onFocus, onBlur, keyboardType, autoCapitalize, returnKeyType,
  onSubmitEditing, secureTextEntry, showPasswordToggle, showPassword,
  onTogglePassword, showForgot, clearable, inputRef, C }: any) {
  const focused = focusedField === fieldKey;
  return (
    <View style={styles.fieldGroup}>
      <View style={styles.fieldLabelRow}>
        <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{label}</Text>
        {showForgot && (
          <TouchableOpacity onPress={() =>
            Toast.show({ type: 'info', text1: 'Reset Password', text2: 'Please contact support.', position: 'top' })
          }>
            <Text style={[styles.forgotText, { color: THEME.darkcolor }]}>Forgot?</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={[styles.fieldBox, {
        borderColor: error ? '#EF4444' : (focused ? THEME.darkcolor : '#E0E0E0'),
        backgroundColor: focused ? '#FAFBFF' : C.divider,
      }]}>
        <View style={[styles.fieldIconBox, { backgroundColor: focused ? C.primaryBg : 'transparent' }]}>
          <Ionicons name={icon} size={16} color={error ? '#EF4444' : (focused ? THEME.darkcolor : '#E0E0E0')} />
        </View>
        <TextInput
          ref={inputRef}
          style={[styles.fieldInput, { color: C.text }]}
          placeholder={placeholder} placeholderTextColor={C.textMuted}
          value={value} onChangeText={onChangeText}
          keyboardType={keyboardType} autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType} onFocus={onFocus} onBlur={onBlur}
          onSubmitEditing={onSubmitEditing} secureTextEntry={secureTextEntry}
          autoComplete="off"
        />
        {clearable && value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={16} color={C.textMuted} />
          </TouchableOpacity>
        )}
        {showPasswordToggle && (
          <TouchableOpacity onPress={onTogglePassword}
            hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }} style={styles.eyeBtn}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={C.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type AuthTab = 'login' | 'register';   // sub-tab under Customer & Vendor
type UserType = 'customer' | 'vendor'; // top toggle
type Screen = 'form' | 'otp';          // current visible screen

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const C = Colors;
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const { login, isLoading } = useAuthStore();

  // ── State
  const [userType, setUserType] = useState<UserType>('customer');
  const [authTab, setAuthTab] = useState<AuthTab>('login');
  const [screen, setScreen] = useState<Screen>('form');

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customerImage, setCustomerImage] = useState<string | null>(null);
  const [vendorLicense, setVendorLicense] = useState<string | null>(null);

  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(600);
  const [canResend, setCanResend] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const passwordRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const fullNameRef = useRef<TextInput>(null);
  const businessNameRef = useRef<TextInput>(null);

  // OTP countdown
  useEffect(() => {
    if (screen !== 'otp') return;
    if (otpTimer <= 0) { setCanResend(true); return; }
    const id = setInterval(() => setOtpTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [screen, otpTimer]);

  const formatTimer = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const navigateAfterLogin = () => {
    setTimeout(() => {
      if (params.returnTo) router.replace(params.returnTo as any);
      else if (router.canGoBack()) router.back();
      else router.replace('/(tabs)');
    }, 600);
  };

  // Switch top tab — reset everything
  const switchUserType = (t: UserType) => {
    setUserType(t);
    setAuthTab('login');
    setScreen('form');
    setFullName(''); setBusinessName(''); setEmail(''); setPassword(''); setOtp('');
    setCustomerImage(null); setVendorLicense(null);
    setErrors({}); setShowPassword(false);
  };

  // Switch login/register sub-tab — reset form fields
  const switchAuthTab = (t: AuthTab) => {
    setAuthTab(t);
    setScreen('form');
    setFullName(''); setBusinessName(''); setEmail(''); setPassword(''); setOtp('');
    setCustomerImage(null); setVendorLicense(null);
    setErrors({}); setShowPassword(false);
  };

  // Image Picking Logic
  const pickImage = async (type: 'customer' | 'vendor') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === 'customer') {
        setCustomerImage(result.assets[0].uri);
      } else {
        setVendorLicense(result.assets[0].uri);
      }
    }
  };

  // ── CUSTOMER LOGIN
  const handleCustomerLogin = async () => {
    setErrors({});
    const result = loginSchema.safeParse({ email: email.trim().toLowerCase(), password });
    console.log("result")
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.issues.forEach(e => { fe[e.path[0] as string] = e.message; });
      setErrors(fe);
      Toast.show({ type: 'error', text1: 'Validation Error', text2: result.error.issues[0].message, position: 'top' });
      return;
    }
    try {
      setLoading(true);
      const data = await customerAuthApi.login(result.data.email, result.data.password);
      console.log("data", data)
      useAuthStore.getState().setUser({
        name_en: data.customer?.full_name || data.customer?.name_en || 'Customer',
        email: data.customer?.email,
        role: 'customer',
        token: data.access_token,
      });
      Toast.show({ type: 'success', text1: 'Welcome back! 👋', text2: 'Redirecting...', position: 'top', visibilityTime: 1500 });
      navigateAfterLogin();
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Login Failed ❌', text2: err?.detail || 'Invalid email or password', position: 'top' });
    } finally {
      setLoading(false);
    }
  };

  // ── CUSTOMER REGISTER — send OTP
  const handleCustomerRegister = async () => {
    setErrors({});

    const result = registerSchema.safeParse({
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    if (!result.success) {
      const fe: Record<string, string> = {};

      result.error.issues.forEach((e) => {
        fe[e.path[0] as string] = e.message;
      });

      setErrors(fe);

      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: result.error.issues[0].message,
        position: "top",
      });

      return;
    }

    try {
      setLoading(true);

      const response = await customerAuthApi.sendOtp(
        result.data.full_name,
        result.data.email,
        result.data.password
      );

      console.log("✅ OTP Sent Response:", response);

      Toast.show({
        type: "success",
        text1: "OTP Sent Successfully",
        text2: `OTP sent to ${result.data.email}`,
        position: "top",
      });

      setOtp("");
      setOtpTimer(600);
      setCanResend(false);
      setScreen("otp");

    } catch (err: any) {
      console.log("❌ Send OTP Error:", err);

      Toast.show({
        type: "error",
        text1: "Send OTP Failed",
        text2:
          err?.detail ||
          err?.message ||
          "Please try again",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── VENDOR LOGIN — uses authStore (your existing vendor API)
  const handleVendorLogin = async () => {
    setErrors({});
    const result = loginSchema.safeParse({ email: email.trim().toLowerCase(), password });
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.issues.forEach(e => { fe[e.path[0] as string] = e.message; });
      setErrors(fe);
      Toast.show({ type: 'error', text1: 'Validation Error', text2: result.error.issues[0].message, position: 'top' });
      return;
    }
    try {
      await login(result.data.email, result.data.password);
      Toast.show({ type: 'success', text1: 'Welcome Back! 🎉', text2: 'Vendor portal loading...', position: 'top' });
      navigateAfterLogin();
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Login Failed ❌', text2: err?.response?.data?.detail || 'Invalid credentials', position: 'top' });
    }
  };

  // ── VENDOR REGISTER
  const handleVendorRegister = async () => {
    setErrors({});
    const result = vendorRegisterSchema.safeParse({ business_name: businessName.trim(), email: email.trim().toLowerCase(), password });
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.issues.forEach(e => { fe[e.path[0] as string] = e.message; });
      setErrors(fe);
      Toast.show({ type: 'error', text1: 'Validation Error', text2: result.error.issues[0].message, position: 'top' });
      return;
    }
    if (!vendorLicense) {
      Toast.show({ type: 'error', text1: 'Document Required', text2: 'Please upload your commercial certificate', position: 'top' });
      return;
    }
    try {
      setLoading(true);
      // Replace with your real vendor registration logic/endpoints if needed
      Toast.show({ type: 'success', text1: 'Registration Request Received! 🏪', text2: 'Our team will verify your document shortly.', position: 'top' });
      switchAuthTab('login');
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Registration Failed', text2: 'Please check your details and try again.', position: 'top' });
    } finally {
      setLoading(false);
    }
  };

  // ── VERIFY OTP
  const handleVerifyOtp = async () => {
    if (otp.replace(/\s/g, '').length < 6) {
      Toast.show({ type: 'error', text1: 'Enter OTP', text2: 'Please enter all 6 digits', position: 'top' });
      return;
    }
    try {
      setLoading(true);
      const data = await customerAuthApi.verifyOtp(email.trim().toLowerCase(), otp.replace(/\s/g, ''));
      useAuthStore.getState().setUser({
        name_en: data.customer?.full_name || data.customer?.name_en || 'Customer',
        email: data.customer?.email,
        role: 'customer',
        token: data.access_token,
      });
      Toast.show({ type: 'success', text1: 'Account Created! 🎉', text2: 'Welcome to Unite Oman', position: 'top', visibilityTime: 1500 });
      navigateAfterLogin();
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Invalid OTP ❌', text2: err?.detail || 'Please check the code and try again', position: 'top' });
    } finally {
      setLoading(false);
    }
  };

  // ── RESEND OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      await customerAuthApi.sendOtp(fullName.trim(), email.trim().toLowerCase(), password);
      Toast.show({ type: 'success', text1: 'OTP Resent! 📧', position: 'top' });
      setOtp(''); setOtpTimer(600); setCanResend(false);
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Resend Failed', text2: err?.detail || 'Please try again', position: 'top' });
    } finally {
      setLoading(false);
    }
  };

  // Derived
  const heroColors: [string, string] = userType === 'vendor'
    ? ['#FF4081', '#7C4DFF']
    : ['#7C4DFF', '#FF4081'];

  const isFormLoading = loading || isLoading;

  // What happens when main CTA is pressed
  const handleCTA = () => {
    if (userType === 'vendor') {
      return authTab === 'login' ? handleVendorLogin() : handleVendorRegister();
    }
    if (authTab === 'login') return handleCustomerLogin();
    return handleCustomerRegister();
  };

  // CTA label
  const ctaLabel = userType === 'vendor'
    ? authTab === 'login' ? 'Access Vendor Portal' : 'Register Vendor Account'
    : authTab === 'login' ? 'Sign In' : 'Send OTP & Continue';

  const ctaIcon: keyof typeof Ionicons.glyphMap = authTab === 'login'
    ? 'arrow-forward'
    : 'mail-outline';

  // Title / subtitle
  const title = userType === 'vendor'
    ? authTab === 'login' ? 'Vendor Portal 🏪' : 'Create Vendor Account 🏬'
    : authTab === 'login' ? 'Welcome back 👋' : 'Create Account ✨';

  const subtitle = userType === 'vendor'
    ? authTab === 'login' ? 'Manage your shops, bookings & analytics' : 'Expand your local service presence'
    : authTab === 'login' ? 'Find and book the best services in Oman' : 'Join thousands of happy customers';

  // ══════════════════════════════════════════════════════════════════════════
  // OTP SCREEN — shown inline, replaces the sheet content
  // ══════════════════════════════════════════════════════════════════════════
  if (screen === 'otp') {
    return (
      <View style={{ flex: 1, backgroundColor: PINK_LIGHT }}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* ✅ NO ScrollView — just a plain View with justifyContent center */}
            <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>

              <TouchableOpacity onPress={() => setScreen('form')} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={20} color={PINK} />
                <Text style={[styles.backText, { color: PINK }]}>Back to Register</Text>
              </TouchableOpacity>

              <View style={{
                backgroundColor: C.card,
                borderRadius: 20,
                padding: 24,
                width: '100%',
              }}>
                <View style={[styles.otpIconWrap, { backgroundColor: PINK_LIGHT }]}>
                  <Ionicons name="mail-open-outline" size={32} color={PINK} />
                </View>
                <Text style={[styles.sheetTitle, { color: C.text, textAlign: 'center' }]}>
                  Verify Your Email
                </Text>
                <Text style={[styles.sheetSub, { color: C.textSecondary, textAlign: 'center' }]}>
                  We sent a 6-digit code to{'\n'}
                  <Text style={{ color: PINK, fontWeight: '700' }}>{email}</Text>
                </Text>

                <OtpInput value={otp} onChange={setOtp} />

                <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 24 }}>
                  {!canResend ? (
                    <Text style={{ color: C.textSecondary, fontSize: 13 }}>
                      Resend OTP in{' '}
                      <Text style={{ color: PINK, fontWeight: '700' }}>{formatTimer(otpTimer)}</Text>
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleResendOtp} disabled={isFormLoading}>
                      <Text style={{ color: PINK, fontWeight: '700', fontSize: 13 }}>Resend OTP</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.ctaBtn, isFormLoading && { opacity: 0.7 }]}
                  onPress={handleVerifyOtp}
                  disabled={isFormLoading}
                  activeOpacity={0.88}
                >
                  <LinearGradient
                    colors={THEME.darkGradient}
                    style={styles.ctaGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {isFormLoading ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <>
                        <Text style={styles.ctaText}>Verify & Create Account</Text>
                        <View style={styles.ctaArrow}>
                          <Ionicons name="checkmark" size={16} color="#fff" />
                        </View>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
        <Toast />
      </View>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // MAIN FORM SCREEN
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <View style={{ flex: 1, backgroundColor: '#7C4DFF' }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false}>

          {/* ── HERO ── */}
          <LinearGradient colors={heroColors} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.hero}>
            <View style={styles.blob1} /><View style={styles.blob2} /><View style={styles.blob3} />
            <ServiceBubble icon="cut-outline" top={90} left={22} size={46} opacity={0.22} />
            <ServiceBubble icon="car-outline" top={65} right={30} size={40} opacity={0.18} />
            <ServiceBubble icon="home-outline" top={145} right={60} size={50} opacity={0.14} />
            <ServiceBubble icon="restaurant-outline" top={175} left={55} size={36} opacity={0.16} />
            <ServiceBubble icon="fitness-outline" top={110} left={120} size={34} opacity={0.12} />
            <ServiceBubble icon="sparkles-outline" top={50} left={160} size={38} opacity={0.15} />
            <SafeAreaView edges={['top']}>
              <View style={styles.heroContent}>
                <View style={styles.logoMark}>
                  <LinearGradient colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.08)']} style={styles.logoGradient}>
                    <Ionicons name="business" size={28} color="#FFF" />
                  </LinearGradient>
                </View>
                <Text style={styles.appName}>Unite Oman</Text>
                <Text style={styles.appTagline}>Your city's best services, at your fingertips</Text>
                <View style={styles.pillsRow}>
                  <CategoryPill icon="cut-outline" label="Salons" />
                  <CategoryPill icon="car-outline" label="Auto" />
                  <CategoryPill icon="restaurant-outline" label="Dining" />
                  <CategoryPill icon="home-outline" label="Home" />
                </View>
                <View style={styles.trustStrip}>
                  <View style={styles.trustItem}><Ionicons name="star" size={12} color="#FBBF24" /><Text style={styles.trustText}>4.8 Rated</Text></View>
                  <View style={styles.trustDivider} />
                  <View style={styles.trustItem}><Ionicons name="shield-checkmark" size={12} color="#34D399" /><Text style={styles.trustText}>Verified</Text></View>
                  <View style={styles.trustDivider} />
                  <View style={styles.trustItem}><Ionicons name="business" size={12} color="#A5B4FC" /><Text style={styles.trustText}>1000+ Shops</Text></View>
                </View>
              </View>
            </SafeAreaView>
          </LinearGradient>

          {/* ── FORM SHEET ── */}
          <View style={[styles.sheet, { backgroundColor: C.card }]}>
            <View style={styles.sheetHandle} />

            {/* ── TOP TOGGLE: Customer | Business ── */}
            <View style={[styles.modeRow, { backgroundColor: PINK_LIGHT }]}>
              {(['customer', 'vendor'] as UserType[]).map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.modeTab, userType === t && { backgroundColor: '#FFF', borderWidth: 1, borderColor: PINK }]}
                  onPress={() => switchUserType(t)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={t === 'customer' ? 'person-outline' : 'business-outline'}
                    size={14}
                    color={userType === t ? PINK : '#888'}
                  />
                  <Text style={[styles.modeTabText, { color: userType === t ? PINK : '#888' }]}>
                    {t === 'customer' ? 'Customer' : 'Business'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── SUB TABS: Login | Register (Shown contextually for both) ── */}
            {/* <View style={[styles.subTabRow, { backgroundColor: '#F1F5F9' }]}>
              {(['login', 'register'] as AuthTab[]).map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.subTab, authTab === t && styles.subTabActive]}
                  onPress={() => switchAuthTab(t)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.subTabText, { color: authTab === t ? PINK : '#888' }]}>
                    {t === 'login' ? 'Login' : 'Register'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View> */}

            {/* ── Greeting ── */}
            <Text style={[styles.sheetTitle, { color: C.text }]}>{title}</Text>
            <Text style={[styles.sheetSub, { color: C.textSecondary }]}>{subtitle}</Text>

            {/* ── Full Name — Customer Register tab ── */}
            {userType === 'customer' && authTab === 'register' && (
              <FieldBox
                label="Full Name" icon="person-outline" placeholder="Enter your full name"
                value={fullName}
                onChangeText={(t: string) => { setFullName(t); if (errors.full_name) setErrors(p => ({ ...p, full_name: '' })); }}
                error={errors.full_name} focusedField={focusedField} fieldKey="full_name"
                onFocus={() => setFocusedField('full_name')} onBlur={() => setFocusedField(null)}
                returnKeyType="next" onSubmitEditing={() => emailRef.current?.focus()}
                inputRef={fullNameRef} C={C}
              />
            )}

            {/* ── Business Name — Vendor Register tab ── */}
            {userType === 'vendor' && authTab === 'register' && (
              <FieldBox
                label="Business Name" icon="business-outline" placeholder="Enter your business/shop name"
                value={businessName}
                onChangeText={(t: string) => { setBusinessName(t); if (errors.business_name) setErrors(p => ({ ...p, business_name: '' })); }}
                error={errors.business_name} focusedField={focusedField} fieldKey="business_name"
                onFocus={() => setFocusedField('business_name')} onBlur={() => setFocusedField(null)}
                returnKeyType="next" onSubmitEditing={() => emailRef.current?.focus()}
                inputRef={businessNameRef} C={C}
              />
            )}

            {/* ── Email ── */}
            <FieldBox
              label="Email Address" icon="mail-outline" placeholder="you@example.com"
              value={email}
              onChangeText={(t: string) => { setEmail(t); if (errors.email) setErrors(p => ({ ...p, email: '' })); }}
              error={errors.email} focusedField={focusedField} fieldKey="email"
              onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
              keyboardType="email-address" autoCapitalize="none" returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              clearable inputRef={emailRef} C={C}
            />

            {/* ── Password ── */}
            <FieldBox
              label="Password" icon="lock-closed-outline" placeholder="Enter your password"
              value={password}
              onChangeText={(t: string) => { setPassword(t); if (errors.password) setErrors(p => ({ ...p, password: '' })); }}
              error={errors.password} focusedField={focusedField} fieldKey="password"
              onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
              secureTextEntry={!showPassword} returnKeyType="done"
              onSubmitEditing={handleCTA}
              showPasswordToggle showPassword={showPassword}
              onTogglePassword={() => setShowPassword(v => !v)}
              showForgot={authTab === 'login'}
              inputRef={passwordRef} C={C}
            />

            {/* ── Image Upload Element — Customer Register ── */}
            {/* {userType === 'customer' && authTab === 'register' && (
              <View style={styles.uploadContainer}>
                <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>Profile Image</Text>
                <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage('customer')}>
                  {customerImage ? (
                    <Image source={{ uri: customerImage }} style={styles.uploadedImage} />
                  ) : (
                    <>
                      <Ionicons name="camera-outline" size={24} color={PINK} />
                      <Text style={styles.uploadText}>Upload Profile Photo</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )} */}

            {/* ── Document Upload Element — Vendor Register ── */}
            {userType === 'vendor' && authTab === 'register' && (
              <View style={styles.uploadContainer}>
                <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>Commercial Registration / License</Text>
                <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage('vendor')}>
                  {vendorLicense ? (
                    <Image source={{ uri: vendorLicense }} style={styles.uploadedImage} />
                  ) : (
                    <>
                      <Ionicons name="document-attach-outline" size={24} color={PINK} />
                      <Text style={styles.uploadText}>Upload Certificate (Image)</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* ── CTA Button ── */}
            <TouchableOpacity
              style={[styles.ctaBtn, isFormLoading && { opacity: 0.7 }]}
              onPress={handleCTA} disabled={isFormLoading} activeOpacity={0.88}
            >
              <LinearGradient colors={THEME.darkGradient} style={styles.ctaGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {isFormLoading
                  ? <ActivityIndicator color="#FFF" size="small" />
                  : <>
                    <Text style={styles.ctaText}>{ctaLabel}</Text>
                    <View style={styles.ctaArrow}>
                      <Ionicons name={ctaIcon} size={16} color="#ffffff" />
                    </View>
                  </>
                }
              </LinearGradient>
            </TouchableOpacity>

            {/* ── "or / Create an Account" Section from image_fe84be.jpg ── */}
            {authTab === 'login' && (
              <>
                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={[styles.dividerText, { color: C.textMuted }]}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.createAccountBtn}
                  onPress={() => {
                    if (userType === 'vendor') {
                      // Redirect vendor directly to the Multi-Step Business Listing Form
                      router.push('/(auth)/register'); // <-- Adjust this path to match your expo-router file structure
                    } else {
                      // Keep normal customer flow inline
                      setAuthTab('register');
                    }
                  }}
                >
                  <View style={styles.createAccountIconWrap}>
                    <Ionicons name="person-add-outline" size={16} color={PINK} />
                  </View>
                  <Text style={styles.createAccountBtnText}>Create an Account</Text>
                </TouchableOpacity>
              </>
            )}

            {/* ── Guest ── */}
            <TouchableOpacity style={styles.guestBtn} onPress={() => router.replace('/(tabs)')}>
              <Ionicons name="eye-outline" size={14} color={C.textMuted} />
              <Text style={[styles.guestText, { color: C.textMuted }]}>Continue as Guest</Text>
            </TouchableOpacity>

            <Text style={[styles.legal, { color: C.textMuted }]}>
              By signing in you agree to our{' '}
              <Text style={{ color: THEME.darkcolor, fontWeight: '600' }}>Terms</Text>
              {' & '}
              <Text style={{ color: THEME.darkcolor, fontWeight: '600' }}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  hero: { paddingBottom: 72, overflow: 'hidden', minHeight: H * 0.42 },
  blob1: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(255,255,255,0.05)', top: -80, right: -80 },
  blob2: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.04)', bottom: 10, left: -50 },
  blob3: { position: 'absolute', width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.06)', top: H * 0.12, left: W * 0.42 },
  heroContent: { alignItems: 'center', paddingTop: 44, paddingHorizontal: 24, paddingBottom: 8 },
  logoMark: { marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 8 },
  logoGradient: { width: 68, height: 68, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)' },
  appName: { fontSize: 30, fontWeight: '800', color: '#FFF', letterSpacing: -0.5, marginBottom: 6 },
  appTagline: { fontSize: 13, color: 'rgba(255,255,255,0.72)', fontWeight: '500', textAlign: 'center', lineHeight: 19, marginBottom: 18, paddingHorizontal: 20 },
  pillsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 18 },
  trustStrip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  trustText: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600' },
  trustDivider: { width: 1, height: 14, backgroundColor: 'rgba(255,255,255,0.25)' },

  sheet: { flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -32, paddingHorizontal: 24, paddingTop: 14, paddingBottom: 40, shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 20 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB', alignSelf: 'center', marginBottom: 20 },

  // Top toggle: Customer | Business
  modeRow: { flexDirection: 'row', borderRadius: 14, padding: 4, marginBottom: 12, gap: 4 },
  modeTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 11 },
  modeTabText: { fontSize: 13, fontWeight: '700' },

  // Sub-tabs: Login | Register
  subTabRow: { flexDirection: 'row', borderRadius: 12, padding: 3, marginBottom: 20, gap: 3 },
  subTab: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 10 },
  subTabActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 },
  subTabText: { fontSize: 13, fontWeight: '700' },

  sheetTitle: { fontSize: 24, fontWeight: '800', letterSpacing: -0.4, marginBottom: 4 },
  sheetSub: { fontSize: 13, fontWeight: '500', marginBottom: 22, lineHeight: 19 },

  fieldGroup: { marginBottom: 14 },
  fieldLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 },
  fieldLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.2 },
  forgotText: { fontSize: 12, fontWeight: '700' },
  fieldBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 6, paddingVertical: Platform.OS === 'ios' ? 4 : 2, gap: 4 },
  fieldIconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  fieldInput: { flex: 1, fontSize: 14, fontWeight: '500', paddingVertical: 9 },
  clearBtn: { padding: 6 },
  eyeBtn: { padding: 8 },
  errorText: { color: '#EF4444', fontSize: 11, marginTop: 4, marginLeft: 4, fontWeight: '500' },

  ctaBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 6, shadowColor: '#4338CA', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
  ctaGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 10, minHeight: 58 },
  ctaText: { color: '#FFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  ctaArrow: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#010101', alignItems: 'center', justifyContent: 'center' },

  // Upload Styles
  uploadContainer: { marginBottom: 14 },
  uploadBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 1.5, borderColor: PINK, borderRadius: 14, paddingVertical: 16, backgroundColor: '#FAFBFF', gap: 8, height: 60, overflow: 'hidden' },
  uploadText: { fontSize: 13, fontWeight: '600', color: PINK },
  uploadedImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  // Divider lines from image_fe84be.jpg
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { marginHorizontal: 10, fontSize: 12, fontWeight: '600', paddingHorizontal: 8 },

  // Custom secondary button structured exactly like image_fe84be.jpg
  createAccountBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 14, paddingVertical: 14, backgroundColor: '#FFF', height: 54 },
  createAccountIconWrap: { backgroundColor: '#F3E5F5', width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  createAccountBtnText: { fontSize: 15, fontWeight: '700', color: '#1A202C' },

  guestBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 18, paddingVertical: 8 },
  guestText: { fontSize: 13, fontWeight: '500' },
  legal: { fontSize: 11, textAlign: 'center', marginTop: 14, lineHeight: 16 },

  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8, marginBottom: 4 },
  backText: { fontSize: 14, fontWeight: '600' },
  otpIconWrap: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  otpCard: {
    backgroundColor: "#FFF",
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 30,
    marginTop: 12,
  }
});

