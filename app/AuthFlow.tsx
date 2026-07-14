// import React, { useState, useRef } from 'react';
// import { TextInput } from 'react-native';
// import WelcomeScreen from './welcome';
// import PhoneAuthScreen from './PhoneAuthScreen'; // Assumes you have your Phone entry component here

// export default function AuthFlow() {
//     // 1. Core State tracking the current page view
//     const [step, setStep] = useState<'WELCOME' | 'PHONE_ENTRY' | 'OTP_VERIFY'>('WELCOME');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    
//     const otpRefs = useRef<Array<TextInput | null>>([]);

//     const handleOtpChange = (text: string, index: number) => {
//         const newOtp = [...otp];
//         newOtp[index] = text;
//         setOtp(newOtp);
//         if (text && index < 5) otpRefs.current[index + 1]?.focus();
//     };

//     const handleOtpKeyPress = (e: any, index: number) => {
//         if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
//             otpRefs.current[index - 1]?.focus();
//         }
//     };

//     // 2. Conditionally switch layouts depending on what step is active
//     if (step === 'WELCOME') {
//         return (
//             <WelcomeScreen 
//                 // Passing down concrete functions that change state!
//                 onGetStarted={() => setStep('PHONE_ENTRY')}
//                 onLogin={() => setStep('PHONE_ENTRY')}
//             />
//         );
//     }

//     return (
//         <PhoneAuthScreen 
//             step={step}
//             phoneNumber={phoneNumber}
//             setPhoneNumber={setPhoneNumber}
//             otp={otp}
//             otpRefs={otpRefs}
//             handleOtpChange={handleOtpChange}
//             handleOtpKeyPress={handleOtpKeyPress}
//             onSendOtp={() => setStep('OTP_VERIFY')}
//         />
//     );
// }