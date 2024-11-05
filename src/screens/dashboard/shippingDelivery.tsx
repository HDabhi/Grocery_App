import {ScrollView, StyleSheet, Text, View} from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import colors from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';
import FONTS from '../../component/fonts';

export const ShippingDelivery: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <CustomHeader
        title="Shipping & Delivery Policy"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: horizontalScale(14),
          marginVertical: verticalScale(1),
        }}>
        <View style={{flex: 1}}>
          <Text style={style.textTitle}>{'Shipping and Delivery Policy'}</Text>
          <Text
            style={
              style.textValue
            }>{`1. To ensure that your order reaches you in our standard time (within 1 hr. after confirmation of order) and in good condition, we will ship through standard delivery partners like Delhivery, FedEx, Xpressbees, Gati, Dotzot, Ecom Express and many more.

Note: If we ship through postal service then it may take more time.`}</Text>

          <Text style={style.textTitle}>
            {'Transport or bulk order takes 24 to 48 hrs to be dispatched.'}
          </Text>
          <Text
            style={
              style.textValue
            }>{`2. If you are a new user then our executive will contact you and confirm your order (For perfect delivery our executive will confirm your exact delivery address and pin code). If your Pincode is not serviceable or we are not able to send the material, then you have to give us another address and pin code.

3. If you believe that the product is not in good condition, or if the packaging is tampered with or damaged before accepting delivery of the goods, please refuse to take delivery of the package, click some pictures of the package and write instruction to courier boy (The package is tampered or damaged in courier so, I will not accept the order) and send us a mail at contact@farmsanta.com mentioning your order reference number and attached pictures or call our Customer Care. We shall make our best efforts to ensure that a replacement delivery is made to you at the earliest.

4. Delivery time mentioned on the product, cart page or website is estimated. Actual delivery time is based on the availability of a product, weather condition and address where the product is to be delivered and courier company's rules.

5. We try our best to get your product delivered, you have purchased the product from our platform to be delivered to you, we will try our best to deliver, our courier partner will try their best to deliver, but for some reason, if the product may not be delivered or it is late, and due to that if any loss occurs to you note that FarmSanta is not responsible.

Note: If your address is ODA location then, you have to self-collect the parcel from the Farmsanta retail store. We will provide a Farmsanta retail store address and number. Also, our customer care executive will keep in touch with you.

6. For any issues in utilizing our services you may contact us.`}</Text>

<Text style={style.textTitle}>{'Contact us'}</Text>
          <Text
            style={
              style.textValue
            }>{`If you have any questions about this Privacy Policy, the practices of this Sites and Mobile Applications, or your dealings with this Sites and Mobile Applications, please contact us at:`}</Text>

          <Text style={style.textTitle}>{'CORPORATE ADDRESS'}</Text>
          <Text style={style.textTitle}>{'Head Office'}</Text>

          <Text
            style={
              style.textValue
            }>{`FarmSanta Private Limited, Arch Square, X2, unit no. 609, 6th floor, EP block, Salt Lake, sector-V, Kolkata, West Bengal - 700091

Write to us at contact@farmsanta.com`}</Text>
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
    fontSize: moderateScale(12),
    color: colors.BLACK,
    fontFamily: FONTS.MEDIUM,
    marginBottom: verticalScale(7),
  },
});
