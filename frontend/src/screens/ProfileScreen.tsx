import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importieren Sie die benötigten Icons

const ProfileScreen = ({ verification_id, changeScreen }) => {
  const [userData, setUserData] = useState(null);
  const serverip3 = process.env.SERVER_IP3;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${serverip3}/userData`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ verification_id }),
        });

        const result = await response.json();

        if (response.ok) {
          setUserData(result);
        } else {
          console.error('Failed to fetch user data:', result);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserData();
  }, [verification_id]);

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>Stats werden geladen...</Text>
    </View> 
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{userData.username}</Text>
      <Text style={styles.title}>{userData.title}</Text>
      <Text style={styles.allTimeStats}>ALL TIME STATS</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <FontAwesome5 name="shoe-prints" size={24} color="#44C781" style={styles.icon} />
          <View style={styles.statTextContainer}>
            <Text style={styles.statName}>Walked km</Text>
            <Text style={styles.statValue}>{userData.allrout} km</Text>
          </View>
        </View>
        <View style={styles.statItem}>
          <FontAwesome5 name="shoe-prints" size={24} color="#44C781" style={styles.icon} />
          <View style={styles.statTextContainer}>
            <Text style={styles.statName}>Steps</Text>
            <Text style={styles.statValue}>{userData.allsteps} steps</Text>
          </View>
        </View>
        <View style={styles.statItem}>
          <FontAwesome5 name="coins" size={24} color="#FFD700" style={styles.icon} />
          <View style={styles.statTextContainer}>
            <Text style={styles.statName}>Collected Coins</Text>
            <Text style={styles.statValue}>{userData.allcoins} coins</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.accountButton} onPress={() => changeScreen('Account')}>
        <View style={styles.accountButtonContent}>
          <FontAwesome5 name="lock" size={24} color="#252826" style={styles.accountIcon} />
          <Text style={styles.accountText}>Account</Text>
          <FontAwesome5 name="chevron-right" size={24} color="#252826" style={styles.chevronIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#EBF2F6',
    paddingTop: 60, // Abstand vom oberen Rand
  },
  username: {
    marginTop: 60,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#252826',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    color: '#7d7d7d',
    marginBottom: 10,
  },
  allTimeStats: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#252826',
    marginBottom: 10,
    marginTop: 50,
    alignSelf: 'flex-start', // Links ausrichten
    marginLeft: 25, // Abstand zum linken Rand
  },
  statsContainer: {
    backgroundColor: '#fff', // Weiß
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginRight: 15,
  },
  statTextContainer: {
    flexDirection: 'column',
  },
  statName: {
    fontSize: 18,
    color: '#000', // Schwarz
    fontWeight: 'bold', // Fett
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    color: '#C7C7C7', // Hellgrau
  },
  accountButton: {
    marginTop: 20,
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  accountIcon: {
    marginRight: 15,
  },
  accountText: {
    fontSize: 18,
    color: '#252826',
    flex: 1,
  },
  chevronIcon: {
    marginLeft: 'auto',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default ProfileScreen;
