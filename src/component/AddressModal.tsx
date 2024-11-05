import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {horizontalScale, moderateScale, verticalScale} from '../utils/Metrics';
import ListEmptyComponent from './listEmptyComponent';
import {UserAddress} from '../services/address/api';
import colors from '../utils/colors';
import FONTS from './fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface AddressModelProps {
  visible: boolean;
  data: any;
  onClose: () => void;
  onPress: () => void;
}

const AddressModal: React.FC<AddressModelProps> = ({
  visible,
  data,
  onClose,
  onPress,
}) => {
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
            onPress={() => onPress(item)}
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
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={style.modalContainer}>
        <View style={style.modalContent}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: verticalScale(10),
            }}>
            <Text style={style.checkoutTextStyle}>{'Choose Address'}</Text>
            <Ionicons
              style={{alignSelf: 'flex-end'}}
              onPress={onClose}
              name="close-circle-outline"
              size={30}
              color={colors.TxtYellow}
            />
          </View>

          <FlatList
            data={data}
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
        </View>
      </View>
    </Modal>
  );
};

export default AddressModal;

const style = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
    backgroundColor: 'white',
    borderRadius: moderateScale(20),
    height: verticalScale(450),
  },
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
  checkoutTextStyle: {
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
    fontSize: moderateScale(16),
    flex: 1,
  },
});
