import React, {forwardRef} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  StyleProp,
  TextStyle,
} from 'react-native';
import {horizontalScale, moderateScale, verticalScale} from '../utils/Metrics';
import FONTS from './fonts';
import colors from '../utils/colors';
import PhoneIcon from 'react-native-vector-icons/FontAwesome';
import UserIcon from 'react-native-vector-icons/Feather';
import EmailIcon from 'react-native-vector-icons/Zocial';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface CustomTextInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<TextStyle>;
  label?: string;
  error?: string;
  isDropDown?: boolean;
  list?: any[]
}

const renderItem = (item: any) => {
  return (
    <View style={styles.item}>
      <Text style={styles.textItem}>{item.label}</Text>
    </View>
  );
};

const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>(
  (
    {
      value,
      onChangeText,
      placeholder,
      style,
      label,
      error,
      isDropDown,
      list,
      ...props
    },
    ref,
  ) => {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View
          style={[
            styles.viewInputStyle,
            {flexDirection: 'row', alignItems: 'center'},
          ]}>
          {/* {label == 'phone' && (
            <PhoneIcon
              style={styles.iconStyle}
              name="phone"
              size={moderateScale(20)}
            />
          )}

          {label == 'user' && (
            <UserIcon
              style={styles.iconStyle}
              name="user"
              size={moderateScale(20)}
            />
          )}

          {label == 'email' && (
            <EmailIcon
              style={styles.iconStyle}
              name="email"
              size={moderateScale(20)}
            />
          )} */}
          {isDropDown ? (
            <Dropdown
              // ref={ref}
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={list}
              // search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={placeholder}
              // searchPlaceholder="Search..."
              value={value}
              onChange={item => {
                onChangeText(item)
              }}
              renderItem={renderItem}
              confirmSelectItem
            />
          ) : (
            <TextInput
              ref={ref}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor={colors.GRAY}
              style={[styles.input, style]}
              {...props}
            />
          )}
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(20),
  },
  label: {
    fontSize: moderateScale(13),
    color: colors.GRAY,
    fontFamily: FONTS.MEDIUM,
  },
  viewInputStyle: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    height: verticalScale(45),
    // borderRadius: 5,
    // backgroundColor: colors.LIGHT_GRAY,
  },
  input: {
    flex: 1,
    fontSize: moderateScale(14.5),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
  },
  error: {
    marginTop: verticalScale(4),
    color: 'red',
    fontSize: moderateScale(12),
    fontFamily: FONTS.REGULAR,
  },
  dropdown: {
    height: verticalScale(45),
    backgroundColor: 'white',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flex:1
  },
  icon: {
    marginRight: 0,
  },
  item: {
    padding: horizontalScale(11),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: moderateScale(14.5),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
  },
  placeholderStyle: {
    fontSize: moderateScale(14.5),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.GRAY,
  },
  selectedTextStyle: {
    fontSize: moderateScale(14.5),
    fontFamily: FONTS.SEMI_BOLD,
    color: colors.BLACK,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  }
});

export default CustomTextInput;
