import AsyncStorage from "@react-native-async-storage/async-storage";

export const userData = async(navigation) => {
    const userData = await AsyncStorage.getItem('userData')
    if(userData!== null){
        return JSON.parse(userData)
    } else {
        navigation.navigate('Login')
        return null
    }
}
