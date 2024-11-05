import {useNavigation, useRoute} from '@react-navigation/native';
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
import SearchInput, {createFilter} from 'react-native-search-filter';

import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';
import colors from '../../utils/colors';
import CustomHeader from '../../component/CustomHeader';
import {
  useGetProductList,
  ProductList,
  useSearchProduct,
} from '../../services/productListing/hooks';
import ListEmptyComponent from '../../component/listEmptyComponent';
import FONTS from '../../component/fonts';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';
import PlusIcon from 'react-native-vector-icons/Entypo';
import CloseIcon from 'react-native-vector-icons/Ionicons';
import CustomText from '../../component/customText';
import {
  useGetCategory,
  useGetSubCategory,
} from '../../services/productCategory/hooks';
import {
  useAddProductToCart,
  useGetCartList,
} from '../../services/cartList/hooks';
import CheckBox from '../../component/CheckBox';
import {useAuth} from '../../stores/auth';
import Toast from 'react-native-toast-message';
import CustomButton from '../../component/customButton';
import {useSocket} from '../../utils/socketProvider';
import Spinner from '../../component/spinner';
const KEYS_TO_FILTERS = ['productName'];

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

interface SubCategory {
  id: string;
  createdTime: string;
  updatedTime: string | null;
  status: boolean;
  name: string;
  description: string;
  categoryId: string;
  imageUrl: string;
  selected: boolean;
}

