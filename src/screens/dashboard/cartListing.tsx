import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { default as MinusIcon, default as PlusIcon } from 'react-native-vector-icons/Feather';
import CloseIcon from 'react-native-vector-icons/Ionicons';
import CheckOutModal from '../../component/CheckOutModal';
import CustomButton from '../../component/customButton';
import CustomHeader from '../../component/CustomHeader';
import CustomText from '../../component/customText';
import FONTS from '../../component/fonts';
import ListEmptyComponent from '../../component/listEmptyComponent';
import OrderSuccess from '../../component/OrderSuccess';
import Spinner from '../../component/spinner';
import {
  useGetCartList,
  usePlaceCartOrder,
  useRemoveCartItem,
  useUpdateCartItem,
} from '../../services/cartList/hooks';
import { useAuth } from '../../stores/auth';
import colors from '../../utils/colors';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';
import { isStoreOpen } from '../../utils/responsiveUI';

interface CartItem {
  cartItemId: string;
  mrp: number;
  sellingPrice: number;
  selfLife: string;
  expiryDate: string;
  sellingUom: string;
  productName: string;
  categoryName: string | null;
  categoryId: string;
  productId: string;
  imageUrl: string;
  subCategoryName: string | null;
  subCategoryId: string;
  quantity: number;
}

