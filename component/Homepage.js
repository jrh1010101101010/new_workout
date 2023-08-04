import React, { useEffect, useState } from 'react';
import { View, Text, TouchableHighlight, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Homepage({ navigation }) {
  const [feed, setFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const { data, error } = await supabase
          .from('workout')
          .select('*')
          .order('id', { ascending: false })
          .limit(10);

        if (error) {
          console.log('Error fetching feed:', error.message);
        } else {
          setFeed(data);
        }
      } catch (error) {
        console.log('Error fetching feed:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeed();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Home Page</Text>
      {isLoading ? (
        <ActivityIndicator style={styles.loadingIndicator} />
      ) : (
        <View style={styles.feedContainer}>
          <Text style={styles.subheading}>Latest Posts</Text>
          {feed.length > 0 ? (
            feed.map((workout) => (
              <View key={workout.id} style={styles.postContainer}>
                <Text style={styles.title}>Title: {workout.title}</Text>
                <Text style={styles.description}>Description: {workout.description}</Text>
                <TouchableHighlight
                  style={styles.detailsButton}
                  onPress={() => navigation.navigate('Workout', { workout: workout })}
                >
                  <Text style={styles.detailsButtonText}>Go to details</Text>
                </TouchableHighlight>
              </View>
            ))
          ) : (
            <Text>No posts available</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingIndicator: {
    marginTop: 16,
  },
  feedContainer: {
    flex: 1,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  detailsButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
  },
  detailsButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
