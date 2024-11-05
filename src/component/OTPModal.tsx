import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import CustomTextInput from './customTextInput';
import CustomText from './customText';
import {horizontalScale, moderateScale, verticalScale} from '../utils/Metrics';
import CustomButton from './customButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../utils/colors';
import OTPTextView from 'react-native-otp-textinput';
import FONTS from './fonts';

interface OTPModalProps {
  otpText: string;
  visible: boolean;
  onSubmitOTP: (otp: string) => void;
  onResendOTP: () => void;
  onClose: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({
  otpText,
  visible,
  onSubmitOTP,
  onResendOTP,
  onClose,
}) => {
  const [otp, setOtp] = useState<string>('');
  const [errorOtp, setErrorOtp] = useState<string>('');
  const [timer, setTimer] = useState<number>(30);

  useEffect(() => {
    if (visible) {
      setOtp(''); // Clear OTP input when modal is opened
      setTimer(30); // Reset timer
    }
  }, [visible]);

  // Timer for OTP resend button
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = () => {
    if (otp.length === 6) {
      onSubmitOTP(otp);
    } else {
      setErrorOtp('Please enter a 6-digit OTP.');
      // Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Ionicons
            style={{alignSelf: 'flex-end'}}
            onPress={onClose}
            name="close-circle-outline"
            size={30}
            color={colors.TxtYellow}
          />

          <CustomText
            textStyle={{
              textAlign: 'center',
              marginBottom: moderateScale(20),
              fontFamily: FONTS.BOLD,
              fontSize: moderateScale(18),
              color: colors.GRAY,
            }}>
            {'OTP Verification : ' + otpText}
          </CustomText>

          {/* <CustomTextInput
                        label=""
                        value={otp}
                        maxLength={6}
                        keyboardType="numeric"
                        onChangeText={setOtp}
                        placeholder="Enter OTP"
                        error={errorOtp}
                        style={{ marginTop: verticalScale(12) }}
                    /> */}

          <OTPTextView
            containerStyle={styles.textInputContainer}
            textInputStyle={styles.roundedTextInput}
            inputCount={6}
            inputCellLength={1}
            tintColor={colors.GREEN}
            handleTextChange={value => setOtp(value)}
          />

          <CustomButton title="Submit" onPress={handleSubmit} />

          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              marginTop: verticalScale(14),
              marginBottom: verticalScale(6),
            }}
            disabled={timer > 0}
            onPress={() => {
              onResendOTP();
              setTimer(30); // Reset the timer after resending
            }}>
            <CustomText
              textStyle={timer > 0 ? styles.resendDisabled : styles.resendText}>
              Resend OTP {timer > 0 ? `in ${timer}s` : ''}
            </CustomText>
            {/* <Text style={timer > 0 ? styles.resendDisabled : styles.resendText}>
                            Resend OTP {timer > 0 ? `in ${timer}s` : ''}
                        </Text> */}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default OTPModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
    backgroundColor: 'white',
    borderRadius: 10,
    // alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 20,
  },
  submitText: {
    color: 'white',
    fontSize: 16,
  },
  resendText: {
    color: '#007BFF',
    fontSize: moderateScale(14),
    fontFamily: FONTS.MEDIUM,
  },
  resendDisabled: {
    color: '#AAA',
    fontSize: moderateScale(14),
    fontFamily: FONTS.MEDIUM,
  },
  closeButton: {
    marginTop: 20,
  },
  closeText: {
    color: '#FF0000',
    fontSize: 16,
  },
  textInputContainer: {
    marginBottom: 20,
  },
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: moderateScale(2),
    width: horizontalScale(40),
    height: verticalScale(40),
    fontSize: moderateScale(14),
  },
});
