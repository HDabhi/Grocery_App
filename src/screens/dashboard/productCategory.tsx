import {useFocusEffect, useNavigation} from '@react-navigation/native';
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
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';
import colors from '../../utils/colors';
import CustomHeader from '../../component/CustomHeader';
import {
  useGetCategory,
  useGetHomeData,
  useGetRecentOrderProduct,
} from '../../services/productCategory/hooks';
import FONTS from '../../component/fonts';
import ListEmptyComponent from '../../component/listEmptyComponent';
import Carousel from 'react-native-reanimated-carousel';
import {SBItem} from '../../component/carouselSlider/SBItem';
import {useSharedValue} from 'react-native-reanimated';
import CustomText from '../../component/customText';
import {
  useAddProductToCart,
  useGetCartList,
} from '../../services/cartList/hooks';
import {useAuth} from '../../stores/auth';
import {ProductList} from '../../services/productListing/hooks';
import PlusIcon from 'react-native-vector-icons/Entypo';
import SearchIcon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import LocationIcon from 'react-native-vector-icons/Octicons'; // Icon library
import {
  useGetAddressList,
  useUpdateAddressList,
} from '../../services/address/hooks';
import AddressModal from '../../component/AddressModal';
import {UserAddress} from '../../services/address/api';
import {useGetOrderList} from '../../services/orderList/hooks';
import {Order} from '../../services/orderList/api';
import moment from 'moment';
import {getDeliveryTime} from '../../utils/responsiveUI';
import {useSocket} from '../../utils/socketProvider';
import {useGetStoreClosingMsg} from '../../services/errorMessage/hooks';
import {RecentOrderProduct} from '../../services/productCategory/api';

