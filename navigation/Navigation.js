import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { NavigationContainer,useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import React, { useState } from 'react'
import Home from '../screens/Home'
import Chat from '../screens/Chat'
import CreatePost from '../screens/CreatePost'
import MyAds from '../screens/MyAds'
import Settings from '../screens/Settings'
import SellingCategories from '../components/SellingCategories'
import Login from '../screens/Login'
import PostDetails from '../screens/PostDetails'
import AllAccounts from '../screens/AllAccounts'
import ChatApp from '../screens/ChatApp'
import CustomHeader from '../components/CustomHeader'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()
const TabGroup = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const showModal = () => {
        setModalVisible(true);
    };
    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={
                    {
                        tabBarShowLabel: false,
                        tabBarStyle: {
                            position: 'absolute',
                            elevation: 0,
                            backgroundColor: '#ffffff',
                            height: 50,
                            alignItems: "center",

                            ...styles.shadow
                        }
                    }
                }
            >
                <Tab.Screen name='Home' component={Home}
                    options={
                        {
                            tabBarIcon: ({ focused }) => (
                                <View
                                    style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image
                                        source={require('../assets/home1.png')}
                                        resizeMode="contain"
                                        style={{
                                            width: 25,
                                            height: 25,
                                            tintColor: focused ? '#DC6B11' : '#748c94'
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: focused ? '#DC6B11' : '#748c94',
                                            fontSize: 12,
                                            fontWeight: "bold"

                                        }}>HOME</Text>
                                </View>
                            ),
                            title: "Home",
                            headerStyle: {
                                backgroundColor: 'white',
                                shadowColor: '#000', // iOS
                                shadowOffset: { width: 0, height: 2 }, // iOS
                                shadowOpacity: 0.5, // iOS
                                shadowRadius: 3, // iOS
                                elevation: 5
                            },
                            headerTintColor: 'black',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },

                        }
                    }
                />

                <Tab.Screen name='Chat' component={Chat}
                    options={
                        {
                            tabBarIcon: ({ focused }) => (
                                <View
                                    style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image
                                        source={require('../assets/chat.png')}
                                        resizeMode="contain"
                                        style={{
                                            width: 25,
                                            height: 25,
                                            tintColor: focused ? '#DC6B11' : '#748c94'
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: focused ? '#DC6B11' : '#748c94',
                                            fontSize: 12,
                                            fontWeight: "bold"
                                        }}>CHAT</Text>
                                </View>
                            ),
                            title: "Chats",
                            headerStyle: {
                                backgroundColor: "white",
                                shadowColor: '#000', // iOS
                                shadowOffset: { width: 0, height: 2 }, // iOS
                                shadowOpacity: 0.5, // iOS
                                shadowRadius: 3, // iOS
                                elevation: 5
                            },
                            headerTintColor: 'black',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },

                        }
                    }
                />
                <Tab.Screen name='CreatePost' component={CreatePost}
                    options={
                        {
                            headerShown: false,
                            tabBarIcon: () => (
                                <Image
                                    source={require('../assets/plus2.png')}
                                    resizeMode="contain"
                                    style={{
                                        width: 30,
                                        height: 30,
                                        tintColor: '#FFFFFF'
                                    }}
                                />
                            ),

                            tabBarButton: ({ children, onPress }) => (
                                <TouchableOpacity
                                    onPress={() => showModal()}
                                    style={{
                                        top: -30,
                                        justifyContent: "center",
                                        alignContent: "center",
                                        ...styles.shadow
                                    }}>
                                    <View style={
                                        {
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            backgroundColor: '#DC6B11',

                                        }
                                    }>
                                        {children}
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    }
                />
                <Tab.Screen name='Ads' component={MyAds}
                    options={
                        {
                            tabBarIcon: ({ focused }) => (
                                <View
                                    style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image
                                        source={require('../assets/ads.png')}
                                        resizeMode="contain"
                                        style={{
                                            width: 25,
                                            height: 25,
                                            tintColor: focused ? '#DC6B11' : '#748c94'
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: focused ? '#DC6B11' : '#748c94',
                                            fontSize: 12,
                                            fontWeight: "bold"
                                        }}>MY ADS</Text>
                                </View>
                            ),
                            title: "My Ads",
                            headerStyle: {
                                backgroundColor: "white",
                                shadowColor: '#000', // iOS
                                shadowOffset: { width: 0, height: 2 }, // iOS
                                shadowOpacity: 0.5, // iOS
                                shadowRadius: 3, // iOS
                                elevation: 5
                            },
                            headerTintColor: 'black',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }
                    }
                />
                <Tab.Screen name='Account' component={Settings}
                    options={
                        {
                            tabBarIcon: ({ focused }) => (
                                <View
                                    style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Image
                                        source={require('../assets/setting.png')}
                                        resizeMode="contain"
                                        style={{
                                            width: 25,
                                            height: 25,
                                            tintColor: focused ? '#DC6B11' : '#748c94'
                                        }}
                                    />
                                    <Text
                                        style={{
                                            color: focused ? '#DC6B11' : '#748c94',
                                            fontSize: 12,
                                            fontWeight: "bold"
                                        }}>ACCOUNT</Text>
                                </View>
                            ),
                            title: "Account",
                            headerStyle: {
                                backgroundColor: "white",
                                shadowColor: '#000', // iOS
                                shadowOffset: { width: 0, height: 2 }, // iOS
                                shadowOpacity: 0.5, // iOS
                                shadowRadius: 3, // iOS
                                elevation: 5
                            },
                            headerTintColor: 'black',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }
                    }
                />
            </Tab.Navigator>
            <SellingCategories modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </View>
    )
}
const StackNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Login' component={Login} options={{headerShown: false}} />
            <Stack.Screen name='TabGroup' component={TabGroup} options={{headerShown: false}} />
            <Stack.Screen name='PostDetails' component={PostDetails} options={{header: ()=>( <CustomHeader navigation={useNavigation} />)}}/>
            <Stack.Screen name='Accounts' component={AllAccounts}  />
            <Stack.Screen name='ChatApp' component={ChatApp} />
            
        </Stack.Navigator>
    );
}

const Navigation = () => {
    return (
        <NavigationContainer>
            <StackNavigation />
        </NavigationContainer>
    )
}

export default Navigation

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#7f5df0',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    }
})