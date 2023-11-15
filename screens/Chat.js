import React, { useState, useEffect } from 'react';
import { Image, FlatList } from 'react-native';
import { StyleSheet, View, Text, TouchableNativeFeedback, ScrollView } from 'react-native';
import { useDataContext } from '../Context'
import { useIsFocused } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging'
import { ToastAndroid } from 'react-native';
import { ActivityIndicator } from 'react-native';
export default function Chat({ navigation }) {
  const isFocused = useIsFocused();
  const [rippleColor, setRippleColor] = useState("#ccc");
  const { listings, currentUser } = useDataContext();
  const [chatData, setChatData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (isFocused) {
      setLoading(true);
      const chatOfCurrentUser = [];
      for (const listingId in listings) {

        const listing = listings[listingId];

        if (listing.chats) {
          for (const chatId in listing.chats) {
            const chat = listing.chats[chatId];

            if (chat.participants && chat.participants.includes(currentUser?.email)) {

              let lastMessage = "";
              let lastMessageSender = "";
              let postID = "";
              let readBy = "";
              let lastMessageID = "";
              for (const messageId in chat?.messages) {
                const message = chat?.messages[messageId];
                lastMessage = message?.text;
                lastMessageSender = message.user?.name;
                readBy = message?.readBy;

                lastMessageID = message?._id;

              }

              postID = listing.id;

              const chatWithLast = { ...chat, lastMessage, lastMessageSender, postID, readBy, lastMessageID };

              chatOfCurrentUser.push(chatWithLast);

            }
          }
        }

      }

      setChatData(chatOfCurrentUser);
      setTimeout(() => {
        setLoading(false);
      }, 100)
      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        console.log(remoteMessage.notification.title);
        ToastAndroid.show("New Message in Chat " + remoteMessage.notification.title, ToastAndroid.LONG)
      });
      return unsubscribe;

    }
   
  }, [isFocused]);
  return (
    <View style={{flex:1, backgroundColor: "white"}}>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#DC6B11" />
      ) : (
        <>
          {chatData ? (
            <FlatList
              data={chatData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableNativeFeedback
                  onPress={() => {
                    navigation.navigate('ChatApp', { chatData: item, chatID: item.id, postID: item.postID });
                  }}
                  background={TouchableNativeFeedback.Ripple(rippleColor)}
                >
                  <View style={styles.userChat}>
                    <View style={styles.profileView}>
                      <Image source={require('../assets/profile.png')} style={styles.profileImage} />
                    </View>
                    <View style={styles.userView}>
                      <View>
                        <Text style={styles.userName}>{item.chatName}</Text>
                        {currentUser?.email == item.participants[0] && item.lastMessageSender == "Buyer" ? (
                          <Text style={styles.lastMessage}>You: {item.lastMessage}</Text>
                        ) : currentUser?.email == item.participants[1] && item.lastMessageSender == "Seller" ? (
                          <Text style={styles.lastMessage}>You: {item.lastMessage}</Text>
                        ) : currentUser?.email == item.participants[2] && item.lastMessageSender == "Admin" ? (
                          <Text style={styles.lastMessage}>You: {item.lastMessage}</Text>
                        ) : (
                          <Text style={styles.lastMessage}>{item.lastMessageSender}: {item.lastMessage}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableNativeFeedback>
              )}
            />
          ) : (
            <View style={{ justifyContent: "center", alignItems: 'center', marginTop: 300 }}>
              <Text style={{ fontSize: 24 }}>You do not have any Chats yet</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

// Rest of your styles remain the same


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  userChat: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.5, // iOS
    shadowRadius: 3, // iOS
    elevation: 5,
  },
  profileView: {},
  profileImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  userName: {
    fontSize: 18,
    marginTop: 4,
    marginBottom: 3,
    fontWeight: "bold",
  },
  userView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginLeft: 10,

  },
  lastMessage: {
    color: "grey",
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