// Main component
export const ProductListing: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {productMessages} = useSocket();
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const mutationProductList = useGetProductList();
  const mutationSubCategory = useGetSubCategory();
  const mutationSearchProduct = useSearchProduct();
  const mutationAddProductToCart = useAddProductToCart();
  const {data: categoryData, isLoading, error} = useGetCategory();
  // const [categoryList, setCategoryList] = useState([])
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [subCategoryList, setSubCategoryList] = useState<SubCategory[]>([]);
  const [productList, setProductList] = useState<ProductList[]>([]);
  const [searchProductList, setSearchProductList] = useState<ProductList[]>([]);
  const [isFilterShow, setIsFilterShow] = useState(false);
  const [isPriceLowToHigh, setIsPriceLowToHigh] = useState(false);
  const [isPriceHighToLow, setIsPriceHighToLow] = useState(false);
  const [isNameAToZ, setIsNameAToZ] = useState(true);
  const [isNameZToA, setIsNameZToA] = useState(false);

  // const [isFilterShow, setIsFilterShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const {categoryId = null} = route?.params || {};
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
  const [cartList, setCartList] = useState([]);
  const {cartId} = useAuth.getState();
  const {changeEKartId} = useAuth.use.actions();

  const {data: cartData, refetch: refetchCart} = useGetCartList();

  useEffect(() => {
    if (categoryId) {
      setSelectedCategoryId(categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    if (productMessages && Object.keys(productMessages).length != 0) {
      const socketdata = JSON.parse(productMessages);
      const updatedProduct = productList.map(prod =>
        prod.productId === socketdata?.productId
          ? {
              ...prod,
              availableQuantity: parseInt(socketdata?.availableQuantity),
            }
          : prod,
      );
      setProductList(updatedProduct);
    }
  }, [productMessages]);

  useEffect(() => {
    const filteredProduct = productList.filter(
      createFilter(searchTerm, KEYS_TO_FILTERS),
    );
    setSearchProductList(filteredProduct);
  }, [searchTerm]);

  useEffect(() => {
    if (cartData) {
      if (cartData.status && cartData.statusCode === 200) {
        setCartList(cartData?.data?.cartProducts);
      } else {
        setCartList([]);
      }
    }
  }, [cartData]);

  useEffect(() => {
    if (productList.length > 0) {
      changeEKartId(productList[0].ekartId);
    }
  }, [productList]);

  useEffect(() => {
    if (categoryData) {
      if (categoryData.status && categoryData.statusCode === 200) {
        if (categoryId) {
          const categories = categoryData.data.map(category => ({
            ...category,
            selected: category?.id == categoryId ? true : false, // Default selected value is false
          }));
          setCategoryList(categories);
        } else {
          const categories = categoryData.data.map(category => ({
            ...category,
            selected: false, // Default selected value is false
          }));
          setCategoryList(categories);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: categoryData?.message,
          visibilityTime: 4000,
        });
      }
    }
  }, [categoryData]);

  useEffect(() => {
    if (selectedCategoryId) {
      mutationSubCategory.mutate(selectedCategoryId, {
        onSuccess: data => {
          // setIsLoading(false)
          if (data?.status && data?.statusCode == 200) {
            const subCategories = [
              {
                id: 'all', // Unique ID for "All" option
                name: 'All', // Display name
                selected: true, // Set selected based on whether 'all' is selected
              },
              ...data.data.map(subcategory => ({
                ...subcategory,
                selected: false, // Default selected value is false
              })),
            ];

            setSubCategoryList(subCategories);
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
    }
  }, [selectedCategoryId]);

  // const getSubCategory = useCallback(() => {
  //   mutationSubCategory.mutate(finalData, {
  //     onSuccess: data => {
  //       // setIsLoading(false)
  //       console.log('product list data : ' + JSON.stringify(data));
  //       if (data?.status && data?.statusCode == 200) {
  //         setProductList(data?.data);
  //         setSearchProductList(data?.data);
  //       } else {
  //         Alert.alert(data?.message);
  //       }
  //       // navio.push('AddOrganization')
  //     },
  //     onError: error => {
  //       // setIsLoading(false)
  //       console.log('Create profile error : ' + JSON.stringify(error));
  //     },
  //   });
  // }, [selectedCategoryId]);

  useEffect(() => {
    const filter = {
      filterByCategory: selectedCategoryId != null ? true : false,
      filterByLowestPrice: isPriceLowToHigh,
      filterByProductNameAsc: isNameAToZ,
      filterByProductNameDesc: isNameZToA,
      filterBySubCategory: selectedSubCategoryId != '' ? true : false,
      idFilterByHighestPrice: isPriceHighToLow,
    };

    const finalData = {
      filterData: filter,
      categoryId: selectedCategoryId == null ? '' : selectedCategoryId,
      subCategoryId: selectedSubCategoryId,
      pageNumber: pageNumber,
    };

    mutationProductList.mutate(finalData, {
      onSuccess: data => {
        // setIsLoading(false)
        if (data?.status && data?.statusCode == 200) {
          if (data?.data?.length > 0) {
            if (pageNumber == 1) {
              setProductList(data?.data);
              setSearchProductList(data?.data);
            } else {
              setProductList(prevData => [...prevData, ...data?.data]);
              setSearchProductList(prevData => [...prevData, ...data?.data]);
            }
          } else {
            setHasMore(false);
            if (pageNumber == 1) {
              setProductList([]);
              setSearchProductList([]);
            }
          }
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
  }, [
    selectedCategoryId,
    selectedSubCategoryId,
    isNameAToZ,
    isNameZToA,
    isPriceHighToLow,
    isPriceLowToHigh,
    pageNumber,
  ]);

  // Component to render each product item
  const ProductItem: React.FC<{product: ProductList}> = ({product}) => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ProductDetails', {productItem: product})
        }
        style={styles.item}>
        <Image source={{uri: product.imageUrl}} style={styles.image} />

        <View
          style={{
            marginHorizontal: horizontalScale(8),
            marginTop: verticalScale(8),
          }}>
          <Text style={styles.name}>{product.productName}</Text>
          <Text style={styles.volumeStyle1}>
            {product.categoryName + ' / ' + product.subCategoryName}
          </Text>
          <Text style={styles.volumeStyle}>
            {product.uomSellingQuantity + ' ' + product.uomCode}
          </Text>

          <View style={{flexDirection: 'row', marginTop: verticalScale(10)}}>
            <View style={styles.container}>
              <Text style={styles.mainPrice}>{'₹' + product.mrp}</Text>
              <Text style={styles.sellingPrice}>
                {'₹' + product.sellingPrice}
              </Text>
            </View>

            {product.availableQuantity != 0 && (
              <TouchableOpacity
                onPress={() => addProductToCart(product)}
                style={styles.plusMinusIconView}>
                <PlusIcon
                  name="plus"
                  color={colors.WHITE}
                  size={verticalScale(22)}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {product.availableQuantity == 0 && (
          <View
            style={{
              width: horizontalScale(100),
              backgroundColor: colors.RED,
              alignSelf: 'flex-end',
              position: 'absolute',
              right: 0,
              paddingEnd: horizontalScale(10),
              borderBottomLeftRadius: verticalScale(14),
              borderTopRightRadius: verticalScale(14),
            }}>
            <Text style={styles.outOfStockStyle}>{'Out of stock'}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const addProductToCart = (product: ProductList) => {
    const filteredProducts = cartList.filter(
      item => item.productId === product.productId,
    );

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

    if (filteredProducts.length > 0) {
      if (filteredProducts[0]?.quantity == product.availableQuantity) {
        Toast.show({
          type: 'error',
          text1: ``,
          text2: `You’ve selected more items than available in stock. Current available quantity: ${product.availableQuantity}`,
          visibilityTime: 4000,
        });
      } else {
        mutationAddProductToCart.mutate(cartData, {
          onSuccess: data => {
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
          },
        });
      }
    } else {
      mutationAddProductToCart.mutate(cartData, {
        onSuccess: data => {
          // setIsLoading(false)
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
        },
      });
    }
  };

  const toggleCheckbox = (id: string | null) => {
    setSelectedCategoryId(id);
    setCategoryList(prevCategories =>
      prevCategories.map(category =>
        category.id === id
          ? {...category, selected: true}
          : {...category, selected: false},
      ),
    );
  };

  const toggleSubCategoryCheckbox = (id: string) => {
    setPageNumber(1);
    if (id == 'all') {
      setSelectedSubCategoryId('');
      setSubCategoryList(prevSubCategories =>
        prevSubCategories.map(subcategory =>
          subcategory.id === id
            ? {...subcategory, selected: true}
            : {...subcategory, selected: false},
        ),
      );
    } else {
      setSelectedSubCategoryId(id);
      setSubCategoryList(prevSubCategories =>
        prevSubCategories.map(subcategory =>
          subcategory.id === id
            ? {...subcategory, selected: true}
            : {...subcategory, selected: false},
        ),
      );
    }
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

  const SubCategoryItem: React.FC = ({data}) => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <CheckBox
          label={data.name}
          value={data.selected}
          onChange={newValue => toggleSubCategoryCheckbox(data.id)}
          checkedColor={colors.GREEN}
          uncheckedColor={colors.GRAY}
        />
      </View>
    );
  };

  const updateSorting = (title: string) => {
    if (title == 'atoz') {
      setIsNameAToZ(true);
      setIsNameZToA(false);
      setIsPriceHighToLow(false);
      setIsPriceLowToHigh(false);
    }

    if (title == 'ztoa') {
      setIsNameAToZ(false);
      setIsNameZToA(true);
      setIsPriceHighToLow(false);
      setIsPriceLowToHigh(false);
    }

    if (title == 'lowtohigh') {
      setIsNameAToZ(false);
      setIsNameZToA(false);
      setIsPriceHighToLow(false);
      setIsPriceLowToHigh(true);
    }

    if (title == 'hightolow') {
      setIsNameAToZ(false);
      setIsNameZToA(false);
      setIsPriceHighToLow(true);
      setIsPriceLowToHigh(false);
    }
  };

  const loadMore = () => {
    if (hasMore) {
      setPageNumber(prevPage => prevPage + 1);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <CustomHeader
        title="Products"
        onMenuPress={() => navigation.toggleDrawer()} // Hamburger menu action
        onCartPress={() => {
          // Handle cart press (e.g., navigate to cart screen)
          navigation.navigate('Cart');
        }}
        onBackPress={() => navigation.goBack()}
        onFilterPress={() => setIsFilterShow(true)}
      />

      <Spinner visible={mutationProductList.isPending} />

      {/* <View
        style={{
          flexDirection: 'row',
          height: verticalScale(50),
          backgroundColor: colors.WHITE,
        }}>
        <TouchableOpacity style={styles.viewSortStyle}>
          <FontAwesomeIcon
            style={{marginTop: moderateScale(2)}}
            size={moderateScale(14)}
            name="sort-amount-down"
            color={colors.BLACK}
          />
          <Text style={styles.txtFilterStyle}>{'Sort'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsFilterShow(true)}
          style={styles.viewFilterStyle}>
          <Icon
            style={{marginTop: moderateScale(3)}}
            size={moderateScale(16)}
            name="filter"
            color={colors.BLACK}
          />
          <Text style={styles.txtFilterStyle}>{'Filter'}</Text>
        </TouchableOpacity>
      </View> */}

      {subCategoryList.length > 0 && (
        <View
          style={{
            marginTop: verticalScale(10),
            marginHorizontal: horizontalScale(15),
          }}>
          <FlatList
            data={subCategoryList}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{height: verticalScale(40)}}
            horizontal
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => toggleSubCategoryCheckbox(item.id)}
                  style={
                    item.selected
                      ? styles.selectedSubCategoryViewStyle
                      : styles.subCategoryViewStyle
                  }>
                  <Text
                    style={
                      item.selected
                        ? styles.selectedSubCategoryTextStyle
                        : styles.subCategoryTextStyle
                    }>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => (
              <View style={{width: horizontalScale(10)}} />
            )}
            keyExtractor={item => item?.id}
            ListEmptyComponent={() => <ListEmptyComponent />}
          />
        </View>
      )}

      <SearchInput
        onChangeText={term => {
          setSearchTerm(term);
        }}
        style={[styles.searchInput]}
        placeholder="Search Product"
        placeholderTextColor={colors.GRAY}
        clearIcon={
          <Icon name="close" size={verticalScale(26)} color={colors.BLACK} />
        }
      />

      <FlatList
        data={searchProductList}
        renderItem={({item}) => <ProductItem product={item} />}
        keyExtractor={item => item?.productId}
        numColumns={2}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={() =>
          !mutationProductList.isPending && (
            <ListEmptyComponent title={'Sorry! Products not found.'} />
          )
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
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
            backgroundColor: '#F2F3F2',
            borderTopLeftRadius: moderateScale(34),
            borderTopRightRadius: moderateScale(34),
            marginTop: horizontalScale(10),
            paddingVertical: verticalScale(14),
            paddingHorizontal: horizontalScale(20),
            flex: 1,
          }}>
          <View
            style={{
              height: 'auto',
              maxHeight: Dimensions.get('window').height - verticalScale(340),
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

          {/* <View
            style={{
              marginVertical: verticalScale(10),
              height: 'auto',
              maxHeight: verticalScale(200),
            }}>
            <CustomText textStyle={styles.filterTextStyle}>
              {'Sub Categories'}
            </CustomText>
            <FlatList
              contentContainerStyle={{marginTop: verticalScale(6)}}
              data={subCategoryList}
              renderItem={({item}) => <SubCategoryItem data={item} />}
              keyExtractor={item => item?.id}
              ListEmptyComponent={() => <ListEmptyComponent />}
            />
          </View> */}

          <View>
            <CustomText textStyle={styles.filterTextStyle}>
              {'Sort By'}
            </CustomText>

            <View style={styles.sortViewStyle}>
              <TouchableOpacity
                onPress={() => updateSorting('atoz')}
                style={styles.radioCircle}>
                <View style={[isNameAToZ && styles.selectedRadioCircle]} />
              </TouchableOpacity>

              <Text style={styles.sortTextStyle}>{'Product Name: A to Z'}</Text>
            </View>

            <View style={styles.sortViewStyle}>
              <TouchableOpacity
                onPress={() => updateSorting('ztoa')}
                style={styles.radioCircle}>
                <View style={[isNameZToA && styles.selectedRadioCircle]} />
              </TouchableOpacity>

              <Text style={styles.sortTextStyle}>{'Product Name: Z to A'}</Text>
            </View>

            <View style={styles.sortViewStyle}>
              <TouchableOpacity
                onPress={() => updateSorting('lowtohigh')}
                style={styles.radioCircle}>
                <View
                  style={[isPriceLowToHigh && styles.selectedRadioCircle]}
                />
              </TouchableOpacity>

              <Text style={styles.sortTextStyle}>{'Price: Low to High'}</Text>
            </View>

            <View style={styles.sortViewStyle}>
              <TouchableOpacity
                onPress={() => updateSorting('hightolow')}
                style={styles.radioCircle}>
                <View
                  style={[isPriceHighToLow && styles.selectedRadioCircle]}
                />
              </TouchableOpacity>

              <Text style={styles.sortTextStyle}>{'Price: High to Low'}</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomButton
              title="Clear"
              onPress={() => {
                setSelectedSubCategoryId('');
                setIsNameAToZ(true);
                setIsNameZToA(false);
                setIsPriceHighToLow(false);
                setIsPriceLowToHigh(false);
                setSubCategoryList([]);
                toggleCheckbox(null);
                setIsFilterShow(false);
              }}
              buttonStyle={{
                // marginHorizontal: horizontalScale(20),
                marginTop: verticalScale(20),
                flex: 1,
                marginEnd: horizontalScale(5),
                backgroundColor: colors.GRAY,
              }}
            />
            <CustomButton
              title="Apply"
              onPress={() => setIsFilterShow(false)}
              buttonStyle={{
                // marginHorizontal: horizontalScale(20),
                marginTop: verticalScale(20),
                flex: 1,
                marginStart: horizontalScale(5),
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  grid: {
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
    width: '90%',
    height: 130,
    resizeMode: 'cover',
    borderRadius: moderateScale(10),
    alignSelf: 'center',
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
  closeIconStyle: {
    position: 'absolute',
    left: horizontalScale(10),
    zIndex: 999,
  },
  filterTextStyle: {
    fontSize: moderateScale(17),
    fontFamily: FONTS.BOLD,
    color: colors.BLACK,
    marginVertical: verticalScale(5),
  },
  searchInput: {
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: moderateScale(10),
    color: colors.BLACK,
    height: verticalScale(45),
    fontSize: moderateScale(14),
    marginVertical: verticalScale(10),
    marginHorizontal: horizontalScale(15),
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
  sortTextStyle: {
    fontSize: moderateScale(14),
    color: colors.BLACK,
    fontFamily: FONTS.MEDIUM,
    marginStart: horizontalScale(10),
  },
  sortViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  outOfStockStyle: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.WHITE,
    textAlign: 'right',
    lineHeight: verticalScale(14),
    paddingVertical: verticalScale(6),
  },
  selectedSubCategoryViewStyle: {
    backgroundColor: colors.GREEN,
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(10),
  },
  selectedSubCategoryTextStyle: {
    color: colors.WHITE,
    fontSize: moderateScale(13),
  },
  subCategoryViewStyle: {
    backgroundColor: colors.LIGHT_GRAY,
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(10),
  },
  subCategoryTextStyle: {
    color: colors.BLACK,
    fontSize: moderateScale(13),
  },
});
