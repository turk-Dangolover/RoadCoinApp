import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const ShopScreen = ({ verification_id }) => {
  const [shopItems, setShopItems] = useState([]);
  const [ownedItems, setOwnedItems] = useState([]);
  const [equippedItems, setEquippedItems] = useState({});
  const [currCoins, setCurrCoins] = useState(0);
  const serverip1 = process.env.SERVER_IP1;

  const fetchShopData = async () => {
    try {
      const [shopResponse, coinsResponse] = await Promise.all([
        fetch(`${serverip1}/shop/items?verificationId=${verification_id}`),
        fetch(`${serverip1}/user/coins/${verification_id}`),
      ]);

      const shopResult = await shopResponse.json();
      const coinsResult = await coinsResponse.json();

      if (shopResponse.ok) {
        setShopItems(shopResult.allShopItems);
      } else {
        console.error('Failed to fetch shop items');
      }

      if (coinsResponse.ok) {
        setCurrCoins(coinsResult.currCoins);
      } else {
        console.error('Failed to fetch user coins:', coinsResult);
      }

      setOwnedItems(shopResult.ownedItems);
      setEquippedItems(shopResult.equippedItems);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, [verification_id]);

  const handlePurchase = async (itemnumber) => {
    console.log("Verification ID:", verification_id);
    console.log("Item number:", itemnumber);
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
        setCurrCoins(result.currCoins);
      } else {
        Alert.alert('Error', 'Purchase failed');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Purchase failed');
    }
  };

  const handleEquip = async (itemnumber) => {
    try {
      console.log("Attempting to equip itemnumber:", itemnumber);

      const response = await fetch(`${serverip1}/shop/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationId: verification_id, itemNumber: itemnumber }),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert('Success', 'Item equipped successfully');
        // Refresh equipped items after equipping
        fetchShopData();
      } else {
        Alert.alert('Success', 'Item equipped successfully');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Equip failed');
    }
  };

  const renderItem = ({ item }) => {
    const owned = ownedItems.find((ownedItem) => ownedItem.itemnumber === item.itemnumber);
    const equipped = equippedItems[item.category] && equippedItems[item.category].itemnumber === item.itemnumber;

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemName}>{item.itemname}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>Price: {item.price} coins</Text>
        <Text style={styles.itemStock}>Stock: {item.stockquantity}</Text>
        {!owned && (
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => handlePurchase(item.itemnumber)}
          >
            <Text style={styles.buyButtonText}>Buy</Text>
          </TouchableOpacity>
        )}
        {owned && !equipped && (
          <TouchableOpacity
            style={styles.equipButton}
            onPress={() => handleEquip(item.itemnumber)}
          >
            <Text style={styles.equipButtonText}>Equip</Text>
          </TouchableOpacity>
        )}
        {equipped && (
          <Text style={styles.equippedText}>Equipped</Text>
        )}
      </View>
    );
  };

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
  equipButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 5,
  },
  equipButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  equippedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffc107',
    textAlign: 'center',
  },
});

export default ShopScreen;
