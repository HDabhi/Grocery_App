import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Icon library
import LogoutIcon from 'react-native-vector-icons/MaterialIcons'; // Icon library
import LocationIcon from 'react-native-vector-icons/Octicons'; // Icon library
import FileIcon from 'react-native-vector-icons/FontAwesome5'; // Icon library
import {horizontalScale, moderateScale, verticalScale} from '../utils/Metrics';
import colors from '../utils/colors';
import FONTS from './fonts';
import {useAuth} from '../stores/auth';

type CustomHeaderProps = {
  isLogo?: boolean;
  title?: string;
  onMenuPress?: () => void;
  onCartPress?: () => void;
  onBackPress?: () => void;
  onFilterPress?: () => void;
  onAddressPress?: () => void;
  onLogoutPress?: () => void;
  onFileDownloadPress?: () => void
};

const CustomHeader: React.FC<CustomHeaderProps> = ({
  isLogo,
  title,
  onCartPress,
  onBackPress,
  onMenuPress,
  onFilterPress,
  onAddressPress,
  onLogoutPress,
  onFileDownloadPress
}) => {
  // Use the Zustand `useAuth` hook directly to get the cartCount and reactively update the component
  const cartCount = useAuth(state => state.cartCount);
  const [cartQty, setCartQty] = useState(cartCount);

  // Effect to sync local state `cartQty` whenever `cartCount` changes
  useEffect(() => {
    if (cartCount == undefined) {
      setCartQty(0);
    } else {
      setCartQty(cartCount);
    }
  }, [cartCount]);

  return (
    <View style={[styles.headerContainer]}>
      {onBackPress && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: horizontalScale(6),
            width: horizontalScale(40),
            zIndex: 999,
          }}
          onPress={onBackPress}>
          <Icon
            name="chevron-back"
            size={horizontalScale(32)}
            color={colors.GREEN}
          />
        </TouchableOpacity>
      )}

      {isLogo && (
        <Image
          style={styles.imgStyle}
          source={require('../../assets/images/FarmSanta.png')}
        />
      )}

      {title && (
        <Text
          style={[
            styles.headerTitle,
            {marginStart: onBackPress ? horizontalScale(2) : 0},
          ]}>
          {title}
        </Text>
      )}

      <View style={styles.viewStyle}>
        {onCartPress && (
          <TouchableOpacity
            style={{
              backgroundColor: '#F5F5F5',
              width: horizontalScale(35),
              height: horizontalScale(35),
              borderRadius: horizontalScale(35 / 2),
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={onCartPress}>
            <Icon name="cart-outline" size={20} color={colors.GREEN} />
            <View
              style={{
                position: 'absolute',
                top: moderateScale(-5),
                right: moderateScale(-2),
                width: horizontalScale(17),
                height: horizontalScale(17),
                borderRadius: horizontalScale(17 / 2),
                backgroundColor: colors.GREEN,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: colors.WHITE,
                  fontSize: moderateScale(11),
                  fontFamily: FONTS.SEMI_BOLD,
                  lineHeight: moderateScale(11),
                  marginTop: moderateScale(1),
                }}>
                {cartQty}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {onAddressPress && (
          <TouchableOpacity
            style={{marginStart: horizontalScale(14)}}
            onPress={onAddressPress}>
            <LocationIcon
              name="location"
              size={verticalScale(26)}
              color={colors.GREEN}
            />
          </TouchableOpacity>
        )}

        {onLogoutPress && (
          <TouchableOpacity
            style={{marginStart: horizontalScale(14)}}
            onPress={onLogoutPress}>
            <LogoutIcon
              name="logout"
              size={verticalScale(26)}
              color={colors.GREEN}
            />
          </TouchableOpacity>
        )}
        
        {onFileDownloadPress && (
          <TouchableOpacity
            style={{marginStart: horizontalScale(14)}}
            onPress={onFileDownloadPress}>
            <FileIcon
              name="file-invoice"
              size={verticalScale(26)}
              color={colors.GREEN}
            />
          </TouchableOpacity>
        )}

        {onFilterPress && (
          <TouchableOpacity
            style={{
              marginStart: horizontalScale(10),
              width: horizontalScale(30),
              height: verticalScale(30),
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={onFilterPress}>
            <Icon
              style={{marginTop: moderateScale(3)}}
              size={moderateScale(20)}
              name="filter"
              color={colors.BLACK}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    height: verticalScale(56),
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER_LINE,
  },
  headerTitle: {
    fontSize: moderateScale(17),
    fontFamily: FONTS.BOLD,
    color: colors.BLACK,
    flex: 1,
    textAlign: 'center',
  },
  imgStyle: {
    width: horizontalScale(100),
    height: verticalScale(40),
    resizeMode: 'cover',
    marginStart: horizontalScale(8),
  },
  viewStyle: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: horizontalScale(14),
  },
  filterImgStyle: {
    width: horizontalScale(16),
    height: verticalScale(16),
    resizeMode: 'contain',
    marginStart: horizontalScale(8),
  },
});

export default CustomHeader;
