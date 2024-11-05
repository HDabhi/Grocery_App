import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Icon library
import CustomButton from '../../component/customButton';
import CustomHeader from '../../component/CustomHeader';
import FONTS from '../../component/fonts';
import ListEmptyComponent from '../../component/listEmptyComponent';
import { UserAddress } from '../../services/address/api';
import {
  useGetAddressList,
  useUpdateAddressList,
} from '../../services/address/hooks';
import { useAuth } from '../../stores/auth';
import colors from '../../utils/colors';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';

export const AddressList: React.FC = () => {
  const navigation = useNavigation();
  const {data: addressData, error, isLoading, refetch} = useGetAddressList();
  const mutationUpdateAddressData = useUpdateAddressList();
  const [addressList, setAddressList] = useState([]);
  const {changeAddressId} = useAuth.use.actions();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  useEffect(() => {
    if (addressData) {
      if (addressData.status && addressData.statusCode === 200) {
        const filteredData = addressData?.data?.filter(item => item.status === true);
        setAddressList(filteredData);
      } else {
        Toast.show({
          type: 'error',
          text1: addressData?.message,
          visibilityTime:4000
        });
      }
    }
  }, [addressData]);

  const updateAddress = (item: UserAddress) => {
    const data = item;

    // Remove properties
    delete data.createdTime;
    delete data.updatedTime;

    // Update the `primary` field
    data.primary = true;

    mutationUpdateAddressData.mutate(data, {
      onSuccess: data => {
        if (data?.status && data?.statusCode == 200) {
          changeAddressId(data?.data?.id);
          setTimeout(() => {
            refetch();
          }, 100);
        } else {
          Toast.show({
            type: 'error',
            text1: data?.message,
            visibilityTime:4000
          });
        }
      },
      onError: error => {
        // setIsLoading(false)
        console.log('Address error : ' + JSON.stringify(error));
      },
    });
  };

  const deleteAddress = (item: UserAddress) => {
    const data = item;

    // Remove properties
    delete data.createdTime;
    delete data.updatedTime;

    // Update the `status` field
    data.status = false;

    mutationUpdateAddressData.mutate(data, {
      onSuccess: data => {
        if (data?.status && data?.statusCode == 200) {
          setTimeout(() => {
            refetch();
          }, 100);
        } else {
          Toast.show({
            type: 'error',
            text1: data?.message,
            visibilityTime:4000
          });
        }
      },
      onError: error => {
        console.log('delete error : ' + JSON.stringify(error));
      },
    });
  };

  const deleteAddressAlert = (item: UserAddress) => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout Cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => deleteAddress(item),
        },
      ],
      {cancelable: false},
    );
  };

  const renderAddressData = (item: UserAddress) => {
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
          <TouchableOpacity
            onPress={() => updateAddress(item)}
            style={style.radioCircle}>
            <View style={[item.primary && style.selectedRadioCircle]} />
          </TouchableOpacity>
          <View style={{marginStart: horizontalScale(10), flex: 1}}>
            <Text style={style.dateText}>
              {item.houseNumber + ', ' + item.street}
            </Text>

            <Text style={style.dateText}>
              {item.city + ', ' + item.state + ', ' + item.pincode}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              width: horizontalScale(30),
              alignItems: 'center',
            }}
            onPress={() =>
              navigation.navigate('UpdateAddress', {addressItem: item})
            }>
            <Icon name="edit" size={horizontalScale(26)} color={colors.GREEN} />
          </TouchableOpacity>

          {!item.primary && (
            <TouchableOpacity
              style={{
                width: horizontalScale(30),
                alignItems: 'center',
                marginStart: horizontalScale(5),
              }}
              onPress={() => deleteAddressAlert(item)}>
              <Icon name="delete" size={horizontalScale(26)} color={'red'} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <CustomHeader
        title="Delivery Address"
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        contentContainerStyle={{
          marginHorizontal: horizontalScale(20),
          flex: 1,
          marginTop: verticalScale(10),
        }}
        data={addressList}
        renderItem={({item}) => renderAddressData(item)}
        keyExtractor={(item, index) => index}
        ListEmptyComponent={() => (
          <ListEmptyComponent title={'No any Address'} />
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

      <CustomButton
        buttonStyle={{
          marginHorizontal: horizontalScale(20),
          marginVertical: verticalScale(20),
        }}
        title="Add New Address"
        onPress={() => navigation.navigate('AddNewAddress')}
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
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
});
