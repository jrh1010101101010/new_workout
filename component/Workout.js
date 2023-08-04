import { useEffect, useState} from 'react';
import { View, Text, TouchableHighlight, StyleSheet, TextInput} from 'react-native';
import { supabase } from '../lib/supabase';
import { userData } from '../lib/UserData';


export default function Workout({ navigation, route }){
    const { workout: initialWorkout } = route.params; // Rename to avoid naming conflict
    const [exercises, setExercises]= useState(null)
    const [userInfo, setUserInfo] = useState(null)
    const [userDataLoaded, setUserDataLoaded] = useState(false)
    const [editing, setEditing]= useState(false)
    const [updateWorkout, setUpdateWorkout]= useState(null)
    const [updateExercise, setUpdateExercise]= useState(null)
    const [workout, setWorkout] = useState(initialWorkout); // Define the workout state here

    useEffect(() => {
        const loadExercises = async() =>{
            const {data,error} = await supabase
                .from('exercise')
                .select()
                .eq('workout_id', workout.id)
            if (error){
                console.log('error fetching exercises')
            } else{
                setExercises(data)
            }
        }

        loadExercises()
    }, [])

    useEffect(() => {
        const loadData = async () => {
            const loadUserData = await userData(navigation)
            if (loadUserData){
                setUserInfo(loadUserData)
                setUserDataLoaded(true)
            }
        }
        loadData()
    }, [])
    
    const isEditable = userInfo && workout.user_id === userInfo.id

    const handleSave = async () => {
        if (updateWorkout) {
          try {
            const { data: updatedWorkout, error: updateWorkoutError } = await supabase
              .from('workout')
              .update(updateWorkout)
              .eq('id', workout.id)
    
            if (updateWorkoutError) {
              console.log('Error updating workout:', updateWorkoutError.message)
            } else {
              console.log('Workout updated successfully:', updatedWorkout)
              setWorkout(prevWorkout => ({ ...prevWorkout, ...updatedWorkout }))
              setUpdateWorkout(null)
            }
          } catch (error) {
            console.log('Error updating workout:', error.message)
          }
        }
    
        if (updateExercise) {
          try {
            const { data: updatedExercise, error: updateExerciseError } = await supabase
              .from('exercise')
              .update(updateExercise)
              .eq('workout_id', workout.id)
    
            if (updateExerciseError) {
              console.log('Error updating exercise:', updateExerciseError.message)
            } else {
              console.log('Exercise updated successfully:', updatedExercise)
              
              setUpdateExercise(null)
            }
          } catch (error) {
            console.log('Error updating exercise:', error.message)
          }
        }
        
        setEditing(false)
        // navigation.navigate('Workout', {
        //     workout: workout
        // })
    };

    return (
        <View style={styles.container}>
          <Text style={styles.title}>Details</Text>
          {userDataLoaded && isEditable && (
            <View>
              {/* Workout Details */}
              {editing ? (
                // Render input boxes for workout details when in editing mode
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Workout Title"
                    onChangeText={(text) => setUpdateWorkout({ ...updateWorkout, title: text })}
                    value={updateWorkout?.title || workout.title}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Workout Description"
                    onChangeText={(text) =>
                      setUpdateWorkout({ ...updateWorkout, description: text })
                    }
                    value={updateWorkout?.description || workout.description}
                  />
                </>
              ) : (
                // Render regular text for workout details when not in editing mode
                <>
                  <Text style={styles.workoutTitle}>Workout Title: {workout.title}</Text>
                  <Text style={styles.workoutDescription}>Description: {workout.description}</Text>
                </>
              )}
            </View>
          )}
          <View style={styles.exerciseContainer}>
            {exercises ? (
              exercises.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseItem}>
                  {editing ? (
                    // Render input boxes when in editing mode
                    <>
                      <TextInput
                        style={styles.input}
                        placeholder="Exercise Name"
                        onChangeText={(text) => setUpdateExercise({ ...updateExercise, name: text })}
                        value={updateExercise?.name || exercise.name}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Exercise Sets"
                        onChangeText={(text) => setUpdateExercise({ ...updateExercise, sets: text })}
                        value={updateExercise?.sets?.toString() || exercise.sets.toString()}
                        keyboardType="numeric" 
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Exercise Weight"
                        onChangeText={(text) =>
                          setUpdateExercise({ ...updateExercise, weight: text })
                        }
                        value={updateExercise?.weight?.toString() || exercise.weight.toString()}
                        keyboardType="numeric" 
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Exercise Reps"
                        onChangeText={(text) => setUpdateExercise({ ...updateExercise, reps: text })}
                        value={updateExercise?.reps?.toString() || exercise.reps.toString()}
                        keyboardType="numeric" 
                      />
                    </>
                  ) : (
                    <>
                      <Text style={styles.exerciseName}>Exercise Name: {exercise.name}</Text>
                      <Text style={styles.exerciseSets}>Exercise Sets: {exercise.sets}</Text>
                      <Text style={styles.exerciseWeight}>Exercise Weight: {exercise.weight}</Text>
                      <Text style={styles.exerciseReps}>Exercise Reps: {exercise.reps}</Text>
                    </>
                  )}
                </View>
              ))
            ) : (
              <Text>Loading exercises</Text>
            )}
          </View>
    
          {/* Edit button */}
          <TouchableHighlight style={styles.button} onPress={() => setEditing(!editing)}>
            <Text style={styles.buttonText}>{editing ? 'Cancel' : 'Edit'}</Text>
          </TouchableHighlight>
          {editing ? (
            <TouchableHighlight style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableHighlight>
          ) : null}
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    workoutTitle: {
      fontSize: 18,
      marginBottom: 5,
    },
    workoutDescription: {
      fontSize: 16,
      marginBottom: 20,
    },
    exerciseContainer: {
      marginBottom: 10,
    },
    exerciseItem: {
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      marginBottom: 10,
    },
    exerciseName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    exerciseReps: {
      fontSize: 14,
    },
    exerciseSets: {
      fontSize: 14,
    },
    exerciseWeight: {
      fontSize: 14,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 8,
      marginBottom: 8,
      borderRadius: 4,
    },
    button: {
      backgroundColor: '#007bff',
      padding: 10,
      borderRadius: 4,
      alignSelf: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      textAlign: 'center',
    },
});  