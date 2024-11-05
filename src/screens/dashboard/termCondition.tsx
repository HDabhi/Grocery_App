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

export const TermCondition: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, backgroundColor: colors.WHITE}}>
      <CustomHeader
        title="Terms & Conditions"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: horizontalScale(14),
          marginVertical: verticalScale(1),
        }}>
        <View style={{flex: 1}}>
          <Text style={style.textTitle}>{'Term and Conditions:'}</Text>
          <Text
            style={
              style.textValue
            }>{`Please read the following terms and conditions very carefully as your use of service is subject to your acceptance of and compliance with the following terms and conditions ("Terms").

By subscribing to or using any of our services you agree that you have read, understood and are bound by the Terms, regardless of how you subscribe to or use the services. If you do not want to be bound by the Terms, you must not subscribe to or use our services. These Terms and various other policies are binding as per the provisions of the Information Technology (Intermediaries guidelines) Rules, 2011 formulated under the Information Technology Act of 2000.

In these Terms, references to "you", "User" shall mean the end user accessing the Website and the Android Applications, its contents and using the Services offered through the Website and the Android Applications, "Service Providers" mean independent third-party service providers, and "we", "us" and "our" shall mean FarmSanta Private Limited and its affiliates.`}</Text>

          <Text style={style.textTitle}>{'1. Introduction:'}</Text>

          <Text
            style={
              style.textValue
            }>{`1. www.farmsanta.com ("Website"), FarmSanta Fresh, FarmSanta Support, And FarmSanta Business applications are an Internet based content and e-commerce portal, a company incorporated under the laws of India.

2. Use of the Website and the Android Applications are offered to you conditioned on acceptance without modification of all the terms, conditions and notices contained in these Terms, as may be posted on the Website and the Android Applications from time to time. Farmsanta.com at its sole discretion reserves the right not to accept a User from registering on the Website without assigning any reason thereof.`}</Text>

          <Text style={style.textTitle}>
            {'2. User Account, Password, and Security:'}
          </Text>
          <Text
            style={
              style.textValue
            }>{`You will receive a password and account designation upon completing the Website's and Android Applications’ registration process. You are responsible for maintaining the confidentiality of the password and account and are fully responsible for all activities that occur under your password or account. You agree to (a) immediately notify Farmsanta.com of any unauthorized use of your password or account or any other breach of security, and (b) ensure that you exit from your account at the end of each session. FarmSanta cannot and will not be liable for any loss or damage arising from your failure to comply with Section 2.`}</Text>

          <Text style={style.textTitle}>{'3. Services Offered:'}</Text>
          <Text
            style={
              style.textValue
            }>{`FarmSanta provides several Internet-based services through the Web Site and Android Applications (all such services, collectively, the "Service"). One such service enables users to purchase original products such as seeds and accessories from various supplier brands (collectively, "Products"). The Products can be purchased through the Website through various methods of payments offered. The sale/purchase of Products shall be additionally governed by specific policies of sale, like cancellation policy, return policy, etc., and all of which are incorporated here by reference. In addition, these terms and policies may be further supplemented by Product specific conditions, which may be displayed on the webpage of that Product.`}</Text>

          <Text style={style.textTitle}>{'4. Privacy Policy:'}</Text>
          <Text
            style={
              style.textValue
            }>{`The User hereby consents, expresses and agrees that he has read and fully understands the Privacy Policy of Farmsanta.com. The user further consents that the terms and contents of such Privacy Policy are acceptable to him.`}</Text>

          <Text style={style.textTitle}>{'5. Limited User:'}</Text>
          <Text
            style={
              style.textValue
            }>{`The User agrees and undertakes not to reverse engineer, modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information or software obtained from the Website and the Android Applications. Limited reproduction and copying of the content of the Website and the Android Applications are permitted provided that Farmsanta's name is stated as the source and prior written permission of Farmsanta.com is sought. For the removal of doubt, it is clarified that unlimited or wholesale reproduction, copying of the content for commercial or non-commercial purposes and unwarranted modification of data and information within the content of the Website is not permitted.`}</Text>

          <Text style={style.textTitle}>{'6. User Conduct and Rules:'}</Text>
          <Text
            style={
              style.textValue
            }>{`You agree and undertake to use the Website and the Service only to post and upload messages and material that are proper. By way of example, and not as a limitation, you agree and undertake that when using a Service, you will not:

(a) defame, abuse, harass, stalk, threaten or otherwise violate the legal rights of others.

(b) publish, post, upload, distribute or disseminate any inappropriate, profane, defamatory, infringing, obscene, indecent or unlawful topic, name, material or information.

(c) upload files that contain software or other material protected by intellectual property laws unless you own or control the rights thereto or have received all necessary consents; you own or control the rights thereto or have received all necessary consents.

(d) upload or distribute files that contain viruses, corrupted files, or any other similar software or programs that may damage the operation of the Website or another's computer.

(e) conduct or forward surveys, contests, pyramid schemes or chain letters.

(f) download any file posted by another user of a Service that you know, or reasonably should know, cannot be legally distributed in such manner.

(g) falsify or delete any author attributions, legal or other proper notices or proprietary designations or labels of the origin or source of software or other material contained in a file that is uploaded.

(h) violate any code of conduct or other guidelines, which may be applicable for or to any particular Service.

(i) violate any applicable laws or regulations for the time being in force in or outside India; and

(j) violate, abuse, unethically manipulate or exploit, any of the terms and conditions of this Agreement or any other terms and conditions for the use of the Website contained elsewhere.`}</Text>

          <Text style={style.textTitle}>
            {'7. User Warranty and Representation:'}
          </Text>
          <Text
            style={
              style.textValue
            }>{`The user guarantees, warrants, and certifies that you are the owner of the content which you submit or otherwise authorized to use the content and that the content does not infringe upon the property rights, intellectual property rights or other rights of others. You further warrant that to your knowledge, no action, suit, proceeding, or investigation has been instituted or threatened relating to any content, including trademark, trade name service mark, and copyright formerly or currently used by you in connection with the Services rendered by Farmsanta.com.`}</Text>

          <Text style={style.textTitle}>{'8. Exactness Not Guaranteed:'}</Text>
          <Text
            style={
              style.textValue
            }>{`FarmSanta hereby disclaims any guarantees of exactness as to the finish and appearance of the final Product as ordered by the user. The quality of any products, Services, information, or other material purchased or obtained by you through the Website may not meet your expectations. Alterations to certain aspects of your order such as the supplier brand, quantity etc. may be required due to limitations caused by availability of product difference in quantity charts of respective brands etc. In this instance you agree that Farmsanta.com will send an approval request via the email address which you submitted when placing your order. If you do not agree with the requested change, you retain the right to reject the requested product change by replying to it within 10 days of it being sent to you.`}</Text>

          <Text style={style.textTitle}>
            {'9. Intellectual Property Rights:'}
          </Text>
          <Text
            style={
              style.textValue
            }>{`(a) Unless otherwise indicated or anything contained to the contrary or any proprietary material owned by a third party and so expressly mentioned, FarmSanta owns all Intellectual Property Rights to and into the Website and the Android Applications, including, without limitation, any and all rights, title and interest in and to copyright, related rights, patents, utility models, trademarks, trade names, service marks, designs, know-how, trade secrets and inventions (whether patentable or not), goodwill, source code, meta tags, databases, text, content, graphics, icons, and hyperlinks. You acknowledge and agree that you shall not use, reproduce or distribute any content from the Website and the Android Applications belonging to FarmSanta without obtaining authorization from Farmsanta.com.

(b) Notwithstanding the foregoing, it is expressly clarified that you will retain ownership and shall solely be responsible for any content that you provide or upload when using any Service, including any text, data, information, images, photographs, music, sound, video or any other material which you may upload, transmit or store when making use of our various Service. However, with regard to the product customization Service (as against other Services like blogs and forums) you expressly agree that by uploading and posting content on to the Website for public viewing and reproduction/use of your content by third party users, you accept the User whereby you grant a non-exclusive license for the use of the same.`}</Text>

          <Text style={style.textTitle}>
            {'10. Links To Third Party Sites:'}
          </Text>
          <Text
            style={
              style.textValue
            }>{`The Website may contain links to other websites ("Linked Sites"). The Linked Sites are not under the control of Farmsanta.com or the Website and the Android Applications and FarmSanta is not responsible for the contents of any Linked Site, including without limitation any link contained in a Linked Site, or any changes or updates to a Linked Site. FarmSanta is not responsible for any form of transmission, whatsoever, received by you from any Linked Site. Farmsanta.com is providing these links to you only as a convenience, and the inclusion of any link does not imply endorsement by Farmsanta.com or the Website and the Android Applications of the Linked Sites or any association with its operators or owners including the legal heirs or assigns thereof. The users are requested to verify the accuracy of all information on their own before undertaking any reliance on such information.

Our store is hosted by Shopify Inc and managed by FarmSanta. They provide us services for online e-commerce platforms that allow us to sell our products and services to you and web page use Shopify services for secure and safe transition and Gateway Integration for payment transition.`}</Text>

          <Text style={style.textTitle}>
            {'11. Disclaimer Of Warranties/Limitation of Liability:'}
          </Text>
          <Text
            style={
              style.textValue
            }>{`(a) FarmSanta has endeavored to ensure that all the information on the Website and the Android Applications are correct, but FarmSanta neither warrants nor makes any representations regarding the quality, accuracy or completeness of any data, information, product or Service. In no event shall Farmsanta.com be liable for any direct, indirect, punitive, incidental, special, consequential damages or any other damages resulting from: (a) the use or the inability to use the Services or Products; (b) unauthorized access to or alteration of the user's transmissions or data; (c) any other matter relating to the services; including, without limitation, damages for loss of use, data or profits, arising out of or in any way connected with the use or performance of the Website or Service. Neither shall FarmSanta be responsible for the delay or inability to use the Website and the Android Applications or related services, the provision of or failure to provide Services, or for any information, software, products, services and related graphics obtained through the Website and the Android Applications, or otherwise arising out of the use of the website and the Android Applications, whether based on contract, tort, negligence, strict liability or otherwise. Further, FarmSanta shall not be held responsible for non-availability of the Website during periodic maintenance operations or any unplanned suspension of access to the website that may occur due to technical reasons or for any reason beyond FarmSanta's control. The user understands and agrees that any material and/or data downloaded or otherwise obtained through the Website is done entirely at their own discretion and risk and they will be solely responsible for any damage to their computer systems or loss of data that results from the download of such material and/or data.

(b) The performance of the product is subject to usage as per manufacturer guidelines. Read the enclosed leaflet of the products carefully before use. The use of this information is at the discretion of the user.`}</Text>

          <Text style={style.textTitle}>{'12. Indemnification:'}</Text>
          <Text
            style={
              style.textValue
            }>{`You agree to indemnify, defend and hold harmless FarmSanta from and against any and all losses, liabilities, claims, damages, costs and expenses (including legal fees and disbursements in connection therewith and interest chargeable thereon) asserted against or incurred by Farmsanta.com that arise out of, result from, or may be payable by virtue of, any breach or non-performance of any representation, warranty, covenant or agreement made or obligation to be performed by you pursuant to these Terms.`}</Text>

          <Text style={style.textTitle}>{'13. Pricing:'}</Text>
          <Text
            style={
              style.textValue
            }>{`Prices for products are described on our Website and the Android Applications and are incorporated into these Terms by reference. All prices are in Indian rupees. Prices, products and Services may change at FarmSanta's discretion.`}</Text>

          <Text style={style.textTitle}>{'14. Shipping:'}</Text>
          <Text
            style={
              style.textValue
            }>{`Title and risk of loss for all products ordered by you shall pass on to you upon FarmSanta's shipment to the shipping carrier. Rules on COD vary based on transaction value, products, shipping location and other relevant parameters. FarmSanta shall retain the right to offer/deny COD for specific cases.`}</Text>

          <Text style={style.textTitle}>{'15. Termination:'}</Text>
          <Text
            style={
              style.textValue
            }>{`(a) FarmSanta may suspend or terminate your use of the Website and the Android Applications or any Service if it believes, in its sole and absolute discretion that you have breached, violated, abused, or unethically manipulated or exploited any term of these Terms or anyway otherwise acted unethically.

(b) Notwithstanding Section 15.a above, these Terms will survive indefinitely unless and until FarmSanta chooses to terminate them.

(c) If you or Farmsanta.com terminates your use of the Website and the Android Applications or any Service, FarmSanta may delete any content or other materials relating to your use of the Service and FarmSanta will have no liability to you or any third party for doing so.

(d) You shall be liable to pay for any Service or product that you have already ordered till the time of Termination by either party whatsoever. Further, you shall be entitled to your royalty payments as per the User License Agreement that has or is legally deemed accrued to you.`}</Text>

          <Text style={style.textTitle}>{'16. Severability:'}</Text>
          <Text
            style={
              style.textValue
            }>{`If any provision of the Terms is determined to be invalid or unenforceable in whole or in part, such invalidity or unenforceability shall attach only to such provision or part of such provision and the remaining part of such provision, and all other provisions of these Terms shall continue to be in full force and effect.`}</Text>

          <Text style={style.textTitle}>{'17. Report Abuse:'}</Text>
          <Text
            style={
              style.textValue
            }>{`As per these Terms, users are solely responsible for every material or content uploaded on to the Website. Users can be held legally liable for their contents and may be held legally accountable if their contents or material include, for example, defamatory comments or material protected by copyright, trademark, etc. If you come across any abuse or violation of these Terms, please report to contact@farmsanta.com.`}</Text>

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
