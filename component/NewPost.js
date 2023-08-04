import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableHighlight, StyleSheet, Alert } from 'react-native';
import { userData } from '../lib/UserData';
import { supabase } from '../lib/supabase';

export default function NewPost({ navigation }) {
  const [uData, setUData] = useState(null);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');

  const [exercises, setExercises] = useState([
    { name: '', reps: '', sets: '', weight: '' },
  ]);

  useEffect(() => {
    const loadData = async () => {
      const UserData = await userData(navigation);

      if (UserData) {
        setUData(UserData);
      } else {
        navigation.navigate('Login')
      }
    } 
    loadData();
  }, [])

  const handleCreateWorkout = async () => {
    if (!uData || !workoutTitle || !workoutDescription) {
      return;
    }
  
    try {
      await supabase.from('workout').insert([
        {
          user_id: uData.id,
          title: workoutTitle,
          description: workoutDescription,
        },
      ])
  
      const { data: newWorkout, error } = await supabase
        .from('workout')
        .select('id')
        .eq('title', workoutTitle)
        .eq('description', workoutDescription)
        .single()
  
      if (error) {
        console.log('Error querying workout:', error.message)
      } else {
        console.log('Workout created successfully:', newWorkout)

        if (newWorkout && newWorkout.id) {
          const workoutId = newWorkout.id;

          for (const exercise of exercises) {
            const { data: exerciseData, error: exerciseError } = await supabase.from('exercise').insert([
              {
                workout_id: workoutId,
                name: exercise.name,
                reps: exercise.reps,
                sets: exercise.sets,
                weight: exercise.weight,
              },
            ]);
  
            if (exerciseError) {
              console.log('Error creating exercise:', exerciseError.message);
            } else {
              console.log('Exercise created successfully:', exerciseData);
                
              Alert.alert('Successfully posted')
              navigation.navigate('MainTabs', {screen:'Homepage'})
            }
          }
        } else {
          console.log('Workout data not available or invalid.');
        }
      }
    } catch (error) {
      console.log('Error creating workout:', error.message);
    }
  }  

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', reps: '', sets: '', weight: '' }]);
  }

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  }

  return (
    <View style={styles.container}>
      <Text>New Workout</Text>
      <TextInput
        style={styles.input}
        placeholder="Workout Title"
        onChangeText={setWorkoutTitle}
        value={workoutTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Workout Description" 
        onChangeText={setWorkoutDescription}
        value={workoutDescription}
      />

      {exercises.map((exercise, index) => (
        <View key={index}>
          <Text>New Exercise</Text>
          <TextInput
            style={styles.input}
            placeholder="Exercise Name"
            onChangeText={(value) => handleExerciseChange(index, 'name', value)}
            value={exercise.name}
          />
          <TextInput
            style={styles.input}
            placeholder="Reps"
            onChangeText={(value) => handleExerciseChange(index, 'reps', value)}
            value={exercise.reps}
          />
          <TextInput
            style={styles.input}
            placeholder="Sets"
            onChangeText={(value) => handleExerciseChange(index, 'sets', value)}
            value={exercise.sets}
          />
          <TextInput
            style={styles.input}
            placeholder="Weight"
            onChangeText={(value) => handleExerciseChange(index, 'weight', value)}
            value={exercise.weight}
          />
        </View>
      ))}

      <TouchableHighlight onPress={handleAddExercise}>
        <Text>Add Exercise</Text>
      </TouchableHighlight>

      <TouchableHighlight onPress={handleCreateWorkout}>
        <Text>Create Workout</Text>
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginBottom: 10,
    width: 200,
  },
  text: {
    margin: 5,
  },
})