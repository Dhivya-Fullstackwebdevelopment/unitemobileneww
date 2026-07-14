// import React from 'react';
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     StyleSheet,
//     TextInput,
//     StatusBar,
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';

// const COLORS = {
//     bgLight: '#FFFFFF',
//     purpleStart: '#B829E3',
//     purpleEnd: '#801DF7',
//     inputBg: '#F8F9FB',
//     inputBorder: '#F0E2F5',
// };

// interface PhoneAuthScreenProps {
//     step: 'PHONE_ENTRY' | 'OTP_VERIFY';
//     phoneNumber: string;
//     setPhoneNumber: (text: string) => void;
//     otp: string[];
//     otpRefs: React.MutableRefObject<Array<TextInput | null>>;
//     handleOtpChange: (text: string, index: number) => void;
//     handleOtpKeyPress: (e: any, index: number) => void;
//     onSendOtp: () => void;
// }

// export default function PhoneAuthScreen({
//     step,
//     phoneNumber,
//     setPhoneNumber,
//     otp,
//     otpRefs,
//     handleOtpChange,
//     handleOtpKeyPress,
//     onSendOtp,
// }: PhoneAuthScreenProps) {
//     return (
//         <KeyboardAvoidingView 
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
//             style={styles.lightContainer}
//         >
//             <StatusBar barStyle="dark-content" backgroundColor={COLORS.bgLight} />
//             <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
//                 <ScrollView contentContainerStyle={styles.scrollGrow} keyboardShouldPersistTaps="handled">
                    
//                     <View style={styles.lightHeader}>
//                         <Text style={styles.lightTitle}>
//                             {step === 'PHONE_ENTRY' ? 'Enter your phone number' : 'Verify Details'}
//                         </Text>
//                         <Text style={styles.lightSubtitle}>We'll send a code via SMS</Text>
//                     </View>

//                     {/* Phone Input Row */}
//                     <View style={styles.phoneInputRow}>
//                         <View style={styles.countryCodeBox}>
//                             <Text style={styles.countryCodeText}>
//                                 <Text style={styles.countryCodeGeo}>OM </Text>+968
//                             </Text>
//                         </View>
//                         <TextInput
//                             style={styles.phoneInput}
//                             keyboardType="phone-pad"
//                             value={phoneNumber}
//                             onChangeText={setPhoneNumber}
//                             placeholder="0000 0000"
//                             placeholderTextColor="#A0A0A0"
//                             editable={step === 'PHONE_ENTRY'}
//                         />
//                     </View>

//                     {/* Send OTP Dynamic Button */}
//                     {step === 'PHONE_ENTRY' && (
//                         <TouchableOpacity activeOpacity={0.9} style={styles.otpButtonSpacing} onPress={onSendOtp}>
//                             <LinearGradient
//                                 colors={[COLORS.purpleStart, COLORS.purpleEnd]}
//                                 start={{ x: 0, y: 0 }}
//                                 end={{ x: 1, y: 0 }}
//                                 style={styles.primaryGradientButton}
//                             >
//                                 <Text style={styles.primaryButtonText}>Send OTP</Text>
//                             </LinearGradient>
//                         </TouchableOpacity>
//                     )}

//                     {/* OTP verification box */}
//                     {step === 'OTP_VERIFY' && (
//                         <View style={styles.otpCard}>
//                             <Text style={styles.otpCardTitle}>Enter the 6-digit code</Text>
                            
//                             <View style={styles.otpInputsContainer}>
//                                 {otp.map((digit, index) => (
//                                     <TextInput
//                                         key={index}
//                                         ref={(el) => { otpRefs.current[index] = el; }}
//                                         style={[
//                                             styles.otpBox, 
//                                             digit ? styles.otpBoxFilled : styles.otpBoxEmpty
//                                         ]}
//                                         keyboardType="number-pad"
//                                         maxLength={1}
//                                         value={digit}
//                                         onChangeText={(text) => handleOtpChange(text, index)}
//                                         onKeyPress={(e) => handleOtpKeyPress(e, index)}
//                                         selectTextOnFocus
//                                     />
//                                 ))}
//                             </View>

