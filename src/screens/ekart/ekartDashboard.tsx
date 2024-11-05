import {Alert, FlatList, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import colors from '../../utils/colors';
import CustomHeader from '../../component/CustomHeader';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useLogout} from '../../stores/auth';
import {useCallback, useEffect, useState} from 'react';
import { useGetOrderList } from '../../services/orderList/hooks';
import { Order } from '../../services/orderList/api';
import Toast from 'react-native-toast-message';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/Metrics';
import moment from 'moment';
import { getDeliveryTime } from '../../utils/responsiveUI';
import ListEmptyComponent from '../../component/listEmptyComponent';
import FONTS from '../../component/fonts';

export const EkartDashboard: React.FC = () => {
  const navigation = useNavigation();
  const {mutate: logout} = useLogout();
//   {
//     "orderStatus": "PENDING",
//     "deliveryTime": "00:15",
//     "orderCompletionStatus": "INITIATED",
//     "id": "9aaa8cb5-4e35-41c1-a841-5649a9f78b27"
//   }

const {data: orderData, error, isLoading, refetch} = useGetOrderList(1);

  const [orderList, setOrderList] = useState<Order[]>([]);

  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        refetch()
      }, 10000); // Call APIs every 5 seconds

      return () => clearInterval(interval);
    }, []),
  );

  useEffect(() => {
    if (orderData) {
      if (orderData.status && orderData.statusCode === 200) {
        const filteredData = orderData?.data.filter(order => 
            order.accepted === true
        );
        setOrderList(filteredData);
        // order.accepted === true && order.orderCompletionStatus === "COMPLETED"
      } else {
        Toast.show({
          type: 'error',
          text1: orderData?.message,
          visibilityTime: 4000,
        });
      }
    }
  }, [orderData]);

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
          {item.deliveryTime != null && item.orderStatus != 'COMPLETED' && (
            <Text style={[style.dateTimeText, {textAlign: 'right'}]}>
              {getDeliveryTime(item.deliveryTime)}
            </Text>
          )}
        </View>

        <Text style={style.titleStyle}>
          {'Order Id : ' + item.orderId}
        </Text>

        <Text style={style.titleStyle}>
          {'Payment Type : ' + item.paymentType?.replaceAll('_', ' ')}
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
            navigation.navigate('EKartDetails', {orderId: item?.id})
          }
          style={style.viewOrderViewStyle}>
          <Text style={style.orderTextStyle}>{'VIEW ORDER'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const showLogoutAlert = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout Cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: logout,
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <CustomHeader title="Dashboard" onLogoutPress={() => showLogoutAlert()} />

      <FlatList
        contentContainerStyle={{
          marginHorizontal: horizontalScale(10),
          paddingVertical: verticalScale(10),
        }}
        data={orderList}
        renderItem={({item}) => renderProductOrder(item)}
        keyExtractor={(item, index) => index}
        ListEmptyComponent={() => <ListEmptyComponent title={'No any Order'} />}
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