interface Category {
  id: string;
  createdTime: string; // ISO string format for the date
  updatedTime: string | null; // Nullable in case no update is available
  status: boolean;
  name: string;
  description: string;
  imageUrl: string;
}
const PAGE_WIDTH = Dimensions.get('screen').width;
// Main component
export const ProductCategory: React.FC = () => {
  const windowWidth = useWindowDimensions().width;
  const scrollOffsetValue = useSharedValue<number>(0);
  const navigation = useNavigation();
  const {isConnected, messages, productMessages} = useSocket();

  const {data: cartData, refetch: refetchCart} = useGetCartList();
  const {data: storeClosingData} = useGetStoreClosingMsg();
  const {
    data: orderData,
    error: orderError,
    isLoading: orderLoading,
    refetch: orderRefetch,
  } = useGetOrderList(1);

  const {
    data: addressData,
    error,
    isLoading,
    refetch: refetchAddress,
  } = useGetAddressList();

  const {
    data: homeData,
    isLoading: homeLoading,
    error: homeError,
    refetch: homeRefetch,
  } = useGetHomeData();

  const {
    data: recentOrderProductData,
    isLoading: recentOrderProductLoading,
    error: recentOrderProductError,
    refetch: recentOrderProductRefetch,
  } = useGetRecentOrderProduct();

  const {
    changeCartCount,
    changeAddressId,
    changeEKartId,
    changeStoreClosingMsg,
  } = useAuth.use.actions();
  const {cartId} = useAuth.getState();

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [productList, setProductList] = useState<ProductList[]>([]);
  const [recentOrderProductList, setRecentOrderProductList] = useState<
    RecentOrderProduct[]
  >([]);
  const [orderList, setOrderList] = useState<Order[]>([]);

  const [bannerList, setBannerList] = useState([]);
  const [cartList, setCartList] = useState([]);
  const mutationAddProductToCart = useAddProductToCart();
  const mutationUpdateAddressData = useUpdateAddressList();

  const [searchTerm, setSearchTerm] = useState('');
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isAddressModalShow, setIsAddressModelShow] = useState(false);
  const [imgUrlofProduct, setImgUrlofProduct] = useState('');
  const [textWidth, setTextWidth] = useState(null);

  useFocusEffect(
    useCallback(() => {
      homeRefetch();
      refetchAddress();
      refetchCart();
      orderRefetch();
      recentOrderProductRefetch()
    }, []),
  );

  useEffect(() => {
    if (addressData) {
      if (addressData.status && addressData.statusCode === 200) {
        const filteredData = addressData?.data?.filter(
          item => item.status === true,
        );
        const addressSelected = addressData?.data?.filter(
          item => item.primary == true,
        );

        setAddressList(filteredData);
        setSelectedAddress(addressSelected[0]);
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
    if (productMessages && Object.keys(productMessages).length != 0) {
      const socketdata = JSON.parse(productMessages);
      console.log('messages id : ' + socketdata?.productId);
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
    if (cartData) {
      if (cartData.status && cartData.statusCode === 200) {
        setCartList(cartData?.data?.cartProducts);
        changeCartCount(cartData?.data?.cartProducts?.length);
      } else {
        setCartList([]);
        changeCartCount(0);
      }
    }
  }, [cartData]);

  useEffect(() => {
    if (storeClosingData) {
      if (storeClosingData.status && storeClosingData.statusCode === 200) {
        changeStoreClosingMsg(storeClosingData?.data);
      }
    }
  }, [storeClosingData]);

  useEffect(() => {
    if (messages && Object.keys(messages).length != 0) {
      const socketdata = JSON.parse(messages);
      console.log('messages : ' + JSON.stringify(socketdata));

      console.log('messages id : ' + socketdata?.id);
      const updatedOrders = orderList.map(order =>
        order.id === socketdata?.id
          ? {
              ...order,
              orderStatus: socketdata?.orderStatus,
              deliveryTime: socketdata?.deliveryTime,
              orderCompletionStatus: socketdata?.orderCompletionStatus,
              returnCompletionStatus: socketdata?.returnCompletionStatus,
            }
          : order,
      );

      const finalOrderData = updatedOrders?.filter(
        item =>
          item.orderCompletionStatus != 'COMPLETED' &&
          item.orderStatus != 'REFUNDED',
      );

      setOrderList(finalOrderData);
    }
  }, [messages]);

  useEffect(() => {
    if (homeData) {
      if (homeData.status && homeData.statusCode === 200) {
        const bannerData = homeData?.data?.banner;
        setBannerList(bannerData);
        setProductList(homeData?.data?.productListing);
        const filterCategoryList = homeData?.data?.categoryListing?.filter(
          category => category.status == true,
        );
        setCategoryList(filterCategoryList);
      } else {
        Toast.show({
          type: 'error',
          text1: homeData?.message,
          visibilityTime: 4000,
        });
      }
    }
  }, [homeData]);

  useEffect(() => {
    if (recentOrderProductData) {
      if (
        recentOrderProductData.status &&
        recentOrderProductData.statusCode === 200
      ) {
        setRecentOrderProductList(recentOrderProductData?.data);
      } else {
        setRecentOrderProductList([]);
      }
    }
  }, [recentOrderProductData]);

  useEffect(() => {
    if (productList.length > 0) {
      changeEKartId(productList[0].ekartId);
    }
  }, [productList]);

  useEffect(() => {
    if (orderData) {
      if (orderData.status && orderData.statusCode === 200) {
        console.log("ORDER DATRA >>> " + JSON.stringify(orderData))
        const finalOrderData = orderData?.data?.filter(
          item =>
            item.orderCompletionStatus != 'COMPLETED' &&
            item.orderStatus != 'REFUNDED',
        );

        if (finalOrderData?.length > 0) {
          if (finalOrderData[0].orderProductDtoList?.length > 0) {
            setImgUrlofProduct(
              finalOrderData[0].orderProductDtoList[0].imageUrl,
            );
          }
          setOrderList(finalOrderData);
        } else {
          setOrderList([]);
        }
      } else {
      }
    }
  }, [orderData]);

  const handleTextLayout = event => {
    const {width} = event.nativeEvent.layout;
    console.log('Width : ' + width);
    setTextWidth(width);
  };

  const updateAddress = (item: UserAddress) => {
    const data = item;

    // Remove properties
    delete data.createdTime;
    delete data.updatedTime;

    // Update the `primary` field
    data.primary = true;

    console.log('Data : ' + JSON.stringify(data));

    mutationUpdateAddressData.mutate(data, {
      onSuccess: data => {
        console.log('Update address res : ' + JSON.stringify(data));
        if (data?.status && data?.statusCode == 200) {
          changeAddressId(data?.data?.id);
          setTimeout(() => {
            refetchAddress();
            homeRefetch();
          }, 100);
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
        console.log('Address error : ' + JSON.stringify(error));
      },
    });
  };

  const CategoryItem: React.FC<{product: Category}> = ({product}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ProductListing', {categoryId: product.id})
        }
        style={styles.item}>
        <Image source={{uri: product?.imageUrl}} style={styles.imageCategory} />
        <View
          style={{
            marginHorizontal: horizontalScale(8),
            marginVertical: verticalScale(8),
          }}>
          <Text style={styles.name}>{product?.name}</Text>
          {/* <Text style={styles.price}>{product.price}</Text> */}
        </View>
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

    console.log('cart data : ' + JSON.stringify(cartData));

    if (filteredProducts.length > 0) {
      console.log('filteredProducts : ' + JSON.stringify(filteredProducts));
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
            // setIsLoading(false)
            console.log('add to cart data : ' + JSON.stringify(data));
            if (data?.status && data?.statusCode == 200) {
              setTimeout(() => {
                homeRefetch();
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
      }
    } else {
      mutationAddProductToCart.mutate(cartData, {
        onSuccess: data => {
          // setIsLoading(false)
          console.log('add to cart data : ' + JSON.stringify(data));
          if (data?.status && data?.statusCode == 200) {
            setTimeout(() => {
              homeRefetch();
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
    }
  };

  const ProductItem: React.FC<{product: ProductList}> = ({product}) => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ProductDetails', {productItem: product})
        }
        style={styles.productviewStyle}>
        <Image source={{uri: product.imageUrl}} style={styles.image} />

        <View
          style={{
            marginHorizontal: horizontalScale(8),
            marginTop: verticalScale(8),
          }}>
          <Text style={[styles.name, {textAlign: 'left'}]}>
            {product.productName}
          </Text>
          <Text numberOfLines={1} style={styles.volumeStyle1}>
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

  const RecentProductItem: React.FC<{product: RecentOrderProduct}> = ({
    product,
  }) => {
    const navigation = useNavigation();
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ProductDetails', {productItem: product})
        }
        style={styles.productviewStyle}>
        <Image source={{uri: product.imageUrl}} style={styles.image} />

        <View
          style={{
            marginHorizontal: horizontalScale(8),
            marginTop: verticalScale(8),
          }}>
          <Text style={[styles.name, {textAlign: 'left'}]}>
            {product.productName}
          </Text>
          <Text numberOfLines={1} style={styles.volumeStyle1}>
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

  const renderProductOrder = (item: Order) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('OrderDetails', {orderId: item?.id})}
        style={{
          borderRadius: moderateScale(10),
          borderWidth: horizontalScale(1),
          borderColor: colors.BORDER_LINE,
          paddingHorizontal: horizontalScale(10),
          paddingVertical: verticalScale(10),
          backgroundColor: colors.WHITE,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[styles.dateTimeText, {flex: 1}]}>
            {moment(item.createdTime).fromNow()}
          </Text>
          {item.deliveryTime != null && (
            <Text style={[styles.dateTimeText, {textAlign: 'right'}]}>
              {getDeliveryTime(item.deliveryTime)}
            </Text>
          )}
        </View>

        <Text style={styles.titleStyle}>{'Order Id : ' + item.orderId}</Text>

        <Text style={styles.titleStyle}>
          {'To : ' +
            item.userAddressDto.houseNumber +
            ', ' +
            item.userAddressDto.street +
            ', ' +
            item.userAddressDto.city +
            ', ' +
            item.userAddressDto.state +
            ', ' +
            item.userAddressDto.pincode}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={[
              styles.titleStyle,
              {
                backgroundColor: colors.BORDER_LINE,
                paddingVertical: verticalScale(3),
                paddingHorizontal: horizontalScale(5),
                borderRadius: moderateScale(7),
              },
            ]}>
            {item.orderStatus?.replaceAll('_', ' ')}
          </Text>
          <Text style={[styles.amountStyle, {flex: 1, textAlign: 'right'}]}>
            {'Amount : ' + '₹' + item.finalPrice}
          </Text>
        </View>

        {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate('OrderDetails', {orderId: item?.id})
          }
          style={styles.viewOrderViewStyle}>
          <Text style={styles.orderTextStyle}>{'VIEW'}</Text>
        </TouchableOpacity> */}
      </TouchableOpacity>
    );
  };

  const baseOptions = {
    vertical: false,
    width: windowWidth,
    height: PAGE_WIDTH / 2,
  } as const;

  return (
    <View style={{flex: 1}}>
      <CustomHeader
        title=""
        isLogo={true}
        onCartPress={() => {
          navigation.navigate('Cart');
          // Handle cart press (e.g., navigate to cart screen)
          // console.log('Cart icon pressed');
        }}
        // onAddressPress={() => {
        //   navigation.navigate('AddressList');
        // }}
      />
      <View
        style={{
          paddingHorizontal: horizontalScale(12),
          paddingTop:
            homeData?.data?.deliveryEstimate != null
              ? verticalScale(4)
              : verticalScale(6),
          paddingBottom:
            homeData?.data?.deliveryEstimate != null
              ? verticalScale(6)
              : verticalScale(8),
          backgroundColor: colors.WHITE,
        }}>
        <TouchableOpacity
          onPress={() => setIsAddressModelShow(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <LocationIcon
            name="location"
            size={verticalScale(24)}
            color={colors.GREEN}
          />

          <View style={{marginStart: horizontalScale(9), flex: 1}}>
            {homeData?.data?.deliveryEstimate != null && (
              <Text style={styles.txtDeliveryLableStyle}>
                {getDeliveryTime(homeData?.data?.deliveryEstimate)}
              </Text>
            )}

            <Text numberOfLines={1} style={styles.dateText}>
              {selectedAddress?.houseNumber +
                ', ' +
                selectedAddress.street +
                ', ' +
                selectedAddress.city +
                ', ' +
                selectedAddress.state +
                ', ' +
                selectedAddress.pincode}
            </Text>
          </View>

          <LocationIcon
            name="chevron-down"
            size={verticalScale(20)}
            color={colors.GREEN}
          />
        </TouchableOpacity>
      </View>

      <View style={{height: horizontalScale(150), marginTop: verticalScale(8)}}>
        <Carousel
          {...baseOptions}
          loop
          enabled // Default is true, just for demo
          // ref={ref}
          defaultScrollOffsetValue={scrollOffsetValue}
          testID={'xxx'}
          width={Dimensions.get('screen').width - 20}
          height={verticalScale(160)}
          autoPlay={true}
          autoPlayInterval={2000}
          style={{borderRadius: moderateScale(10), alignSelf: 'center'}}
          data={bannerList}
          onScrollStart={() => {
            // console.log('===1');
          }}
          onScrollEnd={() => {
            // console.log('===2');
          }}
          onConfigurePanGesture={g => g.enabled(false)}
          pagingEnabled={true}
          // onSnapToItem={index => console.log('current index:', index)}
          renderItem={({item, index}) => (
            <SBItem img={item} key={index} index={index} />
          )}
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('SearchProductList')}
        style={styles.searchInput}>
        <SearchIcon name="search" size={22} color={colors.BLACK} />
        <Text style={styles.searchTextStyle}>{'Search Product'}</Text>
      </TouchableOpacity>

      <ScrollView>
        <View style={{flex: 1}}>
          {/* <SearchInput
            onChangeText={term => {
              setSearchTerm(term);
            }}
            aria-disabled
            style={[styles.searchInput]}
            placeholder="Search Product"
            placeholderTextColor={colors.GRAY}
            onSubmitEditing={() => {
              navigation.navigate('ProductListing',{searchProductText : searchTerm})
            }}
          /> */}

          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: verticalScale(45),
                paddingHorizontal: horizontalScale(10),
              }}>
              <CustomText
                viewStyle={{flex: 1}}
                textStyle={styles.txtCategoryLableStyle}>
                {'Category'}
              </CustomText>
              {categoryList.length > 0 && (
                <CustomText
                  enable
                  onPress={() => navigation.navigate('Explore')}
                  textStyle={styles.txtSeeAllStyle}>
                  {'See all'}
                </CustomText>
              )}
            </View>
            <FlatList
              contentContainerStyle={{flexGrow: 1}}
              data={categoryList}
              renderItem={({item}) => <CategoryItem product={item} />}
              keyExtractor={item => item?.id}
              horizontal
              ListEmptyComponent={() => (
                <ListEmptyComponent title={'Sorry! Categories not found.'} />
              )}
            />
          </View>

          <View
            style={{
              marginBottom: orderList.length > 0 ? verticalScale(100) : 0,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: verticalScale(45),
                paddingHorizontal: horizontalScale(10),
              }}>
              <CustomText
                viewStyle={{flex: 1}}
                textStyle={styles.txtCategoryLableStyle}>
                {'Product'}
              </CustomText>
              {productList.length > 0 && (
                <CustomText
                  enable
                  onPress={() => navigation.navigate('ProductListing')}
                  textStyle={styles.txtSeeAllStyle}>
                  {'See all'}
                </CustomText>
              )}
            </View>
            <FlatList
              contentContainerStyle={{flexGrow: 1}}
              data={productList}
              renderItem={({item}) => <ProductItem product={item} />}
              keyExtractor={item => item?.productId}
              horizontal
              ListEmptyComponent={() => (
                <ListEmptyComponent title={'Sorry! Products not found.'} />
              )}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: verticalScale(45),
                paddingHorizontal: horizontalScale(10),
              }}>
              <CustomText
                viewStyle={{flex: 1}}
                textStyle={styles.txtCategoryLableStyle}>
                {'Recent Order Product'}
              </CustomText>
              {/* {productList.length > 0 && (
                <CustomText
                  enable
                  onPress={() => navigation.navigate('ProductListing')}
                  textStyle={styles.txtSeeAllStyle}>
                  {'See all'}
                </CustomText>
              )} */}
            </View>
            <FlatList
              contentContainerStyle={{flexGrow: 1}}
              data={recentOrderProductList}
              renderItem={({item}) => <RecentProductItem product={item} />}
              keyExtractor={item => item?.productId}
              horizontal
              ListEmptyComponent={() => (
                <ListEmptyComponent title={'Sorry! Products not found.'} />
              )}
            />
          </View>

          {/* {orderList.length > 0 && (
            <View>
              <View
                style={{
                  height: verticalScale(35),
                  paddingHorizontal: horizontalScale(10),
                }}>
                <CustomText
                  viewStyle={{flex: 1}}
                  textStyle={styles.txtCategoryLableStyle}>
                  {'Orders'}
                </CustomText>
              </View>

              <FlatList
                contentContainerStyle={{
                  marginHorizontal: horizontalScale(14),
                  marginBottom: verticalScale(10),
                }}
                initialNumToRender={1}
                data={orderList}
                renderItem={({item}) => renderProductOrder(item)}
                keyExtractor={(item, index) => index}
                ListEmptyComponent={() => (
                  <ListEmptyComponent title={'Sorry! Order not found'} />
                )}
                ItemSeparatorComponent={props => {
                  return (
                    <View
                      style={{
                        height: verticalScale(10),
                      }}
                    />
                  );
                }}
              />
            </View>
          )} */}
        </View>
      </ScrollView>

      <AddressModal
        visible={isAddressModalShow}
        data={addressList}
        onClose={() => setIsAddressModelShow(false)}
        onPress={item => updateAddress(item)}
      />

      {orderList.length > 0 && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('OrderDetails', {orderId: orderList[0].id})
          }
          style={{
            width: '94%',
            backgroundColor: colors.GREEN,
            borderRadius: moderateScale(12),
            position: 'absolute',
            bottom: verticalScale(10),
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            alignSelf: 'center',
            paddingVertical: verticalScale(7),
            paddingHorizontal: horizontalScale(7),
            flexDirection: 'row',
          }}>
          <View>
            {orderList[0].orderProductDtoList?.length > 0 && (
              <Image
                style={{
                  width: horizontalScale(70),
                  height: verticalScale(65),
                  resizeMode: 'cover',
                  borderRadius: moderateScale(10),
                  overflow: 'hidden',
                }}
                source={{uri: orderList[0].orderProductDtoList[0]?.imageUrl}}
              />
            )}
          </View>

          <View style={{marginStart: horizontalScale(8), flex: 1}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={[
                  styles.orderDateTimeText,
                  {flex: 1, textAlign: 'left'},
                ]}>
                {moment(orderList[0].createdTime).fromNow()}
              </Text>
              <Text
                style={[
                  styles.orderTitleStyle,
                  {
                    backgroundColor: colors.BORDER_LINE,
                    paddingVertical: verticalScale(2),
                    paddingHorizontal: horizontalScale(8),
                    borderRadius: moderateScale(7),
                    fontSize: moderateScale(10),
                    alignSelf: 'flex-start',
                    color: colors.BLACK,
                  },
                ]}>
                {orderList[0].orderStatus == 'RETURNED'
                  ? 'EXCHANGE'
                  : orderList[0].orderStatus?.replaceAll('_', ' ')}
              </Text>
            </View>

            {orderList[0].orderStatus == 'RETURNED' ? (
              <Text style={[styles.orderDateTimeText]}>
                {'Status : ' +
                  orderList[0].returnCompletionStatus?.replaceAll('_', ' ')}
              </Text>
            ) : (
              orderList[0].deliveryTime != null &&
              orderList[0].orderCompletionStatus != 'COMPLETED' && (
                <Text style={[styles.orderDateTimeText]}>
                  {getDeliveryTime(orderList[0].deliveryTime)}
                </Text>
              )
            )}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: verticalScale(3),
              }}>
              <Text style={[styles.orderTitleStyle, {flex: 1}]}>
                {'Order Id : ' + orderList[0].orderId}
              </Text>
              <Text style={styles.orderTitleStyle}>
                {'Amount : ' + '₹' + orderList[0].finalPrice}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
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
    width: horizontalScale(140),
    // height: verticalScale(200),
    margin: moderateScale(6),
    backgroundColor: '#fff',
    borderRadius: moderateScale(9),
    // elevation: 1,
    paddingTop: verticalScale(16),
    // alignItems: 'center',
  },
  image: {
    width: '85%',
    height: verticalScale(100),
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: moderateScale(10),
  },
  imageCategory: {
    width: '85%',
    height: verticalScale(100),
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: moderateScale(10),
  },
  name: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.BOLD,
    marginVertical: 5,
    color: colors.BLACK,
    textAlign: 'center',
  },
  price: {
    fontSize: moderateScale(14),
    color: colors.TxtYellow,
  },
  txtCategoryLableStyle: {
    fontSize: moderateScale(16),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
  },
  txtDeliveryLableStyle: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.BOLD,
    color: colors.BLACK,
    marginTop: verticalScale(3),
  },
  txtSeeAllStyle: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.MEDIUM,
    color: colors.GREEN,
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
    marginTop: verticalScale(2),
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
  plusMinusIconView: {
    width: horizontalScale(34),
    height: verticalScale(35),
    backgroundColor: colors.GREEN,
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  productviewStyle: {
    width: horizontalScale(150),
    margin: moderateScale(6),
    paddingVertical: verticalScale(10),
    backgroundColor: '#fff',
    borderRadius: moderateScale(14),
    borderWidth: moderateScale(1),
    borderColor: colors.BORDER_LINE,
  },
  outOfStockStyle: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.WHITE,
    textAlign: 'right',
    lineHeight: verticalScale(13),
    paddingVertical: verticalScale(6),
  },
  searchInput: {
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: moderateScale(10),
    color: colors.BLACK,
    height: verticalScale(45),
    fontSize: moderateScale(14),
    marginHorizontal: horizontalScale(12),
    marginVertical: verticalScale(8),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
  },
  searchTextStyle: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.GRAY,
    marginStart: horizontalScale(6),
  },
  dateText: {
    fontSize: moderateScale(11),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
  },
  dateTimeText: {
    fontSize: moderateScale(11),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
  },
  titleStyle: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
    marginTop: verticalScale(6),
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
    color: colors.WHITE,
  },
  viewOrderViewStyle: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginTop: verticalScale(10),
    backgroundColor: colors.GREEN,
    borderRadius: moderateScale(4),
    paddingHorizontal: horizontalScale(7),
    paddingVertical: verticalScale(2),
  },
  orderTitleStyle: {
    fontSize: moderateScale(10),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.WHITE,
  },
  orderDateTimeText: {
    fontSize: moderateScale(10),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.WHITE,
    marginTop: verticalScale(2),
  },
});
