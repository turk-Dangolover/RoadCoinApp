import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';


const HubScreen = ({ verification_id }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const serverip1 = process.env.SERVER_IP1;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${serverip1}/leaderboard`);
        const result = await response.json();

        if (response.ok) {
          setLeaderboard(result);
        } else {
          console.error('Failed to fetch leaderboard');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchUserRank = async () => {
      try {
        const response = await fetch(`${serverip1}/user/rank/${verification_id}`);
        const result = await response.json();

        if (response.ok) {
          setUserRank(result);
        } else {
          console.error('Failed to fetch user rank');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchLeaderboard();
    fetchUserRank();
  }, [verification_id]);

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.coins}>{item.allcoins}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titel}>Top 50 Leaderboard</Text>
      <FlatList
        data={leaderboard}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />
      {userRank && (
        <View style={styles.userRankContainer}>
          <Text style={styles.userRankText}>Your Position:</Text>
          <Text style={styles.userRank}>{userRank.rank}</Text>
          <Text style={styles.coins}>{userRank.allcoins} coins</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EBF2F6',
  },
  titel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#252826',
    alignSelf: 'center',
    marginBottom: 50,
    marginTop: 50,
  },
  list: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 10,
  },
  rank: {
    fontSize: 18,
    color: '#252826',
    fontWeight: 'bold',
  },
  username: {
    fontSize: 18,
    color: '#252826',
  },
  title: {
    fontSize: 18,
    color: '#7d7d7d',
  },
  coins: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  userRankContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  userRankText: {
    fontSize: 18,
    color: '#252826',
    fontWeight: 'bold',
    marginBottom: 0,
  },
  userRank: {
    fontSize: 18,
    color: '#44C781',
    fontWeight: 'bold',
    padding: 10,
  },
});

export default HubScreen;
