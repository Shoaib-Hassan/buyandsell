import { StyleSheet, Text, View, Image, Pressable, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';

const PostCard = ({ post, navigation }) => {
  const fileId = post.images[0].match(/^https:\/\/drive\.google\.com\/file\/d\/([^/]+)\/view/)[1];
  const directImageLink = `https://drive.google.com/uc?export=download&id=${fileId}`;

  const { width } = Dimensions.get('window');
  const cardWidth = (width - 20) / 2; 
  const [newTitle, setNewTitle] = useState('')
  const [time, setTime] = useState()
  useEffect(()=>{
    const postingTime = post.time;
    const currentTime = Date.now();
    const timeDifference = currentTime - postingTime;
    const secondsDifference = Math.floor(timeDifference / 1000);
    if (secondsDifference < 60) {
    setTime(`${secondsDifference} seconds ago`);
    } else if (secondsDifference < 3600) {
      const minutesDifference = Math.floor(secondsDifference / 60);
      setTime(`${minutesDifference} minutes ago`);
    } else if (secondsDifference < 86400) {
      const hoursDifference = Math.floor(secondsDifference / 3600);
      setTime(`${hoursDifference} hours ago`);
    } else {
      const daysDifference = Math.floor(secondsDifference / 86400);
      setTime(`${daysDifference} days ago`);
    }
  handleTitleChange()
  },[post])
  
  const handleTitleChange = () => {
    const title = post.title;
    const maxLength = 18; 
    if (title.length > maxLength) {
      const truncatedTitle = title.substring(0, maxLength) + "...";
      setNewTitle(truncatedTitle);
    } else {
    setNewTitle(title)
    }
  }


  const dynamicStyles = {
    card: {
      width: cardWidth,
      height: 180,
      borderRadius: 5,
      margin: 5,
      shadowColor: '#000', // iOS
    },
    postPrice: {
      fontSize: 18,
      fontWeight: "bold",

    },
    postTitle: {
      fontSize: 16,
    },
    postTime: {
      fontSize: 14,
      color: "gray",
    },
    postDetails: {
      marginVertical: 5
    },
  };

  return (
    <Pressable style={[dynamicStyles.card, styles.card]} onPress={() => navigation.navigate('PostDetails', { post: post })}>
      <View>
        <Image source={{ uri: directImageLink }} style={styles.postImage} />
      </View>

      <View style={styles.postDetails}>
        <Text style={[dynamicStyles.postPrice]}>Rs {post.price}</Text>
        <Text style={[dynamicStyles.postTitle]}>{newTitle}</Text>
        <Text style={[dynamicStyles.postTime]}>{time}</Text>
      </View>
    </Pressable>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 5,
    margin: 5,
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.5, // iOS
    shadowRadius: 3, // iOS
    elevation: 5,
  },
  postImage: {
    width: '100%', // Make the image take up the full width of the card
    height: 100, // Adjust as needed
    borderRadius: 5,
  },
  postDetails: {
    marginVertical: 5,
    paddingHorizontal: 5,
  },
});
