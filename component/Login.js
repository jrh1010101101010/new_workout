import { Text, View, StyleSheet, TextInput, TouchableHighlight} from "react-native-web"
import { useState } from "react"
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const [email, changeEmail] = useState('');
  const [password, changePassword] = useState('');
  console.log('env file', process.env)
  console.log(process.env.SECRET_COLOUR)
  const handleLogin = async ()=> {
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
  
        if (error) {
          
          console.log('Login Error:', error.message);
        } else {
          
          console.log('Login successful')
          
          await AsyncStorage.setItem('userData', JSON.stringify(data.user))

          navigation.navigate('MainTabs', {screen: 'Homepage'})
        }
      } catch (error) {
        console.log('Login Error:', error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
      <TextInput
        style={styles.input}
        onChangeText={changeEmail}
        placeholder="Email"
        value={email}
      />
      <TextInput
        style={styles.input}
        onChangeText={changePassword}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
      />
      <TouchableHighlight style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => navigation.navigate("NewUser")}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up Here</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    marginBottom: 10,
    width: 200,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  signUpText: {
    marginTop: 10,
  },
});