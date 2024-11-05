import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import colors from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import SearchInput from 'react-native-search-filter';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';
import {useEffect, useState} from 'react';
import {
  ProductList,
  useSearchProduct,
} from '../../services/productListing/hooks';
import ListEmptyComponent from '../../component/listEmptyComponent';
import PlusIcon from 'react-native-vector-icons/Entypo';
import {useAuth} from '../../stores/auth';
import {
  useAddProductToCart,
  useGetCartList,
} from '../../services/cartList/hooks';
import Toast from 'react-native-toast-message';
import FONTS from '../../component/fonts';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const SearchProductList: React.FC = () => {
  const navigation = useNavigation();

  const [searchTerm, setSearchTerm] = useState('');
  const [productList, setProductList] = useState([]);

  const mutationSearchProduct = useSearchProduct();
  const mutationAddProductToCart = useAddProductToCart();
  const {refetch: refetchCart} = useGetCartList();

  const {cartId} = useAuth.getState();

  useEffect(() => {
    mutationSearchProduct.mutate(searchTerm, {
      onSuccess: data => {
        console.log('search product data : ' + JSON.stringify(data));
        if (data?.status && data?.statusCode == 200) {
          setProductList(data?.data);
          // setSubCategoryList(data?.data);
        } else {
          // Alert.alert(data?.message);
        }
        // navio.push('AddOrganization')
      },
      onError: error => {
        // setIsLoading(false)
        console.log('Create profile error : ' + JSON.stringify(error));
      },
    });
  }, [searchTerm]);

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
      quantity: 1,
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

  const ProductItem: React.FC<{product: ProductList}> = ({product}) => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ProductDetails', {productItem: product})
        }
        style={style.item}>

        <Image source={{uri: product.imageUrl}} style={style.image} />

        <View
          style={{
            marginHorizontal: horizontalScale(8),
          }}>
          <Text style={style.name}>{product.productName}</Text>
          
          </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      {/* <CustomHeader
        title="Search Products"
        onBackPress={() => navigation.goBack()}
        onCartPress={() => {
            // Handle cart press (e.g., navigate to cart screen)
            navigation.navigate('Cart');
            console.log('Cart icon pressed');
          }}
      /> */}

      <View style={style.searchViewStyle}>
        <Icon
          name="keyboard-backspace"
          size={verticalScale(26)}
          color={colors.BLACK}
          onPress={() => navigation.goBack()}
        />

        <View style={{flex: 1}}>
          <SearchInput
            onChangeText={term => {
              setSearchTerm(term);
            }}
            autoFocus={true}
            style={[style.searchInput]}
            placeholder="Search Product"
            placeholderTextColor={colors.GRAY}
            clearIcon={ <Icon
              name="close"
              size={verticalScale(26)}
              color={colors.BLACK}
            />}
            clearIconViewStyles={{position:'absolute',top: verticalScale(10),right: horizontalScale(0)}}
          />
        </View>
      </View>

      <FlatList
        data={productList}
        renderItem={({item}) => <ProductItem product={item} />}
        keyExtractor={item => item?.productId}
        ListEmptyComponent={() => (
          <ListEmptyComponent title={'Please search product or category'} />
        )}
      />
    </View>
  );
};

const style = StyleSheet.create({
  searchViewStyle: {
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: moderateScale(7),
    height: verticalScale(45),
    marginVertical: verticalScale(10),
    marginHorizontal: horizontalScale(14),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(10),
    gap: horizontalScale(10),
    backgroundColor:colors.WHITE
  },
  searchInput: {
    color: colors.BLACK,
    fontSize: moderateScale(14),
    alignItems:'center',
    height: verticalScale(45),
  },
  grid: {
    paddingHorizontal: horizontalScale(10),
  },
  item: {
    flexDirection:'row',
    alignItems:'center',
    marginHorizontal:horizontalScale(14),
    marginVertical:verticalScale(7)
  },
  image: {
    width: horizontalScale(50),
    height: verticalScale(50),
    resizeMode: 'contain',
    borderRadius: moderateScale(8),
    borderWidth: moderateScale(1),
    borderColor: colors.BORDER_LINE,
  },
  name: {
    fontSize: moderateScale(14),
    color: colors.BLACK,
    fontFamily: FONTS.SEMI_BOLD,
  },
  volumeStyle: {
    fontSize: moderateScale(11),
    color: colors.GRAY,
    fontFamily: FONTS.MEDIUM,
  },
  volumeStyle1: {
    fontSize: moderateScale(11),
    color: colors.GREEN,
    fontFamily: FONTS.SEMI_BOLD,
    marginTop: verticalScale(4),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mainPrice: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.MEDIUM,
    color: colors.GRAY,
    textDecorationLine: 'line-through', // This creates the line over the main price
    marginRight: 8,
  },
  sellingPrice: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.MEDIUM,
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
    borderColor: colors.BORDER_LINE,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: moderateScale(1),
    flexDirection: 'row',
  },
  viewFilterStyle: {
    flex: 1,
    borderLeftWidth: moderateScale(0.8),
    borderColor: colors.BORDER_LINE,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: moderateScale(1),
    flexDirection: 'row',
  },
  plusMinusIconView: {
    width: horizontalScale(34),
    height: verticalScale(35),
    backgroundColor: colors.GREEN,
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockStyle: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.WHITE,
    textAlign: 'right',
    lineHeight: verticalScale(14),
    paddingVertical: verticalScale(6),
  },
});
