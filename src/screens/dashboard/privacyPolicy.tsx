import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import CustomHeader from '../../component/CustomHeader';
import colors from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/Metrics';
import FONTS from '../../component/fonts';

export const PrivacyPolicy: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <CustomHeader
        title="Privacy Policy"
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: horizontalScale(14),
          marginVertical: verticalScale(1),
        }}>
        <View style={{flex: 1}}>
          <Text style={style.textTitle}>
            {'Internet and Mobile properties'}
          </Text>

          <Text
            style={
              style.textValue
            }>{`This Privacy Policy governs the manner in which Farmsanta Private Limited (“NPL”) through its internet-based application “FARMSANTA FRESH” (the “app”) collects, uses, maintains and discloses information collected from users (each, a "User") in respect of the Sites and Mobile Applications and all internet and mobile based products and services offered by NPL

“You” and / or “Your” and / or “User” shall include and mean the person who is accessing the aforesaid website FarmSanta through any means available now and / or maybe available in the future.`}</Text>

          <Text style={style.textTitle}>
            {'Personal identification information'}
          </Text>
          <Text
            style={
              style.textValue
            }>{`We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our Sites and Mobile Applications, register on the Sites and Mobile Applications, place an order, register with the Mobile Application, create account, subscribe to the newsletter, respond to a survey, fill out a form, and in connection with other activities, services, features or resources we make available on our Sites and Mobile Applications. Users may be asked for, as appropriate, name, email address, phone number, credit card information. Users may, however, visit our Sites and Mobile Applications anonymously. We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personal identification information, except that it may prevent them from engaging in certain Sites and Mobile Applications related activities.`}</Text>
        

        <Text style={style.textTitle}>
          {'Non-personal identification information'}
        </Text>

        <Text style={style.textValue}>
          {`We may collect non-personal identification information about Users whenever they interact with our Sites and Mobile Applications. Non-personal identification information may include the browser name, the type of computer and technical information about Users means of connection to our Sites and Mobile Applications, such as the operating system and the Internet service providers utilized and other similar information.`}
        </Text>

        <Text style={style.textTitle}>{'Web browser cookies'}</Text>

        <Text style={style.textValue}>
          {`Our Sites and Mobile Applications may use "cookies" to enhance User experience. User's web browser places cookies on their hard drive for record-keeping purposes and sometimes to track information about them. Users may choose to set their web browser to refuse cookies, or to alert you when cookies are being sent. If they do so, note that some parts of the Sites and Mobile Applications may not function properly.`}
        </Text>

        <Text style={style.textTitle}>
          {'How we use collected information'}
        </Text>

        <Text style={style.textValue}>
          {`NPL collects and uses Users personal information for the following purposes:

 -   To personalize user experience, We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Sites and Mobile Applications.

 -   To improve our Sites and Mobile Applications and Mobile Applications We continually strive to improve our website offerings based on the information and feedback we receive from you.

 -   To improve customer service Your information helps us to more effectively respond to your customer service requests and support needs.

 -   To process transactions, we may use the information Users provide about themselves when placing an order only to provide service to that order. We do not share this information with outside parties except to the extent necessary to provide the service.

 -   To share your information with third parties We may share or sell information with third parties for marketing or other purposes.

 -   To administer a content, promotion, survey or other Sites and Mobile Applications feature to send Users information they agreed to receive about topics we think will be of interest to them.

 -   To send periodic emails the email address Users provide for order processing, will only be used to send them information and updates pertaining to their order. It may also be used to respond to their inquiries, and/or other requests or questions. If a User decides to opt-in to our mailing list, they will receive emails that may include company news, updates, related product or service information, etc. If at any time the User would like to unsubscribe from receiving future emails, we include detailed unsubscribe instructions at the bottom of each email or User may contact us via our Sites and Mobile Applications.`}
        </Text>

        <Text style={style.textTitle}>{'How we protect your information'}</Text>

        <Text
          style={
            style.textValue
          }>{`We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Sites and Mobile Applications.

Sensitive and private data exchange between the Sites and Mobile Applications and their Users happens over an SSL secured communication channel and is encrypted and protected with digital signatures.`}</Text>
        <Text style={style.textTitle}>
          {'Sharing your personal information'}
        </Text>

        <Text
          style={
            style.textValue
          }>{`We may use third party service providers to help us operate our business and the sites and mobile Applications or administer activities on our behalf, such as sending out newsletters or surveys. We may share your information with these third parties for those limited purposes provided that you have given us your permission.`}</Text>

        <Text style={style.textTitle}>{'Third party websites'}</Text>
        <Text
          style={
            style.textValue
          }>{`Users may find advertising or other content on our Sites and Mobile Applications that link to the Sites and Mobile Applications and services of our partners, suppliers, advertisers, sponsors, licensors and other third parties. We do not control the content or links that appear on these Sites and Mobile Applications are not responsible for the practices employed by Websites and Mobile Applications linked to or from our Sites and Mobile Applications. In addition, these Sites and Mobile Applications or services, including their content and links, may be constantly changing. These Sites and Mobile Applications and services may have their own privacy policies and customer service policies. Browsing and interaction on any other website, including Websites and Mobile Applications which have a link to our Sites and Mobile Applications, is subject to that Websites and Mobile Applications’ own terms and policies.`}</Text>

        <Text style={style.textTitle}>{'Advertising'}</Text>
        <Text
          style={
            style.textValue
          }>{`Ads appearing on our Sites and Mobile Applications may be delivered to Users by advertising partners, who may set cookies. These cookies allow the ad server to recognize your computer each time they send you an online advertisement to compile non personal identification information about you or others who use your computer. This information allows ad networks to, among other things, deliver targeted advertisements that they believe will be of most interest to you. This privacy policy does not cover the use of cookies by any advertisers.`}</Text>

        <Text style={style.textTitle}>{'Changes to this privacy policy'}</Text>
        <Text
          style={
            style.textValue
          }>{`NPL has the discretion to update this privacy policy at any time. When we do, we will post a notification on the main page of our Sites and Mobile Applications, revise the updated date at the bottom of this page and send you an email. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.`}</Text>

        <Text style={style.textTitle}>
          {'Storage of your Personal Information'}
        </Text>
        <Text
          style={
            style.textValue
          }>{`We shall store your personal Information in a form and manner and for the time period as may be specified by the Government and / or any Statutory bodies from time to time.`}</Text>

        <Text style={style.textTitle}>{'Non-Personal Information'}</Text>
        <Text
          style={
            style.textValue
          }>{`We, however, will not have any obligation of confidentiality with respect to any Personal Information that was already in its possession prior to receipt from you. In addition, no obligation of Privacy shall exist as to Personal Information that: (a) is in the public domain by public use, publication, general knowledge or the like, or after disclosure hereunder becomes general or public knowledge, through no fault of us hereunder; or (b) is lawfully received by us from a third party not under a confidentiality obligation to either of us; (d) was generated independently before its receipt from the you; or is required to be disclosed by law.`}</Text>

        <Text style={style.textTitle}>{'Your acceptance of these terms'}</Text>
        <Text
          style={
            style.textValue
          }>{`By using our Sites and Mobile Applications, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Sites and Mobile Applications. Your continued use of the Sites and Mobile Applications following the posting of changes to this policy will be deemed your acceptance of those changes.`}</Text>

        <Text style={style.textTitle}>{'Contact us'}</Text>
        <Text
          style={
            style.textValue
          }>{`If you have any questions about this Privacy Policy, the practices of this Sites and Mobile Applications, or your dealings with this Sites and Mobile Applications, please contact us at:`}</Text>
     
     <Text style={style.textTitle}>{'CORPORATE ADDRESS'}</Text>
     <Text style={style.textTitle}>{'Head Office'}</Text>

     <Text style={style.textValue}>{`FarmSanta Private Limited, Arch Square, X2, unit no. 609, 6th floor, EP block, Salt Lake, sector-V, Kolkata, West Bengal - 700091

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
