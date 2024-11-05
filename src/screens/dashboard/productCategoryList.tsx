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
} from 'react-native';
import SearchInput, {createFilter} from 'react-native-search-filter';

import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';
import colors from '../../utils/colors';
import CustomHeader from '../../component/CustomHeader';
import {useGetCategory} from '../../services/productCategory/hooks';
import FONTS from '../../component/fonts';
import ListEmptyComponent from '../../component/listEmptyComponent';
import {useAuth} from '../../stores/auth';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';

const KEYS_TO_FILTERS = ['name'];

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
export const ProductCategoryList: React.FC = () => {
  const windowWidth = useWindowDimensions().width;
  const navigation = useNavigation();
  const {cartCount} = useAuth.getState();
  const {
    data: categoryData,
    isLoading,
    error,
    refetch: refetchCategory,
  } = useGetCategory();

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategoryList, setSearchCategoryList] = useState<Category[]>([]);

  useFocusEffect(
    useCallback(() => {
      refetchCategory();
    }, []),
  );

  useEffect(() => {
    if (categoryData) {
      if (categoryData.status && categoryData.statusCode === 200) {
        const categories = categoryData.data;
        const filterCategoryList = categories?.filter(
          category => category.status == true,
        );
        setCategoryList(filterCategoryList);
        setSearchCategoryList(filterCategoryList);
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
    const filteredCategory = categoryList.filter(
      createFilter(searchTerm, KEYS_TO_FILTERS),
    );
    console.log('filteredCategory : ' + JSON.stringify(filteredCategory));
    setSearchCategoryList(filteredCategory);
  }, [searchTerm]);

  const ProductItem: React.FC<{product: Category}> = ({product}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ProductListing', {categoryId: product.id})
        }
        style={styles.item}>
        <Image source={{uri: product?.imageUrl}} style={styles.image} />
        {/* <Image source={require('../../../assets/images/category.png')} style={styles.image} /> */}
        <View
          style={{
            marginHorizontal: horizontalScale(8),
            marginVertical: verticalScale(8),
          }}>
          <Text numberOfLines={2} style={styles.name}>
            {product?.name}
          </Text>
          {/* <Text style={styles.price}>{product.price}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <CustomHeader
        title="Category"
        isLogo={false}
        onCartPress={() => {
          navigation.navigate('Cart');
          // Handle cart press (e.g., navigate to cart screen)
          // console.log('Cart icon pressed');
        }}
      />

      <SearchInput
        onChangeText={term => {
          setSearchTerm(term);
        }}
        style={[styles.searchInput]}
        placeholder="Search Category"
        placeholderTextColor={colors.GRAY}
        clearIcon={
          <Icon name="close" size={verticalScale(26)} color={colors.BLACK} />
        }
      />

      <FlatList
        data={searchCategoryList}
        renderItem={({item}) => <ProductItem product={item} />}
        keyExtractor={item => item?.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={() => (
          <ListEmptyComponent title={'Sorry! Categories not found.'} />
        )}
      />
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
    // flex: 1,
    width: '47%',
    margin: moderateScale(6),
    backgroundColor: '#fff',
    borderRadius: moderateScale(14),
    borderWidth: moderateScale(1),
    borderColor: colors.BORDER_LINE,
    // elevation: 1,
    // paddingTop: verticalScale(16),
    // alignItems: 'center',
  },
  image: {
    marginTop: verticalScale(16),
    width: '75%',
    height: verticalScale(100),
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: moderateScale(10)
  },
  name: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.BOLD,
    marginVertical: verticalScale(3),
    marginHorizontal: horizontalScale(10),
    color: colors.BLACK,
    textAlign: 'center',
  },
  price: {
    fontSize: moderateScale(14),
    color: colors.TxtYellow,
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
});
