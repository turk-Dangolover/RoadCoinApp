import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const ShopScreen = ({ verification_id }) => {
  const [shopItems, setShopItems] = useState([]);
  const [currCoins, setCurrCoins] = useState(0);
  const serverip1 = process.env.SERVER_IP1;

  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        const response = await fetch(`${serverip1}/shop/items`);
        const result = await response.json();

        console.log("Shop items fetched:", result);  // Überprüfen Sie die zurückgegebenen Daten

        if (response.ok) {
          setShopItems(result);
        } else {
          console.error('Failed to fetch shop items');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchUserCoins = async () => {
      try {
        const response = await fetch(`${serverip1}/user/coins/${verification_id}`);
        const result = await response.json();

        console.log("User coins fetched:", result);  // Überprüfen Sie die zurückgegebenen Daten

        if (response.ok) {
          setCurrCoins(result.currCoins);
        } else {
          console.error('Failed to fetch user coins:', result);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchShopItems();
    fetchUserCoins();
  }, [verification_id]);

  const handlePurchase = async (itemnumber) => {
    try {
      console.log("Attempting to purchase itemnumber:", itemnumber);

      const item = shopItems.find((item) => item.itemnumber === itemnumber);
      if (!item) {
        Alert.alert('Error', 'Item not found');
        return;
      }

      const response = await fetch(`${serverip1}/shop/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationId: verification_id, itemNumber: itemnumber }),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert('Success', 'Purchase successful');
        setCurrCoins(result.currCoins); // Use result.currCoins to update currCoins
      } else {
        Alert.alert('Error', 'Purchase failed');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Purchase failed');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.itemname}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemPrice}>Price: {item.price} coins</Text>
      <Text style={styles.itemStock}>Stock: {item.stockquantity}</Text>
      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => handlePurchase(item.itemnumber)}
      >
        <Text style={styles.buyButtonText}>Buy</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.coinsContainer}>
        <Text style={styles.coinsText}>Coins: {currCoins}</Text>
      </View>
      <FlatList
        data={shopItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.itemnumber ? item.itemnumber.toString() : Math.random().toString()}
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
  coinsContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  coinsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#252826',
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
  itemPrice: {
    fontSize: 16,
    color: '#252826',
    marginBottom: 5,
  },
  itemStock: {
    fontSize: 14,
    color: '#252826',
    marginBottom: 10,
  },
  buyButton: {
    backgroundColor: '#3998E8',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default ShopScreen;
