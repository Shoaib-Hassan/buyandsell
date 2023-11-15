import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React from 'react';

const CategoryCard = ({ category, data,navigation }) => {
  const imageUrl = category.image;

  return (
    <TouchableOpacity style={styles.cardContainer}
    onPress={() => { 
        navigation.navigate('Accounts', {
        category: category?.title,
        filterAccounts: data,
      });
    } }
    >
      <View style={styles.cardDetails}>
        <Image source={imageUrl} style={styles.cardImage} />
      </View>
      <Text style={styles.cardText}>{category.title}</Text>
    </TouchableOpacity>
  );
};

export default CategoryCard;

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    width: windowWidth * 0.19, // Adjust this value as needed
    
  },
  cardDetails: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'orange',
    borderRadius: 100,
    height: windowWidth * 0.15,
    width: windowWidth * 0.15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  cardImage: {
    width: 40,
    height: 40,

  },
  cardText: {
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
});
