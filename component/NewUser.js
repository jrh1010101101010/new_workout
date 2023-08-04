import { View, Text, TextInput, StyleSheet, TouchableHighlight, Alert } from "react-native-web";
import { supabase } from "../lib/supabase";
import { useState } from "react";

export default function NewUser({ navigation}){
    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [confirmPassword, setConfirmPassword]=useState('')

    const handleSignUp = async() => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match. Please try again.')
            return
        }

        if (password < 6) Alert.alert('Password needs to be longer then 6 characters')

        try {

            const {data, error} = await supabase.auth.signUp({
                email: email,
                password: password
            })

            if (error){
                console.log('signup:', error.message)
            } else{
                console.log('Successful signup')
            }

            navigation.navigate('SignUpInfo')

        }catch(error){
            console.log('Sign up error:', error.message)
        }

        console.log('clicking')
    }
    
    return (
        <View style={styles.container}>
          <Text style={styles.title}>User Sign Up</Text>
          <Text style={styles.subtitle}>Enter User Details Below</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="your@email.com"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Enter a password"
            secureTextEntry={true}
          />
          <TextInput
            style={styles.input}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholder="Confirm Password"
            secureTextEntry={true}
          />
          <TouchableHighlight style={styles.button} onPress={() => handleSignUp()}>
            <Text style={styles.buttonText}>Sign Up!</Text>
          </TouchableHighlight>
        </View>
    );
}
    
const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    },
    title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    },
    subtitle: {
    fontSize: 16,
    marginBottom: 20,
    },
    input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginBottom: 10,
    width: 200,
    },
    button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
    },
    buttonText: {
    color: 'white',
    fontWeight: 'bold',
    },
});