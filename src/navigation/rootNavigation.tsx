import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ShopIcons from 'react-native-vector-icons/Entypo';
import ExploreIcons from 'react-native-vector-icons/MaterialIcons';
import ShoppingIcons from 'react-native-vector-icons/Feather';
import AccountIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Login} from '../screens/auth/login';
import {SignUp} from '../screens/auth/signUp';
import {ProductCategory} from '../screens/dashboard/productCategory';
import {useAuth} from '../stores/auth';
import {ActivityIndicator, Button, View} from 'react-native';
import CustomDrawerContent from '../component/CustomDrawerContent';
import {ProductListing} from '../screens/dashboard/productListing';
import {ProductDetails} from '../screens/dashboard/productDetails';
import {Address} from '../screens/auth/address';
import colors from '../utils/colors';
import {horizontalScale, moderateScale, verticalScale} from '../utils/Metrics';
import FONTS from '../component/fonts';
import {CartListing} from '../screens/dashboard/cartListing';
import {ProductCategoryList} from '../screens/dashboard/productCategoryList';
import {SettingScreen} from '../screens/dashboard/settingScreen';
import {ProductListByCategory} from '../screens/dashboard/productListByCategory';
import {OrderListing} from '../screens/dashboard/orderListing';
import {OrderDetails} from '../screens/dashboard/orderDetails';
import {AddressList} from '../screens/dashboard/addressList';
import {UpdateAddress} from '../screens/dashboard/UpdateAddress';
import {ProfileUpdate} from '../screens/dashboard/profileUpdate';
import {AddNewAddress} from '../screens/dashboard/addNewaddress';
import {PlaceOrder} from '../screens/dashboard/placeOrder';
import {SearchProductList} from '../screens/dashboard/searchProductList';
import {TermCondition} from '../screens/dashboard/termCondition';
import {PrivacyPolicy} from '../screens/dashboard/privacyPolicy';
import {RefundReturn} from '../screens/dashboard/refundReturn';
import {ShippingDelivery} from '../screens/dashboard/shippingDelivery';
import {AboutUs} from '../screens/dashboard/aboutUs';
import {EkartDashboard} from '../screens/ekart/ekartDashboard';
import {EKartDetails} from '../screens/ekart/ekartDetails';
import {SocketProvider} from '../utils/socketProvider';
import {OrderProductDetails} from '../screens/dashboard/orderProductDetails';
import {CameraScreen} from '../component/CameraScreen';
// import SignupScreen from './screens/SignupScreen';
// import DashboardScreen from './screens/DashboardScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export const navigationRef = React.createRef();

// const DashboardDrawer = () => {
//   return (
//     <Drawer.Navigator
//       drawerContent={props => <CustomDrawerContent {...props} />}
//       screenOptions={{
//         drawerPosition: 'right',
//       }}>
//       <Drawer.Screen
//         options={{headerShown: false}}
//         name="ProductCategory"
//         component={ProductCategory}
//       />
//       <Drawer.Screen
//         options={{headerShown: false}}
//         name="ProductListing"
//         component={ProductListing}
//       />
//       {/* Add other screens accessible from the drawer here */}
//       {/* Example: */}
//       {/* <Drawer.Screen name="Settings" component={SettingsScreen} /> */}
//     </Drawer.Navigator>
//   );
// };

const DashboardBottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.GREEN,
        tabBarStyle: {
          height: verticalScale(64),
          paddingVertical: verticalScale(6),
        },
        tabBarLabelStyle: {
          fontFamily: FONTS.SEMI_BOLD,
          fontSize: moderateScale(12),
          marginBottom: verticalScale(6),
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Shop') {
            // iconName = focused ? 'home' : 'home-outline';
            return <ShopIcons name={'shop'} size={size} color={color} />;
          } else if (route.name === 'Explore') {
            // iconName = focused ? 'settings' : 'settings-outline';
            return (
              <ExploreIcons
                style={{marginTop: horizontalScale(-4)}}
                name={'manage-search'}
                size={horizontalScale(30)}
                color={color}
              />
            );
          } else if (route.name === 'Cart') {
            // iconName = focused ? 'settings' : 'settings-outline';
            return (
              <ShoppingIcons
                name={'shopping-cart'}
                size={horizontalScale(20)}
                color={color}
              />
            );
          } else if (route.name === 'Account') {
            // iconName = focused ? 'settings' : 'settings-outline';
            return (
              <AccountIcons
                name={'account-cog'}
                size={horizontalScale(26)}
                color={color}
              />
            );
          }
        },
      })}>
      <Tab.Screen name="Shop" component={ProductCategory} />
      <Tab.Screen name="Explore" component={ProductCategoryList} />
      <Tab.Screen name="Cart" component={CartListing} />
      <Tab.Screen name="Account" component={SettingScreen} />
    </Tab.Navigator>
  );
};

const RootNavigation = () => {
  const {token, addressId, hasHydratedSync, roleType, userId, eKartId} =
    useAuth();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    // Wait until the token has been hydrated from AsyncStorage
    if (hasHydratedSync) {
      const route = token ? 'Dashboard' : 'Login';
      setInitialRoute(route);
    }
  }, [hasHydratedSync, token]);

  // Show a loading spinner while the app is checking AsyncStorage for the token
  if (initialRoute === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  console.log('Token >> ' + token);
  return (
    <SocketProvider userId={userId} eKartID={eKartId}>
      <NavigationContainer ref={navigationRef} independent>
        <Stack.Navigator initialRouteName={initialRoute}>
          {token ? (
            <>
              {(addressId == null || addressId == '') && roleType != 'EKART' ? (
                <>
                  <Stack.Screen
                    name="Address"
                    component={Address} // Using the drawer here
                    options={{headerShown: false}}
                  />
                </>
              ) : (
                <>
                  {roleType == 'EKART' ? (
                    <>
                      <Stack.Screen
                        name="EkartDashboard"
                        component={EkartDashboard} // Using the drawer here
                        options={{headerShown: false}}
                      />

                      <Stack.Screen
                        name="EKartDetails"
                        component={EKartDetails} // Using the drawer here
                        options={{headerShown: false}}
                      />
                    </>
                  ) : (
                    <>
                      <Stack.Screen
                        name="Dashboard"
                        component={DashboardBottomTab} // Using the drawer here
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="ProductListing"
                        component={ProductListing}
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="ProductListByCategory"
                        component={ProductListByCategory}
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="ProductDetails"
                        component={ProductDetails}
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="OrderListing"
                        component={OrderListing}
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="OrderDetails"
                        component={OrderDetails}
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="OrderProductDetails"
                        component={OrderProductDetails}
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="UpdateAddress"
                        component={UpdateAddress}
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="AddNewAddress"
                        component={AddNewAddress}
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="ProfileUpdate"
                        component={ProfileUpdate}
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="PlaceOrder"
                        component={PlaceOrder}
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="AddressList"
                        component={AddressList}
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="SearchProductList"
                        component={SearchProductList}
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="TermCondition"
                        component={TermCondition}
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="PrivacyPolicy"
                        component={PrivacyPolicy}
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="RefundReturn"
                        component={RefundReturn}
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="ShippingDelivery"
                        component={ShippingDelivery}
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="AboutUs"
                        component={AboutUs}
                        options={{headerShown: false}}
                      />
                      <Stack.Screen
                        name="CameraScreen"
                        component={CameraScreen}
                        options={{headerShown: false}}
                      />
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={Login}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Address"
                component={Address}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="TermCondition"
                component={TermCondition}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicy}
                options={{headerShown: false}}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SocketProvider>
  );
};

export default RootNavigation;