export const CartListing: React.FC = () => {
  const isFocus = useIsFocused();
  const navigation = useNavigation();

  const {data: cartData, isLoading, error, refetch} = useGetCartList();
  const {changeCartCount} = useAuth.use.actions();
  const {cartId, storeClosingMsg} = useAuth.getState();
  const mutationRemoveCartItem = useRemoveCartItem();
  const mutationUpdateCartItem = useUpdateCartItem();
  const mutationPlaceCartOrder = usePlaceCartOrder();

  const [cartList, setCartList] = useState<CartItem[]>([]);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
  const [isOrderSuccess, setIsOrderSuccessVisible] = useState(false);
  const [outOfStockList, setIsOutOfStock] = useState([]);
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  useEffect(() => {
    if (cartData) {
      if (cartData.status && cartData.statusCode === 200) {
        changeCartCount(cartData?.data?.cartProducts?.length);
        setCartList(cartData?.data?.cartProducts);
        setOpeningTime(cartData?.data?.openingTime);
        setClosingTime(cartData?.data?.closingTime);
        const outofstock = cartData?.data?.cartProducts.filter(
          item => item.availableQuantity < item.quantity,
        );
        setIsOutOfStock(outofstock);
      } else {
        setCartList([]);
        changeCartCount(0);
      }
    }
  }, [cartData]);

  const removeItemFromCart = id => {
    mutationRemoveCartItem.mutate(id, {
      onSuccess: data => {
        // setIsLoading(false)
        if (data?.status && data?.statusCode == 200) {
          Toast.show({
            type: 'success',
            text1: 'Removed',
            text2: 'Product remove from cart',
          });
          refetch();
          // setProductList(data?.data);
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
        console.log('remove cart error : ' + JSON.stringify(error));
      },
    });
  };

  const checkoutCarOrder = () => {
    mutationPlaceCartOrder.mutate(cartId, {
      onSuccess: data => {
        // setIsLoading(false)
        if (data?.status && data?.statusCode == 200) {
          setIsOrderSuccessVisible(true);
          refetch();
          // setProductList(data?.data);
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

  const updateQuantity = (cartItemId, newQuantity) => {
    // const list = cartList.map(product =>
    //   product.cartItemId === cartItemId
    //     ? {...product, quantity: newQuantity}
    //     : product,
    // );

    // setCartList(list);

    const cartItem = {
      cartItemId: cartItemId,
      quantity: newQuantity,
    };

    mutationUpdateCartItem.mutate(cartItem, {
      onSuccess: data => {
        // setIsLoading(false)
        if (data?.status && data?.statusCode == 200) {
          refetch();
          // setProductList(data?.data);
        } else {
          Toast.show({
            type: 'error',
            text1: data?.message,
            visibilityTime: 4000,
          });
        }
      },
      onError: error => {
        // setIsLoading(false)
        console.log('update cart error : ' + JSON.stringify(error));
      },
    });
  };

  const renderCartItem = (item: CartItem) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginVertical: verticalScale(7),
          paddingVertical: verticalScale(10),
        }}>
        <View style={{width: horizontalScale(90), justifyContent: 'center'}}>
          <Image
            style={{
              width: horizontalScale(70),
              height: verticalScale(64),
              resizeMode: 'cover',
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

              <CustomText
                textStyle={{
                  fontSize: moderateScale(11),
                  color: colors.GRAY,
                  fontFamily: FONTS.MEDIUM,
                }}>
                {item?.sellingUomQuantity + ' ' + item?.sellingUomName}
              </CustomText>
            </View>
            <TouchableOpacity
              onPress={() => removeItemFromCart(item?.cartItemId)}>
              <CloseIcon
                name="close-outline"
                size={verticalScale(28)}
                color={colors.GRAY}
              />
            </TouchableOpacity>
          </View>

          {/* Plus & Minus Symbol and Product Price */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: verticalScale(20),
              alignItems: 'center',
            }}>
            {item.availableQuantity < item.quantity ? (
              <View
                style={{
                  width: horizontalScale(110),
                  backgroundColor: colors.RED,
                  borderRadius: horizontalScale(6),
                  height: verticalScale(30),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={style.outOfStockStyle}>{'Out of stock'}</Text>
              </View>
            ) : (
              <View
                style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <TouchableOpacity
                  onPress={() =>
                    item.quantity != 1 &&
                    updateQuantity(item.cartItemId, item.quantity - 1)
                  }
                  style={style.plusMinusIconView}>
                  <MinusIcon
                    name="minus"
                    size={verticalScale(22)}
                    color={colors.BLACK}
                  />
                </TouchableOpacity>
                <CustomText
                  textStyle={{
                    fontSize: moderateScale(13),
                    fontFamily: FONTS.SEMI_BOLD,
                    width: horizontalScale(45),
                    color: colors.BLACK,
                    textAlign: 'center',
                  }}>
                  {item?.quantity}
                </CustomText>
                <TouchableOpacity
                  onPress={() => {
                    if (item.quantity == item.availableQuantity) {
                      Toast.show({
                        type: 'error',
                        text1: ``,
                        text2: `You’ve selected more items than available in stock. Current available quantity: ${item.availableQuantity}`,
                        visibilityTime: 4000,
                      });
                    } else {
                      updateQuantity(item.cartItemId, item.quantity + 1);
                    }
                  }}
                  style={style.plusMinusIconView}>
                  <PlusIcon
                    name="plus"
                    size={verticalScale(22)}
                    color={colors.GREEN}
                  />
                </TouchableOpacity>
              </View>
            )}

            <View style={{flex: 1}}>
              <CustomText
                textStyle={{
                  fontSize: moderateScale(14),
                  fontFamily: FONTS.SEMI_BOLD,
                  color: colors.BLACK,
                  textAlign: 'right',
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
      <Spinner
        visible={
          mutationPlaceCartOrder.isPending ||
          mutationRemoveCartItem.isPending ||
          isLoading
        }
      />
      <CustomHeader title="My Cart" />

      <FlatList
        contentContainerStyle={{marginHorizontal: horizontalScale(20), flex: 1}}
        data={cartList}
        renderItem={({item}) => renderCartItem(item)}
        keyExtractor={(item, index) => index}
        ListEmptyComponent={() => (
          <ListEmptyComponent title={'Cart is empty'} />
        )}
        ItemSeparatorComponent={props => {
          return (
            <View
              style={{
                height: verticalScale(1),
                backgroundColor: colors.BORDER_LINE,
              }}
            />
          );
        }}
      />

      {cartList.length > 0 && (
        <CustomButton
          disabled={outOfStockList.length > 0 ? true : false}
          title="Go to Checkout"
          onPress={() => {
            if (!isStoreOpen(openingTime, closingTime)) {
              Alert.alert(
                'Store is closed',
                storeClosingMsg?.replace(
                  '__TIME__',
                  moment(openingTime, 'HH:mm').format('hh:mm A'),
                ),
              );
            } else {
              navigation.navigate('PlaceOrder', {cartData: cartData?.data});
            }
          }}
          buttonStyle={{
            marginHorizontal: horizontalScale(20),
            marginVertical: verticalScale(10),
          }}
        />
      )}

      <CheckOutModal
        visible={isCheckoutVisible}
        data={cartData?.data}
        onClose={() => setIsCheckoutVisible(false)}
        onPress={() => {
          setIsCheckoutVisible(false);
          checkoutCarOrder();
        }}
      />

      <OrderSuccess
        visible={isOrderSuccess}
        onClose={() => setIsOrderSuccessVisible(false)}
        onPress={() => {
          setIsOrderSuccessVisible(false);
          navigation.navigate('Shop');
        }}
      />
    </View>
  );
};

const style = StyleSheet.create({
  plusMinusIconView: {
    width: horizontalScale(34),
    height: verticalScale(34),
    borderWidth: moderateScale(1.5),
    borderColor: colors.BORDER,
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockStyle: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.WHITE,
    textAlign: 'center',
    lineHeight: verticalScale(12),
  },
});
