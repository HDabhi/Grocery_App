import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';
import FONTS from '../../component/fonts';
import colors from '../../utils/colors';
import {useState} from 'react';
import {ProductList} from '../../services/productListing/hooks';
import CustomHeader from '../../component/CustomHeader';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../component/customButton';
import MinusIcon from 'react-native-vector-icons/Feather';
import PlusIcon from 'react-native-vector-icons/Feather';
import DownArrowIcon from 'react-native-vector-icons/Ionicons';
import CustomText from '../../component/customText';
import {
  useAddProductToCart,
  useGetCartList,
} from '../../services/cartList/hooks';
import {useAuth} from '../../stores/auth';
import Toast from 'react-native-toast-message';

export const ProductDetails = ({route}) => {
  const navigation = useNavigation();
  const mutationAddProductToCart = useAddProductToCart();
  const {cartId} = useAuth.getState();
  const {data: cartData, refetch: refetchCart} = useGetCartList();

  const [productDetails, setProductDetails] = useState<ProductList>(
    route.params.productItem,
  );
  const [productQty, setProductQty] = useState(1);

  const addProductToCart = (product: ProductList) => {
    const cartData = {
      cartId: cartId,
      ekartId: product.ekartId,
      productId: product.productId,
      productsList: [
        {
          categoryId: product.categoryId,
          categoryName: product.categoryName,
          description: product.productDescription,
          imageUrl: product.imageUrl,
          name: product.productName,
          status: true,
          subCategoryId: product.subCategoryId,
          subCategoryName: product.subCategoryName,
        },
      ],
      quantity: productQty,
      status: true,
    };

    console.log('cart data : ' + JSON.stringify(cartData));

    mutationAddProductToCart.mutate(cartData, {
      onSuccess: data => {
        // setIsLoading(false)
        console.log('add to cart data : ' + JSON.stringify(data));
        if (data?.status && data?.statusCode == 200) {
          setTimeout(() => {
            Toast.show({
              type: 'success',
              text1: 'Added',
              text2: 'Product added into cart',
            });
          }, 200);

          refetchCart();
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
        console.log('Create profile error : ' + JSON.stringify(error));
      },
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <CustomHeader
        title="Product Details"
        onCartPress={() => {
          // Handle cart press (e.g., navigate to cart screen)
          navigation.navigate('Cart');
          console.log('Cart icon pressed');
        }}
        onBackPress={() => navigation.goBack()}
      />
      <View style={{flex: 1, padding: moderateScale(15)}}>
        <View>
          <Image source={{uri: productDetails.imageUrl}} style={styles.image} />
          {productDetails.availableQuantity == 0 && (
            <View
              style={{
                width: horizontalScale(110),
                backgroundColor: colors.RED,
                alignSelf: 'flex-end',
                position: 'absolute',
                bottom: 0,
                borderRadius: horizontalScale(6),
              }}>
              <Text style={styles.outOfStockStyle}>{'Out of stock'}</Text>
            </View>
          )}
        </View>

        <View
          style={{
            marginHorizontal: horizontalScale(8),
            marginVertical: verticalScale(8),
          }}>
          <Text style={styles.name}>{productDetails.productName}</Text>
          <Text style={styles.volumeStyle}>
            {productDetails.uomSellingQuantity + ' ' + productDetails.uomCode}
          </Text>
          <Text style={styles.volumeStyle1}>
            {productDetails.categoryName +
              ' / ' +
              productDetails.subCategoryName}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: verticalScale(16),
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <TouchableOpacity
                disabled={productQty == 1 ? true : false}
                onPress={() => setProductQty(value => value - 1)}
                style={styles.plusMinusIconView}>
                <MinusIcon
                  name="minus"
                  size={verticalScale(22)}
                  color={colors.BLACK}
                />
              </TouchableOpacity>

              <CustomText
                textStyle={{
                  fontSize: moderateScale(14),
                  fontFamily: FONTS.SEMI_BOLD,
                  width: horizontalScale(45),
                  color: colors.BLACK,
                  textAlign: 'center',
                }}>
                {productQty}
              </CustomText>

              <TouchableOpacity
                onPress={() => {
                  if (productQty == productDetails.availableQuantity) {
                    Toast.show({
                      type: 'error',
                      text1: ``,
                      text2: `You’ve selected more items than available in stock. Current available quantity: ${productDetails.availableQuantity}`,
                      visibilityTime: 4000,
                    });
                  } else {
                    setProductQty(value => value + 1);
                  }
                }}
                style={styles.plusMinusIconView}>
                <PlusIcon
                  color={colors.GREEN}
                  name="plus"
                  size={verticalScale(22)}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.container}>
              <Text style={styles.mainPrice}>{'₹' + productDetails.mrp}</Text>
              <Text style={styles.sellingPrice}>
                {'₹' + productDetails.sellingPrice}
              </Text>
            </View>
          </View>

          <TouchableOpacity
          onPress={() => navigation.navigate('RefundReturn')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-end',
              marginTop: verticalScale(6),
            }}>
            <DownArrowIcon
              name="information-circle-sharp"
              size={verticalScale(22)}
              color={colors.GRAY}
            />
            <Text style={styles.txtRefundStyle}>
              {'Refund & Cancellation Policy'}
            </Text>
          </TouchableOpacity>

          <View style={styles.lineStyle} />

          <View style={{flexDirection: 'row'}}>
            <CustomText
              viewStyle={{flex: 1}}
              textStyle={{
                fontSize: moderateScale(14),
                fontFamily: FONTS.SEMI_BOLD,
                color: colors.BLACK,
              }}>
              {'Product Detail'}
            </CustomText>
            <DownArrowIcon
              name="chevron-down"
              size={verticalScale(26)}
              color={colors.BLACK}
            />
          </View>

          <ScrollView style={{maxHeight: verticalScale(180)}}>
            <Text style={styles.productDetailsText}>
              {productDetails.productDescription}
            </Text>
          </ScrollView>
        </View>
      </View>
      <View style={{padding: moderateScale(20)}}>
        <CustomButton
          disabled={productDetails.availableQuantity == 0 ? true : false}
          title={
            productDetails.availableQuantity == 0
              ? 'Coming soon'
              : 'Add To Basket'
          }
          onPress={() => addProductToCart(productDetails)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(5),
  },
  item: {
    width: '47%',
    margin: moderateScale(6),
    backgroundColor: '#fff',
    borderRadius: moderateScale(6),
    elevation: 1,
    // alignItems: 'center',
  },
  image: {
    width: horizontalScale(200),
    height: verticalScale(250),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  name: {
    fontSize: moderateScale(22),
    color: colors.BLACK,
    fontFamily: FONTS.SEMI_BOLD,
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  mainPrice: {
    fontSize: moderateScale(18),
    fontFamily: FONTS.DM_SEMIBOLD,
    color: colors.GRAY,
    textDecorationLine: 'line-through', // This creates the line over the main price
    marginRight: 8,
  },
  sellingPrice: {
    fontSize: moderateScale(18),
    fontFamily: FONTS.DM_BOLD,
    color: colors.GREEN,
  },
  txtFilterStyle: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
    marginStart: moderateScale(8),
  },
  viewSortStyle: {
    flex: 1,
    borderRightWidth: moderateScale(0.8),
    borderTopWidth: moderateScale(1),
    borderColor: colors.LIGHT_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: moderateScale(1),
    flexDirection: 'row',
  },
  viewFilterStyle: {
    flex: 1,
    borderLeftWidth: moderateScale(0.8),
    borderTopWidth: moderateScale(1),
    borderColor: colors.LIGHT_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: moderateScale(1),
    flexDirection: 'row',
  },
  productDetailsText: {
    fontSize: moderateScale(14),
    marginVertical: verticalScale(8),
    color: colors.GRAY,
    fontFamily: FONTS.DM_LIGHT,
  },
  plusMinusIconView: {
    width: horizontalScale(34),
    height: verticalScale(34),
    borderWidth: moderateScale(1.5),
    borderColor: colors.BORDER,
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineStyle: {
    height: verticalScale(1),
    backgroundColor: colors.BORDER_LINE,
    marginVertical: verticalScale(10),
  },
  volumeStyle: {
    fontSize: moderateScale(14),
    color: colors.GRAY,
    fontFamily: FONTS.MEDIUM,
  },
  volumeStyle1: {
    fontSize: moderateScale(14),
    color: colors.GREEN,
    fontFamily: FONTS.SEMI_BOLD,
    marginTop: verticalScale(4),
  },
  outOfStockStyle: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.WHITE,
    textAlign: 'center',
    flex: 1,
    lineHeight: verticalScale(15),
    paddingVertical: verticalScale(6),
  },
  txtRefundStyle: {
    fontSize: moderateScale(11),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.GRAY,
  },
});