//                             <TouchableOpacity activeOpacity={0.7}>
//                                 <Text style={styles.resendText}>
//                                     Resend in <Text style={styles.resendCountdown}>0:45</Text>
//                                 </Text>
//                             </TouchableOpacity>
//                         </View>
//                     )}

//                     <View style={styles.spacer} />

//                     <Text style={styles.termsText}>
//                         Via Unifonic SMS · By continuing you agree to our Terms
//                     </Text>

//                 </ScrollView>
//             </SafeAreaView>
//         </KeyboardAvoidingView>
//     );
// }

// const styles = StyleSheet.create({
//     flex: { flex: 1 },
//     spacer: { flex: 1 },
//     scrollGrow: { flexGrow: 1, paddingHorizontal: 24 },
//     lightContainer: {
//         flex: 1,
//         backgroundColor: COLORS.bgLight,
//     },
//     lightHeader: {
//         marginTop: 40,
//         marginBottom: 28,
//     },
//     lightTitle: {
//         fontSize: 32,
//         fontWeight: '800',
//         color: '#000000',
//         letterSpacing: -0.5,
//     },
//     lightSubtitle: {
//         fontSize: 16,
//         color: '#8E8E93',
//         marginTop: 6,
//         fontWeight: '400',
//     },
//     phoneInputRow: {
//         flexDirection: 'row',
//         gap: 12,
//         marginBottom: 16,
//     },
//     countryCodeBox: {
//         backgroundColor: COLORS.inputBg,
//         borderRadius: 14,
//         paddingHorizontal: 16,
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: 58,
//         borderWidth: 1,
//         borderColor: '#EFEFEF',
//     },
//     countryCodeText: {
//         fontSize: 16,
//         fontWeight: '700',
//         color: '#000000',
//     },
//     countryCodeGeo: {
//         color: '#8E8E93',
//         fontSize: 13,
//         fontWeight: '600',
//     },
//     phoneInput: {
//         flex: 1,
//         backgroundColor: COLORS.inputBg,
//         borderRadius: 14,
//         paddingHorizontal: 18,
//         fontSize: 18,
//         fontWeight: '700',
//         color: '#000000',
//         height: 58,
//         borderWidth: 1,
//         borderColor: COLORS.inputBorder,
//     },
//     otpButtonSpacing: {
//         marginBottom: 24,
//     },
//     primaryGradientButton: {
//         borderRadius: 16,
//         paddingVertical: 18,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     primaryButtonText: {
//         color: '#FFFFFF',
//         fontSize: 16,
//         fontWeight: '700',
//     },
//     otpCard: {
//         backgroundColor: '#F7F5FC',
//         borderRadius: 20,
//         padding: 20,
//         alignItems: 'center',
//         marginTop: 8,
//     },
//     otpCardTitle: {
//         fontSize: 13,
//         fontWeight: '600',
//         color: '#8E8E93',
//         marginBottom: 16,
//     },
//     otpInputsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '100%',
//         gap: 6,
//         marginBottom: 16,
//     },
//     otpBox: {
//         flex: 1,
//         aspectRatio: 0.9,
//         borderRadius: 12,
//         backgroundColor: '#FFFFFF',
//         textAlign: 'center',
//         fontSize: 20,
//         fontWeight: '700',
//         color: '#000000',
//         borderWidth: 1.5,
//     },
//     otpBoxEmpty: {
//         borderColor: '#EAEAEA',
//     },
//     otpBoxFilled: {
//         borderColor: '#D01CD6',
//     },
//     resendText: {
//         fontSize: 13,
//         fontWeight: '600',
//         color: '#8E8E93',
//     },
//     resendCountdown: {
//         color: '#D01CD6',
//         fontWeight: '700',
//     },
//     termsText: {
//         textAlign: 'center',
//         fontSize: 12,
//         color: '#A8A7AD',
//         paddingVertical: 16,
//         fontWeight: '400',
//     },
// });