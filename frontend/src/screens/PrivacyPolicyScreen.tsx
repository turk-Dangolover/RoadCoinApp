import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const PrivacyPolicyScreen = ({ changeScreen }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => changeScreen('Account')}>
        <FontAwesome5 name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Datenschutzerklärung</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>1. Einleitung</Text>
        <Text style={styles.paragraph}>
          Willkommen bei RodeCoin! Der Schutz Ihrer personenbezogenen Daten ist uns sehr wichtig. Diese Datenschutzerklärung informiert Sie darüber, welche Daten wir erheben, wie wir diese verwenden und welche Rechte Sie bezüglich Ihrer Daten haben.
        </Text>
        <Text style={styles.heading}>2. Verantwortlicher</Text>
        <Text style={styles.paragraph}>
          Verantwortlicher für die Datenverarbeitung ist:
        </Text>
        <Text style={styles.paragraph}>
          RodeCoin Inc.{'\n'}
          Beispielstraße 123{'\n'}
          12345 Musterstadt{'\n'}
          Email: privacy@rodecoin.com
        </Text>
        <Text style={styles.heading}>3. Erhebung und Verarbeitung personenbezogener Daten</Text>
        <Text style={styles.paragraph}>
          Wir erheben und verarbeiten personenbezogene Daten nur, wenn dies gesetzlich erlaubt ist oder Sie in die Datenerhebung einwilligen. Zu den personenbezogenen Daten gehören:
        </Text>
        <Text style={styles.listItem}>- Name</Text>
        <Text style={styles.listItem}>- Email-Adresse</Text>
        <Text style={styles.listItem}>- Standortinformationen</Text>
        <Text style={styles.heading}>4. Zweck der Datenverarbeitung</Text>
        <Text style={styles.paragraph}>
          Die Erhebung und Verarbeitung Ihrer personenbezogenen Daten erfolgt zu folgenden Zwecken:
        </Text>
        <Text style={styles.listItem}>- Zur Abwicklung von Transaktionen</Text>
        <Text style={styles.listItem}>- Zur Verbesserung unseres Serviceangebots</Text>
        <Text style={styles.listItem}>- Zur Einhaltung gesetzlicher Verpflichtungen</Text>
        <Text style={styles.heading}>5. Datensicherheit</Text>
        <Text style={styles.paragraph}>
          Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten vor Manipulation, Verlust, Zerstörung oder dem Zugriff unberechtigter Personen zu schützen.
        </Text>
        <Text style={styles.heading}>6. Weitergabe von Daten</Text>
        <Text style={styles.paragraph}>
          Eine Weitergabe Ihrer personenbezogenen Daten an Dritte erfolgt nur, wenn dies zur Vertragserfüllung erforderlich ist oder Sie ausdrücklich eingewilligt haben.
        </Text>
        <Text style={styles.heading}>7. Rechte der betroffenen Personen</Text>
        <Text style={styles.paragraph}>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten sowie das Recht auf Datenübertragbarkeit und das Recht, Beschwerde bei einer Aufsichtsbehörde einzulegen.
        </Text>
        <Text style={styles.heading}>8. Kontakt</Text>
        <Text style={styles.paragraph}>
          Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten, bei Auskünften, Berichtigung, Sperrung oder Löschung von Daten sowie Widerruf erteilter Einwilligungen wenden Sie sich bitte an:
        </Text>
        <Text style={styles.paragraph}>
          RodeCoin Inc.{'\n'}
          Email: support@rodecoin.com
        </Text>
        <Text style={styles.heading}>9. Änderungen der Datenschutzerklärung</Text>
        <Text style={styles.paragraph}>
          Wir behalten uns vor, diese Datenschutzerklärung jederzeit zu ändern, um sie an geänderte Rechtslagen oder bei Änderungen des Dienstes sowie der Datenverarbeitung anzupassen. Die aktuelle Version finden Sie immer auf unserer Website.
        </Text>
        <Text style={styles.paragraph}>
          Diese Datenschutzerklärung wurde zuletzt aktualisiert am 27. Mai 2024.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EBF2F6',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 50,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#252826',
    alignSelf: 'center',
    marginBottom: 50,
  },
  scrollContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#252826',
  },
  paragraph: {
    fontSize: 16,
    marginVertical: 5,
    color: '#252826',
  },
  listItem: {
    fontSize: 16,
    marginVertical: 2,
    color: '#252826',
    paddingLeft: 10,
  },
});

export default PrivacyPolicyScreen;
