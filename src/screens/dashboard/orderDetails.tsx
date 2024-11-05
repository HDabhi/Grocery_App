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
  Platform,
  PermissionsAndroid,
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
  useOrderCancelReturn,
  useUploadImage,
} from '../../services/orderList/hooks';
import Toast from 'react-native-toast-message';
import CustomButton from '../../component/customButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Spinner from '../../component/spinner';
import RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {checkTimeDifference, getDeliveryTime} from '../../utils/responsiveUI';
import Icon from 'react-native-vector-icons/Ionicons';
import {PhotoFile} from 'react-native-vision-camera';
import {CameraScreen} from '../../component/CameraScreen';
import ImageResizer from 'react-native-image-resizer';

export const OrderDetails: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {orderId} = route.params;
  const mutationOrder = useGetOrderById();
  const mutationOrderCancelReturn = useOrderCancelReturn();
  const mutationUploadImage = useUploadImage();

  const [productList, setProductList] = useState<OrderProduct[]>([]);
  const [orderData, setOrderData] = useState<Order>();
  const [orderType, setOrderType] = useState('');
  const [showCancelReturnModal, setShowCancelReturnModal] = useState(false);
  const [reason, setReason] = useState('');

  const [capturedPhoto, setCapturedPhoto] = useState<PhotoFile | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [compressedImageUri, setCompressedImageUri] = useState('');

  // Callback function to handle the captured photo
  const handleCapture = (photo: PhotoFile) => {
    setCapturedPhoto(photo); // Set the captured photo to state
    setShowCamera(false); // Hide the camera after capturing
    compressImage(photo?.path);
  };

  const compressImage = async (uri: string) => {
    try {
      const resizedImageUri = await ImageResizer.createResizedImage(
        uri,
        800,
        600,
        'JPEG',
        100,
      ); // Resize to 800x600 and set quality to 80%
      setCompressedImageUri(resizedImageUri.uri);
    } catch (error) {
      console.error('Error resizing image:', error);
    }
  };

  useEffect(() => {
    if (orderId) {
      mutationOrder.mutate(orderId, {
        onSuccess: data => {
          // setIsLoading(false)
          if (data?.status && data?.statusCode == 200) {
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
    }
  }, [orderId]);

  const renderCartItem = (item: OrderProduct) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('OrderProductDetails', {
            ekartId: orderData?.ekartId,
            productId: item?.productId,
          })
        }
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
                  width: horizontalScale(45),
                  textAlign: 'center',
                }}>
                {'₹' + item?.sellingPrice * item?.quantity}
              </CustomText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const orderCancelReturnRefund = (img?: string) => {
    const orderCancel = {
      reason: reason,
      orderId: orderId,
      orderStatus: orderType,
      image: img ? img : '-',
    };
    mutationOrderCancelReturn.mutate(orderCancel, {
      onSuccess: data => {
        // setIsLoading(false)
        if (data?.status && data?.statusCode == 200) {
          setShowCancelReturnModal(false);
          setTimeout(() => {
            navigation.goBack();

            Toast.show({
              type: 'success',
              text1:
                orderType == 'CANCELLED'
                  ? 'Cancel Order request initiated'
                  : orderType == 'RETURNED'
                  ? 'Exchange Order request initiated'
                  : 'Refund Order request initiated',
              visibilityTime: 4000,
            });
          }, 200);
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

  const downloadFile = () => {
    let dirs = ReactNativeBlobUtil.fs.dirs;
    ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt: 'pdf',
      path: `${dirs.DownloadDir}/FarmSanta Invoice`,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: 'FarmSanta_Invoice_' + orderData?.orderId,
        description: 'File downloaded by download manager.',
        mime: 'application/pdf',
      },
    })
      .fetch('GET', orderData?.invoiceUrl ?? '')
      .then(res => {
        Toast.show({
          type: 'success',
          text1: 'Invoice downloaded successfully',
          visibilityTime: 4000,
        });
        // in iOS, we want to save our files by opening up the saveToFiles bottom sheet action.
        // whereas in android, the download manager is handling the download for us.
        // if (Platform.OS === 'ios') {
        //   const filePath = res.path();
        //   let options = {
        //     type: 'application/pdf',
        //     url: filePath,
        //     saveToFiles: true,
        //   };
        //   Share.open(options)
        //     .then((resp) => console.log(resp))
        //     .catch((err) => console.log(err));
        // }
      })
      .catch(err => console.log('BLOB ERROR -> ', err));
  };

  const uploadImagefromSever = () => {
    const fileUri = compressedImageUri;
    const fileName = capturedPhoto?.path.split('/').pop();
    const fileType = 'image/jpeg';

    const myFormData = new FormData();
    myFormData.append('file', {
      uri: fileUri,
      name: fileName, // Adjust the name as necessary
      type: fileType, // Adjust the type as necessary
    });

    mutationUploadImage.mutate(myFormData, {
      onSuccess: data => {
        // setIsLoading(false)
        orderCancelReturnRefund(data);
      },
      onError: error => {
        console.log('upload image error : ' + JSON.stringify(error));
      },
    });
  };

  return (
    <View style={{flex: 1}}>
      {showCamera ? (
        <CameraScreen onCapture={handleCapture} />
      ) : (
        <View style={{flex: 1, backgroundColor: colors.WHITE}}>
          {orderData?.invoiceUrl ? (
            <CustomHeader
              title="Orders Details"
              onBackPress={() => navigation.goBack()}
              onFileDownloadPress={() => downloadFile()}
            />
          ) : (
            <CustomHeader
              title="Orders Details"
              onBackPress={() => navigation.goBack()}
            />
          )}

          <Spinner
            visible={
              mutationOrderCancelReturn?.isPending ||
              mutationOrder?.isPending ||
              mutationUploadImage?.isPending
            }
          />

          {/* {orderData?.orderStatus == 'CANCELLED' && orderData?.paymentType?.replaceAll('_', ' ') == "ONLINE" && (
            <Text
              style={[
                style.titleStyle,
                {
                  backgroundColor: colors.BORDER_LINE,
                  paddingVertical: verticalScale(8),
                  paddingHorizontal: horizontalScale(8),
                  borderRadius: moderateScale(7),
                  fontSize: moderateScale(13),
                  color: colors.BLACK,
                  marginTop: verticalScale(10),
                  marginHorizontal: horizontalScale(12),
                },
              ]}>
              {
                'Please wait while we are working on your issue with the information you have provided. This may take few minutes. We appreciate your patience.'
              }
            </Text>
          )} */}

          {orderData?.orderStatus == 'RETURNED' && (
            <Text
              style={[
                style.titleStyle,
                {
                  backgroundColor: colors.BORDER_LINE,
                  paddingVertical: verticalScale(8),
                  paddingHorizontal: horizontalScale(8),
                  borderRadius: moderateScale(7),
                  fontSize: moderateScale(13),
                  color: colors.BLACK,
                  marginTop: verticalScale(10),
                  marginHorizontal: horizontalScale(12),
                },
              ]}>
              {orderData?.returnCompletionStatus == 'PENDING' &&
                'Please wait while we are working on your issue with the information you have provided. This may take few minutes. We appreciate your patience.'}
              {orderData?.returnCompletionStatus == 'OUT_FOR_PICKUP' &&
                'Out for Pickup and redeliver'}
              {orderData?.returnCompletionStatus == 'PICKED' &&
                '⁠Pickup completed'}
              {orderData?.returnCompletionStatus == 'COMPLETED' &&
                '⁠Material Exchanged'}
            </Text>
          )}

          {orderData?.orderStatus == 'REFUNDED' && (
            <Text
              style={[
                style.titleStyle,
                {
                  backgroundColor: colors.BORDER_LINE,
                  paddingVertical: verticalScale(8),
                  paddingHorizontal: horizontalScale(8),
                  borderRadius: moderateScale(7),
                  fontSize: moderateScale(13),
                  color: colors.BLACK,
                  marginTop: verticalScale(10),
                  marginHorizontal: horizontalScale(12),
                },
              ]}>
              {orderData?.returnCompletionStatus == 'PENDING' &&
                'Please wait while we are working on your issue with the information you have provided. This may take few minutes. We appreciate your patience.'}
              {orderData?.returnCompletionStatus == 'OUT_FOR_PICKUP' &&
                'Refund Initiated'}
              {orderData?.returnCompletionStatus == 'PICKED' &&
                'Refund will be credited in your account in 3-5 working days.'}
              {orderData?.returnCompletionStatus == 'COMPLETED' &&
                '⁠Refund Credited Successfully'}
            </Text>
          )}

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
              {orderData?.deliveryTime != null &&
                orderData?.orderCompletionStatus != 'COMPLETED' && (
                  <Text style={[style.dateTimeText]}>
                    {getDeliveryTime(orderData?.deliveryTime)}
                  </Text>
                )}

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[style.dateText, {flex: 1}]}>
                  {'Order Id: ' + orderData?.orderId}
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
                  {'Payment: ' + orderData?.paymentType?.replaceAll('_', ' ')}
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
                    {orderData?.orderStatus?.replaceAll('_', ' ') == 'RETURNED'
                      ? 'EXCHANGE'
                      : orderData?.orderStatus?.replaceAll('_', ' ')}
                  </Text>
                </View>
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
                <Text style={style.txtValueStyle}>
                  {'₹' + orderData?.price}
                </Text>
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
                <Text style={style.txtValueStyle}>
                  {'₹' + orderData?.gstValue}
                </Text>
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

            <FlatList
              contentContainerStyle={{
                flex: 1,
                borderRadius: moderateScale(10),
                borderWidth: horizontalScale(1),
                borderColor: colors.BORDER_LINE,
                marginTop: verticalScale(10),
              }}
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

            {(orderData?.orderStatus == 'PENDING' ||
              orderData?.orderStatus == 'PROCESSING') && (
              <View style={{paddingVertical: moderateScale(10)}}>
                <CustomButton
                  title={'Cancel Order'}
                  onPress={() => {
                    setOrderType('CANCELLED');
                    setShowCancelReturnModal(true);
                  }}
                  buttonStyle={{backgroundColor: colors.RED}}
                />
              </View>
            )}

            {(orderData?.orderStatus == 'COMPLETED' ||
              orderData?.orderStatus == 'DELIVERED') &&
              !checkTimeDifference(orderData.updatedTime ?? '') && (
                <View
                  style={{
                    paddingVertical: moderateScale(10),
                    flexDirection: 'row',
                    gap: verticalScale(10),
                  }}>
                  <CustomButton
                    title={'Exchange Order'}
                    onPress={() => {
                      setOrderType('RETURNED');
                      setShowCancelReturnModal(true);
                    }}
                    buttonStyle={{backgroundColor: colors.TxtYellow, flex: 1}}
                  />

                  <CustomButton
                    title={'Refund Order'}
                    onPress={() => {
                      setOrderType('REFUNDED');
                      setShowCancelReturnModal(true);
                    }}
                    buttonStyle={{backgroundColor: colors.GREEN, flex: 1}}
                  />
                </View>
              )}

            <Modal
              visible={showCancelReturnModal}
              transparent={true}
              animationType="slide">
              <View style={style.modalContainer}>
                <View style={style.modalContent}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={style.checkoutTextStyle}>
                      {orderType == 'CANCELLED'
                        ? 'Cancel Order'
                        : orderType == 'RETURNED'
                        ? 'Exchange Order'
                        : 'Refund Order'}
                    </Text>
                    <Ionicons
                      style={{alignSelf: 'flex-end'}}
                      onPress={() => setShowCancelReturnModal(false)}
                      name="close-circle-outline"
                      size={30}
                      color={colors.TxtYellow}
                    />
                  </View>

                  <TextInput
                    style={style.textInput}
                    multiline={true}
                    numberOfLines={5} // Set the visible number of lines
                    value={reason}
                    onChangeText={setReason}
                    placeholder="Enter a reason"
                    placeholderTextColor={colors.GRAY}
                    onBlur={() => Keyboard.dismiss()}
                    // textAlignVertical="top" // Align text to the top-left corner
                  />

                  {orderType != 'CANCELLED' && (
                    <View
                      style={{
                        borderColor: colors.LIGHT_GRAY,
                        borderWidth: 1,
                        borderRadius: moderateScale(10),
                        marginBottom: verticalScale(10),
                        padding: verticalScale(10),
                      }}>
                      {capturedPhoto ? (
                        <View>
                          <Image
                            source={{uri: `file://${capturedPhoto.path}`}}
                            style={style.capturedImage}
                            resizeMode="contain"
                          />
                          <TouchableOpacity
                            style={{position: 'absolute', right: 0, bottom: 0}}
                            onPress={() => setShowCamera(true)}>
                            <Icon
                              name="camera"
                              size={verticalScale(30)}
                              color={colors.GREEN}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={{alignSelf: 'center'}}
                          onPress={() => setShowCamera(true)}>
                          <Icon
                            name="camera"
                            size={verticalScale(50)}
                            color={colors.GREEN}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  <CustomButton
                    disabled={
                      orderType == 'CANCELLED'
                        ? reason == ''
                          ? true
                          : false
                        : reason == '' || capturedPhoto == null
                        ? true
                        : false
                    }
                    title={'Submit'}
                    onPress={() => {
                      if (capturedPhoto != null) {
                        uploadImagefromSever();
                      } else {
                        orderCancelReturnRefund();
                      }
                    }}
                  />
                </View>
              </View>
            </Modal>
          </View>
        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  dateText: {
    fontSize: moderateScale(14),
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
  dateTimeText: {
    fontSize: moderateScale(13),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
    marginBottom: verticalScale(2),
  },
  capturedImage: {
    width: horizontalScale(200),
    height: verticalScale(200), // Adjust as per your need
    resizeMode: 'cover',
    alignSelf: 'center',
  },
});
