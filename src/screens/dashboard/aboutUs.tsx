import {ScrollView, StyleSheet, Text, View} from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import colors from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import { horizontalScale, moderateScale, verticalScale } from '../../utils/Metrics';
import FONTS from '../../component/fonts';

export const AboutUs: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <CustomHeader title="About Us" onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: horizontalScale(14),
          marginVertical: verticalScale(1),
        }}>
        <View style={{flex: 1}}>
          <Text style={style.textValue}>{`Welcome to Fatmsanta Private Limited, your trusted partner in delivering the freshest and highest quality fruits and vegetables. With a commitment to sustainability and a passion for promoting healthy living, we source only the best produce from our and our partner's farms.

Since our founding, we have been dedicated to ensuring that every fruit and vegetable that reaches your table is packed with nutrition and flavor. We believe in the power of nature, and that's why we are committed to chemical free farming practices, supporting fair trade, and reducing our carbon footprint.

At FarmSanta Private Limited, we prioritize customer satisfaction through exceptional service, timely delivery, and a broad variety of produce that caters to the unique needs of every household, restaurant, and grocery store Whether you're looking for seasonal specialties or everyday staples, you can count on us to bring farm-fresh goodness to your door.

Our mission is simple: to nourish your body and mind by offering natural and wholesome products that enhance your well-being and contribute to a sustainable future. 

Thank you for choosing Farmsanta Private Limited. Together, let's grow a healthier world.`}</Text>
          </View>
          </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  textTitle: {
    fontSize: moderateScale(15),
    color: colors.BLACK,
    fontFamily: FONTS.BOLD,
    marginBottom: verticalScale(7),
  },
  textValue: {
    fontSize: moderateScale(14),
    color: colors.BLACK,
    fontFamily: FONTS.MEDIUM,
    marginTop: verticalScale(7),
  },
});

