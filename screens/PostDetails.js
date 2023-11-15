import { Button, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import ImageGallery from '../components/ImageGallery'
import AdminSelectionModal from '../components/AdminSelectionModal';
import { useNavigation } from '@react-navigation/native';
import { useDataContext } from "../Context";
import { child, getDatabase, onValue, push, ref, set, update } from 'firebase/database';
import SellingDetails from '../components/SellingDetails';
const PostDetails = ({ route }) => {
  const { currentUser } = useDataContext()
  const post = route.params.post;
  const navigation = useNavigation()
  const [editedPost, setEditedPost] = useState(post);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [chatExists, setChatExists] = useState(false);
  const [chat, setChat] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    const starCountRef = ref(getDatabase(), `listings/${editedPost.id}`);
    onValue(starCountRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          let post = snapshot.val();

          if (post.chats) {
            for (const chatId in post.chats) {
              const chat = post.chats[chatId];
              if (chat.participants[0] === currentUser.email) {
                
                setChatExists(true);
                setChatId(chatId)
                setChat(chat)
                break;

              }
            }
          } else {
            setChatExists(false);
          }


        } else {
          console.error('No data found in the snapshot.');
        }
      } catch (error) {
        console.error('Error fetching data from Firebase:', error);
      }
    });

  }, [isModalVisible]);


  const handleChatWithSeller = () => {

    if (chatExists) {
      navigation.navigate('ChatApp', { chatData: chat, chatID: chatId, postID: editedPost.id });
      console.log("Chat Already Created");
    } else {
      setIsModalVisible(true);
    }

  };

  const handleAdminSelection = (admin, chatName) => {
    setIsModalVisible(false);
    createNewChat(admin, chatName);
    ToastAndroid
    .showWithGravity(
        "Chat Created Successfully",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
  };
  const onEdit = () => {
    setEditMode(true);
    setModalVisible(true);

  };
  const handleEditListing = (updatedData, id) => {
    // Update the post data in Firebase
    update(ref(getDatabase(), 'listings/' + id), updatedData)
      .then(() => {
        // If the update is successful, update the state
        setEditedPost({ ...editedPost, ...updatedData });
        setModalVisible(false); // Close the editing modal
      })
      .catch((error) => {
        console.error('Error updating post:', error);
        // You might want to handle error cases here, e.g., show an error message.
      });
  };
  const createNewChat = (admin, chatName) => {

    const newKey = push(child(ref(getDatabase()), `listings/${editedPost.id}/chats`)).key;
  

    set(ref(getDatabase(), `listings/${editedPost.id}/chats/` + newKey), {
      id: newKey,
      chatName: chatName,
      participants: [currentUser.email, editedPost.owner, admin]


    });
    
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageView}>
          <ImageGallery postImages={editedPost.images} />
        </View>
        <View style={[{ marginHorizontal: 10, marginVertical: 10, marginTop: 10, backgroundColor: "white", borderRadius: 5, padding: 10 }, styles.shadow]}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#DC6B11" }}>Rs {editedPost.price}</Text>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{editedPost.title}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={require('../assets/location.gif')} style={{ width: 25, height: 25 }} />
              <Text style={{ fontSize: 15, }}>Model Town, Gujranwala</Text>
            </View>
            <View >
              <Text style={{ fontSize: 15, }}>20/10/2023</Text>
            </View>
          </View>
          <View style={{ marginTop: 10, borderRadius: 5 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Description:</Text>
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "grey" }}>
              {editedPost.description}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={[{ marginHorizontal: 10, marginVertical: 10, backgroundColor: "white", borderRadius: 5, padding: 5 }, styles.shadow]}>
        {editedPost.owner === currentUser ? (
          <TouchableOpacity style={[{ flexDirection: "row", alignItems: "center", backgroundColor: "#DC6B11", borderRadius: 5, padding: 5, justifyContent: "center", }, styles.shadow]}
            onPress={
              () => {
                onEdit()
              }
            }>
            <Image source={require('../assets/postChat.png')} style={{ width: 40, height: 40, }} />
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "white", marginLeft: 10 }}>Edit Your Post</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[{ flexDirection: "row", alignItems: "center", backgroundColor: "#DC6B11", borderRadius: 5, padding: 5, justifyContent: "center", }, styles.shadow]}
            onPress={handleChatWithSeller}>
            <Image source={require('../assets/postChat.png')} style={{ width: 40, height: 40, }} />
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "white", marginLeft: 10 }}>Chat with Seller</Text>
          </TouchableOpacity>
        )

        }

      </View>
      <AdminSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdminSelect={handleAdminSelection}
      />

      {isModalVisible && (
        <View style={styles.overlay} />
      )}
      {modalVisible && (
        <SellingDetails
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          category={editedPost.category} // Pass the category to SellingDetails
          editMode={editMode} // Pass the edit mode flag
          dataToEdit={editedPost} // Pass the data of the selected ad to edit
          onEditListing={handleEditListing} // Pass the edit function
        />
      )}
    </View>
  )
}

export default PostDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD580"
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  imageView: {

    height: 200,
    width: 360
  },
  shadow: {
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.5, // iOS
    shadowRadius: 3, // iOS
    elevation: 5
  }
})