import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import Toast from 'react-native-toast-message';
import CheckBox from '../../component/CheckBox';
import CustomButton from '../../component/customButton';
import CustomHeader from '../../component/CustomHeader';
import FONTS from '../../component/fonts';
import OrderSuccess from '../../component/OrderSuccess';
import Spinner from '../../component/spinner';
import { UserAddress } from '../../services/address/api';
import { useGetAddressById } from '../../services/address/hooks';
import {
  useGenerateRazorpayOrderId,
  useGetCartList,
  usePlaceCartOrder,
  useUpdatePaymentStatus,
} from '../../services/cartList/hooks';
import { useGetUser } from '../../services/createUser/hooks';
import { useAuth } from '../../stores/auth';
import colors from '../../utils/colors';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';

export const PlaceOrder: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {cartData} = route.params;
  const {cartId} = useAuth.getState();
  const {data: userData} = useGetUser();

  const mutationPlaceCartOrder = usePlaceCartOrder();
  const mutationGenerateRazorpayOrderId = useGenerateRazorpayOrderId();
  const mutationUpdatePaymentStatus = useUpdatePaymentStatus();

  const {data: addressData, error, isLoading, refetch} = useGetAddressById();
  const {refetch: cartRefetch} = useGetCartList();

  const [address, setAddress] = useState<UserAddress>();
  const [isOrderSuccess, setIsOrderSuccessVisible] = useState(false);
  const [isCOD, setIsCOD] = useState(true);
  const [razorpayOrderId, setRazorpayOrderId] = useState('');
  const [razorpayPaymentId, setRazorpayPaymentId] = useState('');
  const [isTermCondition, setIsTermCondition] = useState(false);
  const [userInformation, setUserInformation] = useState('');

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  useEffect(() => {
    if (addressData) {
      if (addressData.status && addressData.statusCode === 200) {
        setAddress(addressData?.data);
      } else {
        Toast.show({
          type: 'error',
          text1: addressData?.message,
          visibilityTime: 4000,
        });
      }
    }
  }, [addressData]);

  useEffect(() => {
    if (userData) {
      if (userData.status && userData.statusCode === 200) {
        setUserInformation(userData.data);
      } else {
        setUserInformation('');
      }
    }
  }, [userData]);

  const checkoutCarOrder = () => {
    mutationPlaceCartOrder.mutate('CASH_ON_DELIVERY', {
      onSuccess: data => {
        // setIsLoading(false)
        if (data?.status && data?.statusCode == 200) {
          cartRefetch();
          setIsOrderSuccessVisible(true);
        } else {
          Toast.show({
            type: 'error',
            text1: data?.message,
            visibilityTime: 4000,
          });
        }
        // navio.push('AddOrganization')
      },
      onError: error => {
        // setIsLoading(false)
        console.log('order error : ' + JSON.stringify(error));
      },
    });
  };

  const checkoutRazorpayCarOrder = (
    razorOrderId,
    razorPaymentId,
    razorSignature,
  ) => {
    mutationPlaceCartOrder.mutate('ONLINE', {
      onSuccess: data => {
        // setIsLoading(false)
        if (data?.status && data?.statusCode == 200) {
          updatePaymentStatus(
            data?.data?.id,
            razorOrderId,
            razorPaymentId,
            razorSignature,
          );
        } else {
          Toast.show({
            type: 'error',
            text1: data?.message,
            visibilityTime: 4000,
          });
        }
        // navio.push('AddOrganization')
      },
      onError: error => {
        // setIsLoading(false)
        console.log('order error : ' + JSON.stringify(error));
      },
    });
  };

  const generateOrderId = amount => {
    const finalAmount = parseInt(amount * 100);
    mutationGenerateRazorpayOrderId.mutate(finalAmount, {
      onSuccess: data => {
        // setIsLoading(false)
        if (data?.status && data?.statusCode == 200) {
          onlineOrderRazorpay(amount, data?.data?.id);
        } else {
          Toast.show({
            type: 'error',
            text1: data?.message,
            visibilityTime: 4000,
          });
        }
        // navio.push('AddOrganization')
      },
      onError: error => {
        // setIsLoading(false)
        console.log('order error : ' + JSON.stringify(error));
      },
    });
  };

  const onlineOrderRazorpay = (Amount, id) => {
    var options = {
      // description: 'Credits towards consultation',
      // image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      // key: 'rzp_test_JVJ65uYMuN9rIh', // test api key
      key: 'rzp_live_aUaGzjWJHTAKvi', // Live api key
      order_id: id,
      amount: Amount,
      name: userInformation?.name,
      prefill: {
        email: userInformation?.email,
        contact: userInformation?.phone,
        name: userInformation?.name,
      },
      theme: {color: colors.GREEN},
    };
    RazorpayCheckout.open(options)
      .then(data => {
        setTimeout(() => {
          checkoutRazorpayCarOrder(
            data?.razorpay_order_id,
            data?.razorpay_payment_id,
            data?.razorpay_signature,
          );
        }, 100);

        // alert(`Success: ${data.razorpay_payment_id}`);
      })
      .catch(error => {
        if (error?.error.reason == 'payment_error') {
          Toast.show({
            type: 'error',
            text1: 'Payment Failed',
            visibilityTime: 4000,
          });
        }
        // handle failure
        // alert(`Error: ${error.code} | ${error.description}`);
      });
  };

  const updatePaymentStatus = (
    orderid,
    razorOrderId,
    razorPaymentId,
    razorSignature,
  ) => {

    const paymentData = {
      orderId: orderid,
      razorpay_payment_id: razorPaymentId,
      razorpay_order_id: razorOrderId,
      razorpay_signature: razorSignature,
    };

    mutationUpdatePaymentStatus.mutate(paymentData, {
      onSuccess: data => {
        if (data?.status && data?.statusCode == 200) {
          cartRefetch();
          setIsOrderSuccessVisible(true);
        } else {
          Toast.show({
            type: 'error',
            text1: data?.message,
            visibilityTime: 4000,
          });
        }
        // navio.push('AddOrganization')
      },
      onError: error => {
        // setIsLoading(false)
        console.log('order error : ' + JSON.stringify(error));
      },
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <Spinner visible={mutationPlaceCartOrder.isPending} />
      <CustomHeader
        onBackPress={() => navigation.goBack()}
        title="Place Order"
      />

      <View style={styles.modalContent}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.txtLabel}>{'MRP'}</Text>
          <Text style={styles.txtValueStyle}>
            {'₹' + cartData?.totalWithoutDiscount}
          </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text style={styles.txtLabel}>{'Product Discount'}</Text>
          <Text style={styles.txtValueStyle}>{'-₹' + cartData?.discount}</Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text style={styles.txtLabel}>{'Offer Discount'}</Text>
          <Text style={styles.txtValueStyle}>
            {'-₹' + cartData?.offerDiscount}
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
          <Text style={styles.txtValueStyle}>
            {'₹' + cartData?.sellingPrice}
          </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text style={styles.txtLabel}>{'Convenience Charge'}</Text>
          <Text style={styles.txtValueStyle}>
            {'₹' + cartData?.otherCharge}
          </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text style={styles.txtLabel}>{'Delivery Charge'}</Text>
          <Text style={styles.txtValueStyle}>
            {'₹' + cartData?.deliveryCharge}
          </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text style={styles.txtLabel}>{'Tax'}</Text>
          <Text style={styles.txtValueStyle}>{'₹' + cartData?.gstValue}</Text>
        </View>

        {/* <View style={{flexDirection: 'row'}}>
            <Text style={styles.txtLabel}>
              {'GST (' + cartData?.gstByEkart + '%)'}
            </Text>
            <Text style={styles.txtValueStyle}>{'₹' + cartData?.gstValue}</Text>
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
          <Text style={styles.txtFinalValueStyle}>
            {'₹' + cartData?.finalPrice}
          </Text>
        </View>
      </View>

      <View style={styles.modalContent}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.txtFinalLabel}>{'Payment Mode'}</Text>
        </View>

        <View style={{flexDirection: 'row', marginTop: verticalScale(10)}}>
          <TouchableOpacity
            onPress={() => setIsCOD(true)}
            style={styles.radioCircle}>
            <View style={[isCOD && styles.selectedRadioCircle]} />
          </TouchableOpacity>
          <Text style={styles.txtdeliveryStatus}>{'Cash on delivery'}</Text>
        </View>

        <View style={{flexDirection: 'row', marginTop: verticalScale(16)}}>
          <TouchableOpacity
            onPress={() => setIsCOD(false)}
            style={styles.radioCircle}>
            <View style={[!isCOD && styles.selectedRadioCircle]} />
          </TouchableOpacity>
          <Text style={styles.txtdeliveryStatus}>{'Online'}</Text>
        </View>
      </View>

      {address && (
        <View style={styles.modalContent}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.txtFinalLabel}>{'Delivery Address'}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddressList')}>
              <Text style={styles.txtChnageAddress}>{'Change'}</Text>
            </TouchableOpacity>
          </View>

          <View style={{marginTop: verticalScale(10)}}>
            <Text style={styles.dateText}>
              {address?.houseNumber + ', ' + address.street}
            </Text>

            <Text style={styles.dateText}>
              {address.city + ', ' + address.state + ', ' + address.pincode}
            </Text>
          </View>
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingHorizontal: horizontalScale(16),
          paddingTop: verticalScale(14),
        }}>
        <CheckBox
          label={''}
          value={isTermCondition}
          onChange={newValue => setIsTermCondition(!isTermCondition)}
          checkedColor={colors.GREEN}
          uncheckedColor={colors.GRAY}
        />

        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          <Text style={styles.txtTerm}>{"I've read and accept the "}</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('TermCondition')}>
            <Text style={styles.txtTermUnderline}>{'Terms Conditions '}</Text>
          </TouchableOpacity>

          <Text style={styles.txtTerm}>{'& '}</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('PrivacyPolicy')}>
            <Text style={styles.txtTermUnderline}>{'Privacy Policy'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CustomButton
        disabled={isTermCondition ? false : true}
        title="Place Order"
        onPress={() => {
          isCOD ? checkoutCarOrder() : generateOrderId(cartData?.finalPrice);
        }}
        buttonStyle={{
          marginTop: verticalScale(30),
          marginHorizontal: horizontalScale(20),
        }}
      />

      <OrderSuccess
        visible={isOrderSuccess}
        onClose={() => {
          setIsOrderSuccessVisible(false)
          navigation.navigate('Shop');
        } }
        onPress={() => {
          setIsOrderSuccessVisible(false);
          navigation.navigate('Shop');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    marginTop: verticalScale(20),
    marginHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(16),
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: colors.BORDER_LINE,
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
  txtChnageAddress: {
    fontFamily: FONTS.BOLD,
    color: 'blue',
    fontSize: moderateScale(15),
  },
  txtFinalValueStyle: {
    fontFamily: FONTS.BOLD,
    color: colors.BLACK,
    fontSize: moderateScale(15),
  },
  dateText: {
    fontSize: moderateScale(13),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
  },
  txtdeliveryStatus: {
    fontSize: moderateScale(13),
    fontFamily: FONTS.MEDIUM,
    color: colors.GREEN,
    marginStart: horizontalScale(10),
  },
  radioCircle: {
    height: horizontalScale(20),
    width: horizontalScale(20),
    borderRadius: horizontalScale(10),
    borderWidth: horizontalScale(2),
    borderColor: colors.GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioCircle: {
    backgroundColor: colors.GREEN,
    height: horizontalScale(12),
    width: horizontalScale(12),
    borderRadius: horizontalScale(6),
  },
  txtTerm: {
    fontSize: moderateScale(13),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
    marginStart: horizontalScale(6),
  },
  txtTermUnderline: {
    textDecorationLine: 'underline',
    fontSize: moderateScale(13),
    fontFamily: FONTS.BOLD,
    color: colors.GREEN,
  },
});
