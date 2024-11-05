import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../utils/colors';
import CustomHeader from '../../component/CustomHeader';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useGetOrderList} from '../../services/orderList/hooks';
import {useCallback, useEffect, useState} from 'react';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';
import ListEmptyComponent from '../../component/listEmptyComponent';
import moment from 'moment';
import {Order} from '../../services/orderList/api';
import FONTS from '../../component/fonts';
import Toast from 'react-native-toast-message';
import {getDeliveryTime} from '../../utils/responsiveUI';
import { useSocket } from '../../utils/socketProvider';
import Spinner from '../../component/spinner';

export const OrderListing: React.FC = () => {
  const navigation = useNavigation();
  const [pageNumber,setPageNumber] = useState(1)
  const {data: orderData, error, isFetching,isLoading, refetch} = useGetOrderList(pageNumber);
  const {isConnected, messages} = useSocket();

  const [orderList, setOrderList] = useState<Order[]>([]);
  const [hasMore, setHasMore] = useState(true)
  useFocusEffect(
    useCallback(() => {
      refetch()
    }, []),
  );

  useEffect(() => {
    if (orderData) {
      if (orderData.status && orderData.statusCode === 200) {
        if(orderData?.data.length > 0){
          setOrderList(prevData => [...prevData, ...orderData.data]);
        }
        else{
          setHasMore(false)
        }
      } else {
        Toast.show({
          type: 'error',
          text1: orderData?.message,
          visibilityTime: 4000,
        });
      }
    }
  }, [orderData]);

  useEffect(() => {
    if(messages && Object.keys(messages).length != 0){
      const socketdata = JSON.parse(messages)
      const updatedOrders = orderList.map((order) =>
        order.id === socketdata?.id
          ? { ...order, orderStatus: socketdata?.orderStatus, deliveryTime: socketdata?.deliveryTime }
          : order
      );
      setOrderList(updatedOrders);
    }

  },[messages])

  const renderProductOrder = (item: Order) => {
    return (
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
            {moment(item.createdTime).fromNow()}
          </Text>
          {item.deliveryTime != null && item.orderCompletionStatus != 'COMPLETED' && (
            <Text style={[style.dateTimeText, {textAlign: 'right'}]}>
              {getDeliveryTime(item.deliveryTime)}
            </Text>
          )}
        </View>

        <Text style={style.titleStyle}>
          {'Order Id : ' + item.orderId}
        </Text>

        <Text style={style.titleStyle}>
          {'Payment Type : ' + item.paymentType.replaceAll('_', ' ')}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[style.titleStyle, {flex: 1}]}>
            {'Status : ' + item.orderStatus?.replaceAll('_', ' ')}
          </Text>
          <Text style={style.amountStyle}>
            {'Amount : ' + '₹' + item.finalPrice}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('OrderDetails', {orderId: item?.id})
          }
          style={style.viewOrderViewStyle}>
          <Text style={style.orderTextStyle}>{'VIEW ORDER'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const loadMore = () => {
    if (hasMore) {
      setPageNumber(prevPage => prevPage + 1);
      refetch()
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <Spinner visible={isLoading || isFetching}/>
      <CustomHeader title="My Orders" onBackPress={() => navigation.goBack()} />

      <FlatList
        contentContainerStyle={{
          marginHorizontal: horizontalScale(20),
          paddingVertical: verticalScale(10),
        }}
        data={orderList}
        renderItem={({item}) => renderProductOrder(item)}
        keyExtractor={(item, index) => index}
        ListEmptyComponent={() => {!isLoading && !isFetching && <ListEmptyComponent title={'No Order found'} /> } }
        ItemSeparatorComponent={props => {
          return (
            <View
              style={{
                height: verticalScale(10),
              }}
            />
          );
        }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5} // Triggers when 50% from the bottom
      />
    </View>
  );
};

const style = StyleSheet.create({
  dateText: {
    fontSize: moderateScale(14),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
  },
  dateTimeText: {
    fontSize: moderateScale(13),
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
    color: colors.GREEN,
  },
  viewOrderViewStyle: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
});
