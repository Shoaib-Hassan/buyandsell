import React from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import PostCard from './PostCard';

const CategoryComponent = ({ categoryTitle, data, navigation }) => {
  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 15, alignItems: "center" }}>
        <Text style={{ fontSize: 25, fontWeight: "900", color: "#DC6B11" }}>{categoryTitle}</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Accounts', { filterAccounts: data, category: categoryTitle});
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "bold", color: "blue" }}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{ height: 200, marginLeft:10 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data?.slice(0, 5)} // Render the first 5 items
        renderItem={({ item }) => <PostCard post={item} navigation={navigation} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default CategoryComponent;
