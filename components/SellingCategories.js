import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native';
import SellingDetails from './SellingDetails';

const SellingCategories = ({ modalVisible, setModalVisible }) => {
  const categories = [
    {
      id: 1,
      name: 'Accounts',
      icon: require('../assets/game.png'), // Replace with actual image path
    },
    {
      id: 2,
      name: 'UC Pack',
      icon: require('../assets/uc.png'), // Replace with actual image path
    },
    {
      id: 3,
      name: 'Gift Card',
      icon: require('../assets/giftcard.png'), 
    },
    {
      id: 4,
      name: 'Popularity',
      icon: require('../assets/fire.png'), 
    },
    {
      id: 5,
      name: 'Prime Plus',
      icon: require('../assets/prime.png'), 
    },
    // Add more categories as needed
  ];

  const [visibleSellingDetails, setVisibleSellingDetails] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState('');
  const hideCategoryModal = () => {
    setModalVisible(false);
  };

  const handleCategoryPress = (cat) => {
    setVisibleSellingDetails(true);
    setCategoryDetails(cat);
  };

  return (
    <View>
      <Modal animationType="fade" visible={modalVisible} onRequestClose={hideCategoryModal}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              paddingLeft: 20,
              height: 50,
              width: '100%',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderColor: '#ccc',
              backgroundColor: '#ccc',
            }}
          >
            <TouchableOpacity onPress={hideCategoryModal}>
              <Image source={require('../assets/close.png')} style={styles.closeIcon} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, marginLeft: 50 }}>What are you offering?</Text>
          </View>

          <View style={{ marginTop: 70 }}>
            {categories?.map((category) => (
              <Pressable
                key={category.id}
                style={({ pressed }) => [
                  styles.categoryBtn,
                  { backgroundColor: pressed ? '#e7e7e7' : 'white' },
                ]}
                onPress={() => handleCategoryPress(category)}
              >
                <View style={styles.circularView}>
                  <Image source={category.icon} style={styles.image} />
                </View>
                <Text style={{ marginLeft: 10, flex: 1, fontWeight: "bold", fontSize: 18}}>{category.name}</Text>
                <Image source={require('../assets/forward.png')} style={{ width: 20, height: 20 }} />
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
      <SellingDetails modalVisible={visibleSellingDetails} setModalVisible={setVisibleSellingDetails} hideCategoryModal={hideCategoryModal} category={categoryDetails} />
    </View>
  );
};

export default SellingCategories;

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  circularView: {
    backgroundColor: 'orange',
    width: 50,
    height: 50,
    borderRadius: 50,
    padding: 4,
  },
  categoryBtn: {
    marginBottom: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.5, // iOS
    shadowRadius: 3, // iOS
    elevation: 10, // Android
  },
  closeIcon: { width: 24, height: 24 },
});
