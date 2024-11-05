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

export const RefundReturn: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <CustomHeader
        title="Refund & Cancellation Policy"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: horizontalScale(14),
          marginVertical: verticalScale(1),
        }}>
        <View style={{flex: 1}}>
          <Text style={style.textTitle}>{'Refund Policy'}</Text>

          <Text
            style={
              style.textValue
            }>{`FarmSanta's Return and Exchange Policy offers no return of goods once delivered. If you choose to exchange the item for reason of mismatch of product or receipt of a defective or expired item, you will be provided with a replacement of the item, free of cost. However, an exchange is subject to the availability of the product in our stock.`}</Text>

          <Text style={style.textTitle}>
            {'The following EXCEPTIONS and RULES apply to this Policy.'}
          </Text>
          <Text
            style={
              style.textValue
            }>{`1. All items to be returned or exchanged must be unused and in their original condition with all original labels and packaging intact and should not be broken or tampered with.

2. Exchanges are allowed only if your address is serviceable for an Exchange by our logistics team.

3. In case you had purchased a product which has a free gift/offer associated with it and you wish to return the item, maximum of Refunds/Free item MRP will be debited until the satisfactory receipt of all free gift(s)/offer item(s) that are shipped along with it.

4. If you choose to self-ship your returns, kindly pack the items securely to prevent any loss or damage during transit. For all self-shipped returns, we recommend you use a reliable courier service.

5. Perishable goods such as seeds and flowers cannot be returned if the packet is opened or damaged.

6. Products must be returned on the same day of the day of delivery, To return your purchase, please mail customer care at contact@farmsanta.com.`}</Text>

          <Text style={style.textTitle}>
            {
              'To complete your return, we require a receipt or proof of purchase.'
            }
          </Text>
          <Text style={style.textTitle}>
            {'Please do not send your purchase back to the manufacturer.'}
          </Text>
          <Text style={style.textTitle}>{'Refunds (if applicable)'}</Text>
          <Text
            style={
              style.textValue
            }>{`Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.

If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within 7 to 10 Working days.`}</Text>
          <Text style={style.textTitle}>
            {'Late or missing refunds (if applicable)'}
          </Text>
          <Text
            style={
              style.textValue
            }>{`• If you haven’t received a refund yet, first check your bank account again.

• Then contact your credit card company, it may take some time before your refund is officially posted.

• Next contact your bank. There is often some processing time before a refund is posted.

• If you’ve done all of this and you still have not received your refund yet, please contact us at info@farmsanta.com.`}</Text>
          <Text style={style.textTitle}>{'Exchanges (if applicable)'}</Text>
          <Text
            style={
              style.textValue
            }>{`We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at contact@farmsanta.com and send your item to:`}</Text>

          <Text style={style.textTitle}>{'Farmsanta Pvt Ltd,'}</Text>
          <Text
            style={
              style.textValue
            }>{`Dn-10, DN Block, Sector V, Bidhannagar, Kolkata, West Bengal 700091`}</Text>

          <Text style={style.textTitle}>{'Governing Law'}</Text>
          <Text
            style={
              style.textValue
            }>{`These terms shall be governed by and constructed in accordance with the laws of India without reference to conflict of laws principles and disputes arising in relation hereto shall be subject to the exclusive jurisdiction of the courts at Kolkata, West Bengal.`}</Text>

          <Text style={style.textTitle}>{'Shipping'}</Text>
          <Text style={style.textValue}>
            {'To return your product, you should mail your product to:'}
          </Text>

          <Text style={style.textTitle}>{'Farmsanta Pvt Ltd,'}</Text>
          <Text
            style={
              style.textValue
            }>{`FarmSanta Private Limited, Arch Square, X2, unit no. 609, 6th floor, EP block, Salt Lake, sector-V, Kolkata, West Bengal - 700091

You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.

Depending on where you live, the time it may take for your exchanged product to reach you, may vary.`}</Text>

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
