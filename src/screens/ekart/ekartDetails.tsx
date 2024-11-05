import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Modal,
  TextInput,
  Keyboard,
} from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import colors from '../../utils/colors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';
import FONTS from '../../component/fonts';
import moment from 'moment';
import {Order, OrderProduct} from '../../services/orderList/api';
import {useEffect, useState} from 'react';
import ListEmptyComponent from '../../component/listEmptyComponent';
import CustomText from '../../component/customText';
import {
  useGetOrderById,
  useOrderStatusUpdate,
} from '../../services/orderList/hooks';
import Toast from 'react-native-toast-message';
import CustomButton from '../../component/customButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Spinner from '../../component/spinner';
import CustomTextInput from '../../component/customTextInput';

export const EKartDetails: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {orderId} = route.params;
  console.log('orderId : ' + orderId);
  const mutationOrder = useGetOrderById();
  const mutationUpdateOrderStatus = useOrderStatusUpdate();

  const [productList, setProductList] = useState<OrderProduct[]>([]);
  const [orderData, setOrderData] = useState<Order>();
  const [orderType, setOrderType] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  const statusList = [
    {label: 'ON HOLD', value: 'ON_HOLD'},
    {label: 'OUT FOR DELIVERY', value: 'OUT_FOR_DELIVERY'},
    {label: 'PACKED', value: 'PACKED'},
    {label: 'DELIVERED', value: 'DELIVERED'},
  ];

  const convertToCustomFormat = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // If minutes are 60, represent it as 00:60
    const formattedMinutes =
      minutes === 60 ? '60' : minutes.toString().padStart(2, '0');
    const formattedHours = hours.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  };

  useEffect(() => {
    mutationOrder.mutate(orderId, {
      onSuccess: data => {
        // setIsLoading(false)
        console.log('order data : ' + JSON.stringify(data));
        if (data?.status && data?.statusCode == 200) {
          setOrderStatus(data?.data?.orderStatus);
          setOrderData(data?.data);
          setProductList(data?.data?.orderProductDtoList);
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
  }, [orderId]);

  const updateOrder = () => {
    const orderUpdateData = {
      orderStatus: orderStatus == '' ? orderData?.orderStatus : orderStatus,
      deliveryTime:
        deliveryTime == ''
          ? orderData?.deliveryTime
          : convertToCustomFormat(parseInt(deliveryTime)),
      orderCompletionStatus: orderData?.orderCompletionStatus,
      id: orderId,
    };

    console.log('orderUpdateData : ' + JSON.stringify(orderUpdateData));

    mutationUpdateOrderStatus.mutate(orderUpdateData, {
      onSuccess: data => {
        // setIsLoading(false)
        console.log('order update status : ' + JSON.stringify(data));
        if (data?.status && data?.statusCode == 200) {
          navigation.goBack();
          Toast.show({
            type: 'success',
            text1: 'Order Update successfully',
            visibilityTime: 4000,
          });
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

  const renderCartItem = (item: OrderProduct) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: verticalScale(20),
          paddingHorizontal: horizontalScale(10),
        }}>
        <View style={{width: horizontalScale(90), justifyContent: 'center'}}>
          <Image
            style={{
              width: horizontalScale(70),
              height: verticalScale(64),
              resizeMode: 'cover',
              borderRadius: moderateScale(10),
            }}
            source={{uri: item.imageUrl}}
          />
        </View>

        <View style={{flex: 1}}>
          {/* Product name and close icon */}
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <CustomText
                textStyle={{
                  fontSize: moderateScale(13),
                  color: colors.BLACK,
                  fontFamily: FONTS.SEMI_BOLD,
                }}>
                {item?.productName}
              </CustomText>

              {/* <CustomText
                textStyle={{
                  fontSize: moderateScale(11),
                  color: colors.GRAY,
                  fontFamily: FONTS.MEDIUM,
                }}>
                {''}
              </CustomText> */}

              <CustomText
                textStyle={{
                  fontSize: moderateScale(12),
                  color: colors.GRAY,
                  fontFamily: FONTS.MEDIUM,
                }}>
                {item.quantity + ' Qty X ' + '₹' + item.sellingPrice}
              </CustomText>
            </View>

            <View style={{justifyContent: 'center'}}>
              <CustomText
                textStyle={{
                  fontSize: moderateScale(14),
                  fontFamily: FONTS.SEMI_BOLD,
                  color: colors.BLACK,
                  textAlign: 'center',
                }}>
                {'₹' + item?.sellingPrice * item?.quantity}
              </CustomText>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <CustomHeader
        title="Orders Details"
        onBackPress={() => navigation.goBack()}
      />

      <Spinner visible={mutationUpdateOrderStatus?.isPending} />

      <View
        style={{
          flex: 1,
          paddingHorizontal: horizontalScale(12),
          paddingVertical: verticalScale(12),
        }}>
        <View
          style={{
            borderRadius: moderateScale(10),
            borderWidth: horizontalScale(1),
            borderColor: colors.BORDER_LINE,
            paddingHorizontal: horizontalScale(10),
            paddingVertical: verticalScale(10),
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[style.dateText, {flex: 1}]}>
              {'Order Id : ' + orderData?.orderId}
            </Text>
            <Text style={style.titleStyle}>
              {moment(orderData?.createdTime).fromNow()}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: verticalScale(4),
            }}>
            <Text style={[style.titleStyle, {flex: 1}]}>
              {'Payment : ' + orderData?.paymentType?.replaceAll('_', ' ')}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  style.titleStyle,
                  {
                    backgroundColor: colors.BORDER_LINE,
                    paddingVertical: verticalScale(2),
                    paddingHorizontal: horizontalScale(8),
                    borderRadius: moderateScale(7),
                    fontSize: moderateScale(12),
                    alignSelf: 'flex-start',
                    color: colors.BLACK,
                  },
                ]}>
                {orderData?.orderStatus?.replaceAll('_', ' ')}
              </Text>
            </View>
            {/* <Text style={style.amountStyle}>
              {'Amount : ' + '₹' + orderData.finalPrice}
            </Text> */}
          </View>

          <View
            style={{
              height: verticalScale(1),
              backgroundColor: colors.BORDER_LINE,
              marginVertical: verticalScale(6),
            }}
          />

          <View style={{flexDirection: 'row'}}>
            <Text style={style.txtLabel}>{'MRP'}</Text>
            <Text style={style.txtValueStyle}>
              {'₹' + orderData?.totalWithoutDiscount}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={style.txtLabel}>{'Product Discount'}</Text>
            <Text style={style.txtValueStyle}>
              {'-₹' + orderData?.discount}
            </Text>
          </View>

          {/* <View style={{flexDirection: 'row'}}>
            <Text style={style.txtLabel}>{'Offer Discount'}</Text>
            <Text style={style.txtValueStyle}>
              {'-₹' + orderData?.offerDiscount}
            </Text>
          </View> */}
          <View
            style={{
              height: verticalScale(1),
              backgroundColor: colors.BORDER_LINE,
              marginVertical: verticalScale(6),
            }}
          />
          <View style={{flexDirection: 'row'}}>
            <Text style={style.txtLabel}>{'Item Total'}</Text>
            <Text style={style.txtValueStyle}>{'₹' + orderData?.price}</Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={style.txtLabel}>{'Delivery Charge'}</Text>
            <Text style={style.txtValueStyle}>
              {'₹' + orderData?.deliveryCharges}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={style.txtLabel}>{'Convenience Charge'}</Text>
            <Text style={style.txtValueStyle}>
              {'₹' + orderData?.otherCharges}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={style.txtLabel}>{'Tax'}</Text>
            <Text style={style.txtValueStyle}>{'₹' + orderData?.gstValue}</Text>
          </View>

          {/* <View style={{flexDirection: 'row'}}>
            <Text style={style.txtLabel}>
              {'GST (' + orderData?.gstByEkart + '%)'}
            </Text>
            <Text style={style.txtValueStyle}>{'₹' + orderData?.gstValue}</Text>
          </View> */}

          <View
            style={{
              height: verticalScale(1),
              backgroundColor: colors.BORDER_LINE,
              marginVertical: verticalScale(6),
            }}
          />

          <View style={{flexDirection: 'row'}}>
            <Text style={style.txtFinalLabel}>{'Bill Total'}</Text>
            <Text style={style.txtFinalValueStyle}>
              {'₹' + orderData?.finalPrice}
            </Text>
          </View>
        </View>

        <View
          style={{
            borderRadius: moderateScale(10),
            borderWidth: horizontalScale(1),
            borderColor: colors.BORDER_LINE,
            paddingHorizontal: horizontalScale(10),
            marginTop: verticalScale(12),
            paddingTop: verticalScale(7),
          }}>
          <CustomTextInput
            isDropDown
            list={statusList}
            value={orderStatus}
            onChangeText={item => {
              setOrderStatus(item?.value);
            }}
            placeholder="Select Order Status"
          />

          <CustomTextInput
            value={deliveryTime}
            keyboardType="numeric"
            onChangeText={value => setDeliveryTime(value)}
            placeholder="Enter Delivery Time in minutes"
            returnKeyType="done"
          />
        </View>

        <View
          style={{
            flex: 1,
            borderRadius: moderateScale(10),
            borderWidth: horizontalScale(1),
            borderColor: colors.BORDER_LINE,
            marginTop: verticalScale(10),
          }}>
          <FlatList
            data={productList}
            renderItem={({item}) => renderCartItem(item)}
            keyExtractor={(item, index) => index}
            ListEmptyComponent={() => (
              <ListEmptyComponent title={'No any Product'} />
            )}
            ItemSeparatorComponent={props => {
              return (
                <View
                  style={{
                    height: verticalScale(1),
                    backgroundColor: colors.BORDER_LINE,
                    marginHorizontal: horizontalScale(10),
                  }}
                />
              );
            }}
          />
        </View>

        <View style={{paddingTop: moderateScale(10)}}>
          <CustomButton
            title={'Update Order'}
            onPress={() => updateOrder()}
            buttonStyle={{backgroundColor: colors.GREEN}}
          />
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  dateText: {
    fontSize: moderateScale(13),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
  },
  titleStyle: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
    marginTop: verticalScale(3),
  },
  amountStyle: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.BOLD,
    color: colors.BLACK,
    marginTop: verticalScale(6),
  },
  orderTextStyle: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.BOLD,
    color: colors.GREEN,
  },
  viewOrderViewStyle: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  txtLabel: {
    fontFamily: FONTS.MEDIUM,
    color: colors.GRAY,
    fontSize: moderateScale(12),
    flex: 1,
  },
  txtValueStyle: {
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
    fontSize: moderateScale(12),
  },
  txtFinalLabel: {
    fontFamily: FONTS.BOLD,
    color: colors.BLACK,
    fontSize: moderateScale(13),
    flex: 1,
  },
  txtFinalValueStyle: {
    fontFamily: FONTS.BOLD,
    color: colors.BLACK,
    fontSize: moderateScale(13),
  },
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
    fontSize: moderateScale(18),
    flex: 1,
  },
  textInput: {
    height: verticalScale(160), // You can customize the height
    borderColor: colors.LIGHT_GRAY,
    borderWidth: 1,
    borderRadius: moderateScale(10),
    padding: 10,
    fontSize: moderateScale(13),
    fontFamily: FONTS.MEDIUM,
    color: colors.BLACK,
    textAlignVertical: 'top',
    marginVertical: verticalScale(16),
  },
});
