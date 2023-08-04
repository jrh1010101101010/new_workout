import { useState } from 'react';
import { View, Text, TextInput, TouchableHighlight, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabase';


export default function Search({ navigation }){
  const [userSearch, setUserSearch]=useState('')
  const [searchData, setSearchData] = useState(null)

  const handleUserSearch = async () => {
      console.log('clicking')
      try{
        const {data, error} = await supabase
          .from('workout')
          .select()
          .textSearch('title', userSearch)

        if (error){
          console.log('fetching error:', error)
        } else{
          console.log(data)
          setSearchData(data)
        }

      } catch(error) {console.log(error)}
  }

  return (
    <View style={styles.container}>
      {searchData ? (
        <View style={styles.searchResults}>
          {searchData.map((result) => (
            <View key={result.id} style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Workout: {result.title}</Text>
              <Text style={styles.resultDescription}>Description: {result.description}</Text>
              <TouchableHighlight
                style={styles.detailsButton}
                onPress={() => navigation.navigate('Workout', {
                  workout: result
                })}
              >
                <Text style={styles.detailsButtonText}>Go to details</Text>
              </TouchableHighlight>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.searchContainer}>
          <Text style={styles.title}>User Search</Text>
          <TextInput
            style={styles.input}
            placeholder="Search for a workout here"
            onChangeText={setUserSearch}
            value={userSearch}
          />
          <TouchableHighlight style={styles.searchButton} onPress={() => handleUserSearch()}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableHighlight>
        </View>
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
  searchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResults: {
    marginTop: 10,
  },
  resultContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultDescription: {
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    width: 250,
  },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 10,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  detailsButton: {
    backgroundColor: '#007bff',
    padding: 6,
    borderRadius: 4,
    alignSelf: 'center',
    marginTop: 10,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});