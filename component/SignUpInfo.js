import React from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native-web';

export default function SignUpInfo({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thank you for Signing Up!</Text>
      <Text style={styles.subtitle}>
        You have been sent an email. Before logging in, you need to confirm your email.
      </Text>
      <TouchableHighlight style={styles.linkContainer} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Or you can click here to go back to login if you haven't been redirected yet</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  linkContainer: {
    marginTop: 10,
  },
  linkText: {
    fontSize: 14,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

