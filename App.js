import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// components
import Homepage from './component/Homepage';
import Login from './component/Login';
import NewUser from './component/NewUser';
import SignUpInfo from './component/SignUpInfo';
import NewPost from './component/NewPost';
import UserPage from './component/UserPage';
import Workout from './component/Workout';
import Search from './component/Search';

// FIX ENV FILE LATER 
// come back to edit later their is an error, component = workout


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator()

function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" >
        <Stack.Screen name='Login' component={Login} /> 
        <Stack.Screen name= 'NewUser' component={NewUser}/>
        <Stack.Screen name='SignUpInfo' component={SignUpInfo}/>
        <Stack.Screen name='Workout' component={Workout}/>
        <Stack.Screen name='MainTabs' component={MainTabs}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function MainTabs (){
  return (
    <Tab.Navigator>
        <Tab.Screen name='Homepage' component={Homepage}/> 
        <Tab.Screen name='NewPost' component={NewPost}/> 
        <Tab.Screen name='Search' component={Search}/> 
        <Tab.Screen name='UserPage' component={UserPage}/>
    </Tab.Navigator>
  )
}

export default App