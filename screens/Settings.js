import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableNativeFeedback, Image, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // You need to import icons 
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDataContext } from '../Context';
import { firebase } from '../firebase/firebaseConfig'
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging'
import { useIsFocused } from '@react-navigation/native';
import { ToastAndroid } from 'react-native';
import { useEffect } from 'react';
import { Alert } from 'react-native';
const Settings = ({ navigation }) => {
  const { currentUser } = useDataContext();
  const isFocused = useIsFocused()
  useEffect(() => {

    if (isFocused) {
      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        console.log(remoteMessage.notification.title);
        ToastAndroid.show("New Message in Chat " + remoteMessage.notification.title, ToastAndroid.LONG)
      });
      return unsubscribe;
    }


  }, [isFocused]);

  const signOut = async () => {
    await firebase.auth().signOut();
    navigation.navigate("Login")
    await AsyncStorage.removeItem('userToken');

  }

  return (
    <View style={styles.container}>

      <View style={styles.profileContainer}>
        <View style={styles.circularView}>
          {currentUser?.photoURL ? (
            <Image
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
              }}
              source={{ uri: currentUser.photoURL }}
            />
          ) : (
            <Text>No Image Available</Text>
          )}
        </View>
        <Text style={styles.userName}>{currentUser?.displayName}</Text>
        <Text style={styles.email}>{currentUser?.email}</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableNativeFeedback onPress={
          () => {
            Linking.openURL('https://pubgmidbuyandsell.blogspot.com/p/privacy-policy.html');
          }
        }
          background={TouchableNativeFeedback.Ripple("#ccc")}>
          <View style={styles.optionItem}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="shield" size={24} color="skyblue" />
              <Text style={styles.optionText}>Privacy Policy</Text>
            </View>
            <FontAwesome name="chevron-circle-right" size={24} color="#333" style={styles.FontAwesome} />
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          onPress={
            () => {
              Linking.openURL('https://pubgmidbuyandsell.blogspot.com/p/terms-and-conditions.html');
            }
          }
          background={TouchableNativeFeedback.Ripple("#ccc")}>
          <View style={styles.optionItem}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="document-text" size={24} color="skyblue" />
              <Text style={styles.optionText}>Terms of Use</Text>
            </View>
            <FontAwesome name="chevron-circle-right" size={24} color="#333" style={styles.FontAwesome} />
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          onPress={
            () => {
              Linking.openURL('https://wa.me/+923440048170');
            }
          }
          background={TouchableNativeFeedback.Ripple("#ccc")}>
          <View style={styles.optionItem}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="mail" size={24} color="skyblue" />
              <Text style={styles.optionText}>Contact Us</Text>
            </View>
            <FontAwesome name="chevron-circle-right" size={24} color="#333" style={styles.FontAwesome} />
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple("#ccc")}>
          <View style={styles.optionItem}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="star" size={24} color="#E5AA17" />
              <Text style={styles.optionText}>Rate Us</Text>
            </View>
            <FontAwesome name="chevron-circle-right" size={24} color="#333" style={styles.FontAwesome} />
          </View>
        </TouchableNativeFeedback>
      </View>
      <TouchableNativeFeedback
        onPress={
          () => {
            Alert.alert(
              'Do you want to log out?',
              '',
              [
                {
                  text: 'No',
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: () => {
                    signOut()
                  },
                },
              ],
              { cancelable: false }
            );
          }

        }
        background={TouchableNativeFeedback.Ripple("#ccc")}>
        <View style={styles.optionItem}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>

            <Icon name="log-out" size={24} color="#FF0000" />
            <Text style={styles.optionText}>Logout</Text>

          </View>

        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  profileContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.5, // iOS
    shadowRadius: 3, // iOS
    elevation: 2
  },
  circularView: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white', // Background for the circular view
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.5, // iOS
    shadowRadius: 3, // iOS
    elevation: 10
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: "white",
    paddingVertical: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.5, // iOS
    shadowRadius: 3, // iOS
    elevation: 2,
    justifyContent: "space-between"
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  FontAwesome: {

  }
});

export default Settings;
