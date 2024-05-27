import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const AvatarScreen = ({ verification_id }) => {
  const [avatarItems, setAvatarItems] = useState([]);
  const serverip1 = process.env.SERVER_IP1;

  useEffect(() => {
    const fetchAvatarItems = async () => {
      try {
        const response = await fetch(`${serverip1}/avatar/items/${verification_id}`);
        const result = await response.json();

        if (response.ok) {
          setAvatarItems(result);
        } else {
          console.error('Failed to fetch avatar items:', result);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchAvatarItems();
  }, [verification_id]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.itemName}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemCategory}>Category: {item.category}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={avatarItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.itemNumber.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EBF2F6',
  },
  list: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#252826',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#7d7d7d',
    marginBottom: 10,
  },
  itemCategory: {
    fontSize: 16,
    color: '#252826',
  },
});

export default AvatarScreen;
