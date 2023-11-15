import React, { useState, useEffect } from 'react';
import { Bubble, GiftedChat, MessageText, Send } from 'react-native-gifted-chat';
import { ref, onValue, push, set, getDatabase } from 'firebase/database';
import { Image } from 'react-native';
import { useDataContext } from '../Context';
import axios from 'axios';

const ChatApp = ({ navigation, route }) => {
    const { currentUser } = useDataContext();
    const { chatData, chatID, postID } = route.params;
    const [userTokens, setUserTokens] = useState()
    const chatName = chatData?.chatName;

    const currentUserEmail = currentUser?.email;
    const sellerEmail = chatData?.participants[1]
    const adminEmail = chatData?.participants[2]


    const [messages, setMessages] = useState([]);


    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: chatName,
        });
    }, [navigation])
    useEffect(() => {
        try {
            getTokens();
            if (chatData.messages) {
                const chatRef = ref(getDatabase(), `listings/${postID}/chats/${chatID}/messages/`);
                onValue(chatRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const messageData = snapshot.val();
                        const messageArray = Object.keys(messageData).map((key) => ({
                            ...messageData[key],
                            _id: key,
                        }));
                        setMessages(messageArray.reverse());
                    }
                });
            } else {
                const defaultMessage = {
                    _id: 'system-message',
                    text: 'Chat is created',
                    createdAt: new Date().getTime(),
                    user: {
                        _id: 'system',
                        name: 'System',
                        avatar: null,
                    },
                };
                setMessages([defaultMessage]);
            }
        } catch (error) {
            console.log(error);
        }

    }, []);



    const user = {
        _id: currentUserEmail,
    };


    const isCurrentUserAdmin = currentUserEmail === adminEmail;
    const isCurrentUserSeller = currentUserEmail === sellerEmail;
    const isCurrentUserBuyer = currentUserEmail === chatData.participants[0];
    const renderAvatar = (props) => {
        if (props.currentMessage.user._id === adminEmail) {
            return <Image style={{ width: 50, height: 50, borderRadius: 15 }} source={require('../assets/roles/admin-avatar.png')} />;
        } else if (props.currentMessage.user._id === sellerEmail) {
            return <Image style={{ width: 50, height: 50, borderRadius: 15 }} source={require('../assets/roles/seller-avatar.png')} />;
        }
        else if (props.currentMessage.user._id === chatData.participants[0]) {
            return <Image style={{ width: 50, height: 50, borderRadius: 15 }} source={require('../assets/roles/buyer-avatar.png')} />;
        }

    };


    const onSend = (newMessages = []) => {
        try {
            const newMessage = newMessages[0];
            const chatMessagesRef = ref(getDatabase(), `listings/${postID}/chats/${chatID}/messages`);
            const newMessageRef = push(chatMessagesRef);
            const name = isCurrentUserAdmin ? 'Admin' : isCurrentUserSeller ? 'Seller' : 'Buyer';
            const message = {
                _id: newMessageRef.key,
                text: newMessage.text,
                createdAt: new Date().getTime(),
                user: {
                    _id: user._id,
                    name: isCurrentUserAdmin ? 'Admin' : isCurrentUserSeller ? 'Seller' : 'Buyer',
                    avatar: isCurrentUserAdmin ? require('../assets/roles/admin-avatar.png') : isCurrentUserSeller ? require('../assets/roles/seller-avatar.png') : require('../assets/roles/buyer-avatar.png'),
                },
                readBy: [isCurrentUserBuyer, isCurrentUserSeller, isCurrentUserAdmin]
            };

            // Update the state based on the previous state
            setMessages(previousMessages => GiftedChat.append(previousMessages, [message]));
            // Send the message to Firebase
            set(newMessageRef, message);
            sendNotification(chatName, newMessage, name)
        } catch (error) {
            console.log(error);
        }

    };


    const userColors = {
        [adminEmail]: 'black',   // Replace with your desired color
        [sellerEmail]: '#088F8F',  // Replace with your desired color


    };

    const getMessageBackgroundColor = (messageUser) => {
        return userColors[messageUser] || 'brown'; // Default color if no match is found
    };

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: getMessageBackgroundColor(props.currentMessage.user._id),

                    },
                    right: {
                        backgroundColor: getMessageBackgroundColor(props.currentMessage.user._id),
                    },
                }}
            />
        );
    };
    const userTextColors = {
        [adminEmail]: 'white',     // Replace with your desired text color
        [sellerEmail]: 'white',    // Replace with your desired text color
        // You can add more users and text colors as needed
    };

    const getMessageTextColor = (messageUser) => {
        return userTextColors[messageUser] || 'white'; // Default text color if no match is found
    };

    const renderMessageText = (props) => {
        return (
            <MessageText
                {...props}
                textStyle={{
                    left: {
                        color: getMessageTextColor(props.currentMessage.user._id),
                    },
                    right: {
                        color: getMessageTextColor(props.currentMessage.user._id),
                    },
                }}
            />
        );
    }
    const getTokens = () => {
        const refer = ref(getDatabase(), 'tokens/');
        onValue(refer, (snapshot) => {
            if (snapshot.exists()) {
                let data = snapshot.val()
                let dataArray = Object.values(data);
                setUserTokens(dataArray)
            }
        })
    }
    const filterToken = (email) => {
        const token = userTokens.filter((e) => {
            return email == e.email;
        })
        return token[0]?.token;
    }

    const sendNotification = (chatname, message, name) => {
        let BuyerEmail = chatData?.participants[0];
        let SellerEmail = chatData?.participants[1];
        let AdminEmail = chatData?.participants[2];

        //get the token of each participants using email
        const BuyerToken = filterToken(BuyerEmail);
        const SellerToken = filterToken(SellerEmail);
        const AdminToken = filterToken(AdminEmail);

        if (currentUser?.email === BuyerEmail) {


            sendNoticationToReceiver(chatname, message, name, SellerToken)
            sendNoticationToReceiver(chatname, message, name, AdminToken)

        } else if (currentUser?.email === SellerEmail) {
            //then send the notification to the Buyer and Admin
            sendNoticationToReceiver(chatname, message, name, BuyerToken)
            sendNoticationToReceiver(chatname, message, name, AdminToken)

        }
        else if (currentUser?.email === AdminEmail) {
            //then send the notification to the Buyer and Seller
            sendNoticationToReceiver(chatname, message, name, BuyerToken)
            sendNoticationToReceiver(chatname, message, name, SellerToken)

        }

    }
    const sendNoticationToReceiver = async (chatname, message, name, token) => {

        var data = JSON.stringify({
            data: {},
            notification: {
                body: name + ": " + message.text,
                title: chatname,
            },
            to: token,
        });
        var config = {
            method: 'post',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {
                Authorization:
                    'key=AAAA6JcSkgA:APA91bEB6wIUuA_Y_yt4g723G9ydSpCSj7cFVcYNWcE2zMVZUSWYzONa9a5jZMyEh_qaNxkFqTKNbxaEz_R5CdIiD7Ct0Ug-lHfEvDExBswg_noYomP9_bodfLDFYEhwkEqISiaoI-NA',
                'Content-Type': 'application/json',
            },
            data: data,
        };
        await axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={(newMessages) => {
                onSend(newMessages)

            }}
            user={user}
            renderAvatar={renderAvatar}
            renderBubble={renderBubble}
            renderMessageText={renderMessageText}

            showUserAvatar
            alwaysShowSend
        />

    );
};

export default ChatApp;
