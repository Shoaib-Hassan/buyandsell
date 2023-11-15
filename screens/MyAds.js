import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image} from 'react-native';
import { useDataContext } from '../Context';
import { Card, Button, Modal } from 'react-native-paper';
import SellingDetails from '../components/SellingDetails';
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import messaging from '@react-native-firebase/messaging'
import { useIsFocused } from '@react-navigation/native';
import { ToastAndroid } from 'react-native';
import { ActivityIndicator } from 'react-native';
const RenderAdCard = React.memo(({ item, onThreeDotsPress, onEdit, onRemove }) => {
  const fileId = item.images[0].match(/^https:\/\/drive\.google\.com\/file\/d\/([^/]+)\/view/)[1];
  const directImageLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const isActive = item.status === 'active';
  const isSold = item.status === 'sold';

  return (
    
    <Card style={styles.card}>
      <Card.Cover source={{ uri: directImageLink }} />

      <View style={styles.threeDotsContainer}>
        <TouchableOpacity style={styles.threeDots} onPress={() => onThreeDotsPress(item)}>
          <Image source={require('../assets/threeDots.png')} style={{ width: 25, height: 25 }} />
        </TouchableOpacity>
      </View>
      <Card.Content>
        <Text>{item.title}</Text>
        <Text>Price: ${item.price}</Text>
        <Text>Category: {item.category}</Text>
        <Text>Posting Date: {item.postingDate}</Text>
        <Text>Status: {item.status}</Text>
      </Card.Content>
      {isActive && (
        <Card.Actions>
          <Button onPress={() => onEdit(item)}>Edit</Button>
          <Button onPress={() => onRemove(item)}>Remove</Button>
        </Card.Actions>
      )}
      {isSold && (
        <Card.Actions>
          <Button onPress={() => onRemove(item)}>Remove</Button>
        </Card.Actions>
      )}
    </Card>
  );
});

const MyAds = () => {
  const [loading, setLoading] = useState(true);
  const { listings, setListings, currentUser } = useDataContext();
  const [data, setData] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    setLoading(true);
    const filteredData = listings.filter((item) => item.owner === currentUser?.email);
    setData(filteredData);
    if(isFocused){
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 100)
      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        console.log(remoteMessage.notification.title);
        ToastAndroid.show("New Message in Chat " + remoteMessage.notification.title, ToastAndroid.LONG)
      });
      return unsubscribe;
    }


  }, [listings, currentUser?.email,isFocused]);

  const onEdit = (item) => {
    setSelectedAd(item);
    setEditMode(true);
    setModalVisible(true);
  };

  const onRemove = (item) => {
    alert("Are you sure you want to remove this ad?");
    const listingRef = ref(getDatabase(), `listings/${item.id}`);
    remove(listingRef);
  };

  const onThreeDotsPress = () => {
    // to do
  };

  const handleEditListing = useCallback((updatedData, id) => {
    update(ref(getDatabase(), 'listings/' + id), updatedData);
  }, []);

  const showModal = () => (
    <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
      <View style={{ backgroundColor: 'white', padding: 16 }}>
        <Button onPress={markAsSold}>Mark as Sold</Button>
        <Button onPress={deactivate}>Deactivate</Button>
        <Button onPress={() => setModalVisible(false)}>Cancel</Button>
      </View>
    </Modal>
  );

  const markAsSold = () => {
  };

  const deactivate = () => {
    // Implement deactivate functionality here
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", }}>
      {loading?( <ActivityIndicator style={styles.loader} size="large" color="#DC6B11" />)
      : (
        <View style={{ justifyContent: "center", alignItems: "center",}}>
        {data.length === 0 ? (
          <Text style={{ fontSize: 24, alignSelf: 'center', justifyContent: "center" }}>You do not have any Ads yet</Text>
        ) : (
          <FlatList
            style={{ width: "100%", height: "100%", marginBottom: 100  }}
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RenderAdCard 
                item={item}
                onThreeDotsPress={onThreeDotsPress}
                onEdit={onEdit}
                onRemove={onRemove}
                
              />
            )}
          />
        )}
        {modalVisible && (
          <SellingDetails
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            categoryName={selectedAd.category} 
            categoryURL={selectedAd.categoryURL} 
            editMode={editMode} // Pass the edit mode flag
            dataToEdit={selectedAd} // Pass the data of the selected ad to edit
            onEditListing={handleEditListing} // Pass the edit function
          />
        )}

      </View>
      )
    }
      
    
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    marginBottom: 20,
    marginHorizontal:10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  threeDotsContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  threeDots: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyAds;
