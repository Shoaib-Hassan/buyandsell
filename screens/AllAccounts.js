import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import PostCard from '../components/PostCard';

export default function AllAccounts({ route,navigation}) {
  const { filterAccounts, category } = route.params; 
 
  React.useLayoutEffect(() => {
    navigation.setOptions({
    headerTitle: category,
    });
  }, [navigation])
    
  
    const [searchText, setSearchText] = useState('');
    const filteredData = filterAccounts?.filter(
      (item) => item.title.toLowerCase().includes(searchText.toLowerCase())
    );
  
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title"
          onChangeText={(text) => setSearchText(text)}
        />
  
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PostCard post={item} navigation={navigation} />}
          numColumns={2}
        />
      </View>
    );
  }
  

  

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
  },
  searchInput: {
    marginBottom: 10,
    padding: 10,
    marginHorizontal:10,
    marginVertical:5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});
