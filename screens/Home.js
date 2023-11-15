import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import CategoryCard from '../components/CategoryCard';
import CategoryComponent from '../components/CategoryComponent';
import { useIsFocused } from '@react-navigation/native';
import { RefreshControl } from 'react-native';
import { useDataContext } from '../Context';
import messaging from '@react-native-firebase/messaging'
import { ToastAndroid } from 'react-native';




export default function Home({ navigation }) {

  const isFocused = useIsFocused();
  const Categories = [
    { id: "accounts", title: "Accounts", image: require('../assets/game.png') },
    { id: "popularity", title: "Popularity", image: require("../assets/fire.png") },
    { id: "uc", title: "UC Pack", image: require('../assets/uc.png') },
    { id: "cards", title: "Gift Card", image: require('../assets/giftcard.png') },
    { id: "prime", title: "Prime Plus", image: require('../assets/prime.png') },
  ];
  const { listings, getUpdateData, currentUser } = useDataContext()
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterAccounts, setFilteredAccounts] = useState([]);
  const [filterPopularity, setFilteredPopularity] = useState([]);
  const [filterUC, setFilteredUC] = useState([]);
  const [filterCards, setFilteredCards] = useState([]);
  const [filterPrime, setFilteredPrime] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchData()
    if (isFocused) {

      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        console.log(remoteMessage.notification.title);
        ToastAndroid.show("New Message in Chat " + remoteMessage.notification.title, ToastAndroid.LONG)
      });

      return unsubscribe;
    }

  }, [isFocused]);

  const fetchData = () => {
    getUpdateData();
    getFilteredData();
    setLoading(false)
  };
  const getFilteredData = () => {
    try {
      const accountsData = listings.filter((item) => item.category === "Accounts");
      const popularityData = listings.filter((item) => item.category === "Popularity");
      const ucData = listings.filter((item) => item.category === "UC Pack");
      const cardsData = listings.filter((item) => item.category === "Gift Card");
      const primeData = listings.filter((item) => item.category === "Prime Plus");
      setFilteredAccounts(accountsData);
      setFilteredPopularity(popularityData);
      setFilteredUC(ucData);
      setFilteredCards(cardsData);
      setFilteredPrime(primeData);

    } catch (error) {
      console.error('Error fetching data from Firebase:', error);
    }

  }

  handleRefresh = () => {
    setRefreshing(true);
    getUpdateData();
    setTimeout(() => {

      setRefreshing(false);

    }, 500);
  }





  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>

      {loading ? (
        <ActivityIndicator style={{ marginVertical: 300 }} size="large" color="#DC6B11" />
      ) : (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} bounces={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View >
            <View style={styles.categories}>
              <Text style={styles.categoriesText}>Browse Categories</Text>

              <FlatList
                bounces={false}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={Categories}
                renderItem={({ item }) => (
                  <CategoryCard
                    category={item}
                    data={item.id === "accounts" ? filterAccounts : item.id === "popularity" ? filterPopularity : item.id === "uc" ? filterUC : item.id === "cards" ? filterCards : item.id === "prime" ? filterPrime : []}
                    navigation={navigation}

                  />
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
            <View style={styles.posts}>

              <CategoryComponent categoryTitle="Accounts" data={filterAccounts} navigation={navigation} />
              <CategoryComponent categoryTitle="Popularity" data={filterPopularity} navigation={navigation} />
              <CategoryComponent categoryTitle="Game Topup" data={filterUC} navigation={navigation} />
              <CategoryComponent categoryTitle="Gift Card" data={filterCards} navigation={navigation} />
              <CategoryComponent categoryTitle="Prime Plus" data={filterPrime} navigation={navigation} />
            </View>
          </View>
        </ScrollView>
      )}

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  subContainer: {
    marginHorizontal: 10,
  },
  categories: {
    marginTop: 10,
    marginHorizontal: 10,
  },
  categoriesText: {
    fontSize: 25, fontWeight: "900", color: "#DC6B11",
    marginLeft: 5,

  },
  posts: {
    marginBottom: 80,
  },

});
