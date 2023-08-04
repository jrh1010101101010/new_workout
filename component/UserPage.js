import React, { useEffect, useState } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import { userData } from '../lib/UserData';

export default function UserPage({ navigation }){
    const [userInfo, setUserInfo]=useState(null)
    const [workouts, setWorkouts]= useState(null)

    useEffect(()=> {
        const loadData = async() => {
            const loadUserData = await userData(navigation)
            if (loadUserData){
                setUserInfo(loadUserData)
            } else{
                navigation.navigate('Login')
            }
        }
        
        loadData()
    }, [])

    useEffect(() => {
      const loadWorkouts = async () => {
        if (userInfo) {
          const { data, error } = await supabase
            .from('workout')
            .select()
            .eq('user_id', userInfo.id)
  
          if (error) {
            console.log('Error fetching workouts:', error.message)
          } else {
            setWorkouts(data) 
          }
        }
      }
  
      loadWorkouts()
    }, [userInfo])

    const handleDelete = async(id)  => {
        console.log('clicking')
        try{
          const { error } = await supabase
            .from('exercise')
            .delete()
            .eq('workout_id', id)

          if (error){
            console.log('error deleting exercises: ', error)
          } else{
            const { e } = await supabase
              .from('workout')
              .delete()
              .eq('id', id)
              if (e) {
                console.log('error deleteing workout :', e)
              } else{
                setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== id))
              }
          }
        } catch(error){
          console.log(error)
        }
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>User Page</Text>
        {userInfo ? (
          <View>
            <Text style={styles.email}>Email: {userInfo.email}</Text>
            {workouts ? (
              workouts.map((workout) => (
                <View key={workout.id} style={styles.workoutContainer}>
                  <Text style={styles.workoutTitle}>Workout Title: {workout.title}</Text>
                  <Text style={styles.workoutDescription}>Description: {workout.description}</Text>
                  <TouchableHighlight
                    style={styles.detailsButton}
                    onPress={() =>
                      navigation.navigate('Workout', {
                        workout: workout,
                      })
                    }
                  >
                    <Text style={styles.detailsButtonText}>Go to details</Text>
                  </TouchableHighlight>
                  <TouchableHighlight style={styles.deleteButton} onPress={() => handleDelete(workout.id)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableHighlight>
                </View>
              ))
            ) : (
              <Text>Loading user workouts...</Text>
            )}
          </View>
        ) : (
          <Text>Loading user information...</Text>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    email: {
      fontSize: 18,
      marginBottom: 20,
    },
    workoutContainer: {
      backgroundColor: '#fff',
      padding: 16,
      marginBottom: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    workoutTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    workoutDescription: {
      fontSize: 14,
      marginBottom: 8,
    },
    detailsButton: {
      backgroundColor: '#007bff',
      padding: 8,
      borderRadius: 4,
      marginBottom: 4,
    },
    detailsButtonText: {
      color: '#fff',
      textAlign: 'center',
    },
    deleteButton: {
      backgroundColor: '#dc3545',
      padding: 8,
      borderRadius: 4,
    },
    deleteButtonText: {
      color: '#fff',
      textAlign: 'center',
    },
  });