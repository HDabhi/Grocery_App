import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import DownArrowIcon from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../../component/CustomHeader';
import CustomText from '../../component/customText';
import FONTS from '../../component/fonts';
import { ProductList } from '../../services/productListing/hooks';
import colors from '../../utils/colors';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';

import Toast from 'react-native-toast-message';
import { useOrderProductDetails } from '../../services/orderList/hooks';

export const OrderProductDetails = ({route}) => {
  const navigation = useNavigation();
  const mutationProductDetails = useOrderProductDetails();

  const [productDetails, setProductDetails] = useState<ProductList>();

  useEffect(() => {
    if(route.params.ekartId && route.params.productId){
      const orderData = {
        eKartId : route.params.ekartId,
        productId : route.params.productId
      }
  
      mutationProductDetails.mutate(orderData, {
        onSuccess: data => {
          if (data?.status && data?.statusCode == 200) {
            setProductDetails(data?.data);
          } else {
            Toast.show({
              type: 'error',
              text1: data?.message,
              visibilityTime: 4000,
            });
          }
        },
        onError: error => {
          console.log('order error : ' + JSON.stringify(error));
        },
      });
    }
    
  },[route.params.ekartId,route.params.productId])

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <CustomHeader
        title="Product Details"
        onBackPress={() => navigation.goBack()}
      />
      <View style={{flex: 1, padding: moderateScale(15)}}>
        <View>
          {productDetails?.imageUrl && <Image source={{uri: productDetails?.imageUrl}} style={styles.image} /> }
          
        </View>

        <View
          style={{
            marginHorizontal: horizontalScale(8),
            marginVertical: verticalScale(8),
          }}>
          <Text style={styles.name}>{productDetails?.productName}</Text>
          <Text style={styles.volumeStyle}>
            {productDetails?.uomSellingQuantity + ' ' + productDetails?.uomCode}
          </Text>
          <Text style={styles.volumeStyle1}>
            {productDetails?.categoryName +
              ' / ' +
              productDetails?.subCategoryName}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: verticalScale(16),
            }}>

            <View style={styles.container}>
              <Text style={styles.mainPrice}>{'₹' + productDetails?.mrp}</Text>
              <Text style={styles.sellingPrice}>
                {'₹' + productDetails?.sellingPrice}
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
              {productDetails?.productDescription}
            </Text>
          </ScrollView>
        </View>
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
  },
  mainPrice: {
    fontSize: moderateScale(18),
    fontFamily: FONTS.DM_SEMIBOLD,
    color: colors.GRAY,
    textDecorationLine: 'line-through',
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
