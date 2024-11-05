import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import CustomTextInput from './customTextInput';
import CustomText from './customText';
import {horizontalScale, moderateScale, verticalScale} from '../utils/Metrics';
import CustomButton from './customButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../utils/colors';
import OTPTextView from 'react-native-otp-textinput';
import FONTS from './fonts';

interface CheckOutModelProps {
  visible: boolean;
  onClose?: () => void;
  onPress: () => void;
}

const OrderSuccess: React.FC<CheckOutModelProps> = ({
  visible,
  onClose,
  onPress,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image
            style={{
              width: horizontalScale(150),
              height: verticalScale(150),
              resizeMode: 'contain',
              alignSelf: 'center',
              marginStart: horizontalScale(-20),
              marginTop:verticalScale(-50)
            }}
            source={require('../../assets/images/success.png')}
          />

          <Text style={styles.checkoutTextStyle}>
            {'Your Order has been placed'}
          </Text>

          <CustomButton
            title="Back to Home"
            onPress={onPress}
            buttonStyle={{
              marginTop: verticalScale(40),
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default OrderSuccess;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    // padding: verticalScale(20),
  },
  modalContent: {
    flex:1,
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(30),
    backgroundColor: 'white',
    justifyContent:'center'
    // borderRadius: moderateScale(20),
  },
  checkoutTextStyle: {
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
    fontSize: moderateScale(20),
    textAlign: 'center',
    marginTop: verticalScale(40),
  },
  txtLabel: {
    fontFamily: FONTS.MEDIUM,
    color: colors.GRAY,
    fontSize: moderateScale(14),
    flex: 1,
  },
  txtValueStyle: {
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
    fontSize: moderateScale(14),
  },
  txtFinalLabel: {
    fontFamily: FONTS.BOLD,
    color: colors.BLACK,
    fontSize: moderateScale(15),
    flex: 1,
  },
  txtFinalValueStyle: {
    fontFamily: FONTS.BOLD,
    color: colors.BLACK,
    fontSize: moderateScale(15),
  },
});
