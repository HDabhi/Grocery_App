import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';
import colors from '../../utils/colors';
import CustomHeader from '../../component/CustomHeader';
import {
  useGetProductByCategory,
  ProductList,
} from '../../services/productListing/hooks';
import ListEmptyComponent from '../../component/listEmptyComponent';
import FONTS from '../../component/fonts';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';
import PlusIcon from 'react-native-vector-icons/Entypo';
import CloseIcon from 'react-native-vector-icons/Ionicons';
import CustomText from '../../component/customText';
import {useAddProductToCart} from '../../services/cartList/hooks';
import CheckBox from '../../component/CheckBox';
import {useAuth} from '../../stores/auth';
import Toast from 'react-native-toast-message';

interface Category {
  id: string;
  createdTime: string; // ISO string format for the date
  updatedTime: string | null; // Nullable in case no update is available
  status: boolean;
  name: string;
  description: string;
  imageUrl: string;
  selected: boolean;
}

// Main component
export const ProductListByCategory: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {categoryId} = route.params;
  const mutationAddProductToCart = useAddProductToCart();
  // const [categoryList, setCategoryList] = useState([])
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [productList, setProductList] = useState<ProductList[]>([]);
  const [isFilterShow, setIsFilterShow] = useState(false);

  const {cartId} = useAuth.getState();
  const {
    data: productData,
    error: productError,
    isLoading: productLoading,
    refetch
  } = useGetProductByCategory(categoryId);

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, []),
  );

  useEffect(() => {
    if (productData) {
      if (productData.status && productData.statusCode === 200) {
        setProductList(productData?.data);
      } else {
        Toast.show({
          type: 'error',
          text1: productData?.message,
          visibilityTime:4000
        });
      }
    }
  }, [productData]);

  // Component to render each product item
  const ProductItem: React.FC<{product: ProductList}> = ({product}) => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ProductDetails', {productItem: product})
        }
        style={styles.item}>
        {product.imageUrl != '-' ? (
          <Image source={{uri: product.imageUrl}} style={styles.image} />
        ) : (
          <Image
            source={require('../../../assets/images/product.png')}
            style={styles.image}
          />
        )}

        <View
          style={{
            marginHorizontal: horizontalScale(8),
            marginTop: verticalScale(8),
          }}>
          <Text style={styles.name}>{product.productName}</Text>
          <Text style={styles.volumeStyle}>{'355ml, Price'}</Text>

          <View style={{flexDirection: 'row', marginTop: verticalScale(10)}}>
            <View style={styles.container}>
              <Text style={styles.mainPrice}>{'₹' + product.mrp}</Text>
              <Text style={styles.sellingPrice}>
                {'₹' + product.sellingPrice}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => addProductToCart(product)}
              style={styles.plusMinusIconView}>
              <PlusIcon
                name="plus"
                color={colors.WHITE}
                size={verticalScale(22)}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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

    mutationAddProductToCart.mutate(cartData, {
      onSuccess: data => {
        // setIsLoading(false)
        if (data?.status && data?.statusCode == 200) {
          // setProductList(data?.data);
        } else {
          Toast.show({
            type: 'error',
            text1: data?.message,
            visibilityTime:4000
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

  const toggleCheckbox = (id: string) => {
    setCategoryList(prevCategories =>
      prevCategories.map(category =>
        category.id === id
          ? {...category, selected: !category.selected}
          : category,
      ),
    );
  };

  const CategoryItem: React.FC<{product: Category}> = ({product}) => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <CheckBox
          label={product.name}
          value={product.selected}
          onChange={newValue => toggleCheckbox(product.id)}
          checkedColor={colors.GREEN}
          uncheckedColor={colors.GRAY}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <CustomHeader
        title="Products"
        onMenuPress={() => navigation.toggleDrawer()} // Hamburger menu action
        onCartPress={() => {
          // Handle cart press (e.g., navigate to cart screen)
          navigation.navigate('Cart')
        }}
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        data={productList}
        renderItem={({item}) => <ProductItem product={item} />}
        keyExtractor={item => item.categoryId}
        numColumns={2}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={() => <ListEmptyComponent />}
      />

      <Modal
        presentationStyle="pageSheet"
        visible={isFilterShow}
        onRequestClose={() => setIsFilterShow(false)}
        style={{backgroundColor: colors.WHITE}}>
        <View style={{height: verticalScale(50), justifyContent: 'center'}}>
          <CloseIcon
            onPress={() => setIsFilterShow(false)}
            style={styles.closeIconStyle}
            name="close-outline"
            size={verticalScale(28)}
            color={colors.BLACK}
          />
          <CustomText
            textStyle={[styles.filterTextStyle, {textAlign: 'center'}]}>
            {'Filters'}
          </CustomText>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: '#F2F3F2',
            borderTopLeftRadius: moderateScale(34),
            borderTopRightRadius: moderateScale(34),
            marginTop: horizontalScale(10),
            paddingVertical: verticalScale(14),
            paddingHorizontal: horizontalScale(14),
          }}>
          <CustomText textStyle={styles.filterTextStyle}>
            {'Categories'}
          </CustomText>

          <FlatList
            contentContainerStyle={{marginTop: verticalScale(6)}}
            data={categoryList}
            renderItem={({item}) => <CategoryItem product={item} />}
            keyExtractor={item => item?.id}
            ListEmptyComponent={() => <ListEmptyComponent />}
          />
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  grid: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(10),
  },
  item: {
    width: '47%',
    margin: moderateScale(6),
    paddingVertical: verticalScale(10),
    backgroundColor: '#fff',
    borderRadius: moderateScale(14),
    borderWidth: moderateScale(1),
    borderColor: colors.BORDER_LINE,
  },
  image: {
    width: '100%',
    height: 130,
    resizeMode: 'contain',
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
  closeIconStyle: {
    position: 'absolute',
    left: horizontalScale(10),
    zIndex: 999,
  },
  filterTextStyle: {
    fontSize: moderateScale(17),
    fontFamily: FONTS.BOLD,
    color: colors.BLACK,
  },
});
