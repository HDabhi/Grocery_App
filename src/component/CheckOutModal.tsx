import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../utils/colors';
import { horizontalScale, moderateScale, verticalScale } from '../utils/Metrics';
import CustomButton from './customButton';
import FONTS from './fonts';

interface CheckOutModelProps {
  visible: boolean;
  data: any;
  onClose: () => void;
  onPress: () => void;
}

const CheckOutModal: React.FC<CheckOutModelProps> = ({
  visible,
  data,
  onClose,
  onPress
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

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.checkoutTextStyle}>{'Checkout'}</Text>
            <Ionicons
              style={{alignSelf: 'flex-end'}}
              onPress={onClose}
              name="close-circle-outline"
              size={30}
              color={colors.TxtYellow}
            />
          </View>
          
          <View style={{flexDirection: 'row', marginTop: verticalScale(20)}}>
            <Text style={styles.txtLabel}>{'MRP'}</Text>
            <Text style={styles.txtValueStyle}>{'₹' + data?.totalWithoutDiscount}</Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.txtLabel}>{'Product Discount'}</Text>
            <Text style={styles.txtValueStyle}>{'-₹' + data?.discount}</Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.txtLabel}>{'Offer Discount'}</Text>
            <Text style={styles.txtValueStyle}>
              {'-₹' + data?.offerDiscount}
            </Text>
          </View>
          <View
            style={{
              height: verticalScale(1),
              backgroundColor: colors.BORDER_LINE,
              marginVertical: verticalScale(10),
            }}
          />
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.txtLabel}>{'Item Total'}</Text>
            <Text style={styles.txtValueStyle}>{'₹' + data?.sellingPrice}</Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.txtLabel}>{'Convenience Charge'}</Text>
            <Text style={styles.txtValueStyle}>{'₹' + data?.otherCharge}</Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.txtLabel}>{'Delivery Charge'}</Text>
            <Text style={styles.txtValueStyle}>
              {'₹' + data?.deliveryCharge}
            </Text>
          </View>

          

          {/* <View style={{flexDirection: 'row'}}>
            <Text style={styles.txtLabel}>
              {'GST (' + data?.gstByEkart + '%)'}
            </Text>
            <Text style={styles.txtValueStyle}>{'₹' + data?.gstValue}</Text>
          </View> */}

          <View
            style={{
              height: verticalScale(1),
              backgroundColor: colors.BORDER_LINE,
              marginVertical: verticalScale(10),
            }}
          />

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.txtFinalLabel}>{'Bill Total'}</Text>
            <Text style={styles.txtFinalValueStyle}>{'₹' + data?.finalPrice}</Text>
          </View>

          <CustomButton
            title="Place Order"
            onPress={onPress}
            buttonStyle={{
              marginVertical: verticalScale(14),
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CheckOutModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
    backgroundColor: 'white',
    borderRadius: moderateScale(20),
  },
  checkoutTextStyle: {
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
    fontSize: moderateScale(20),
    flex: 1,
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
