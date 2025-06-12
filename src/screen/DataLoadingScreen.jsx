import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loadData } from '../../iStClasses/LoadData';

const tasks = [
  { key: 'fetchEmployees', label: 'Loading employees...' },
  { key: 'fetchProjects', label: 'Loading projects...' },
  { key: 'fetchManpowerSuppliers', label: 'Loading manpower suppliers...' },
];


const DataLoadingScreen = ({ navigation }) => {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const runTasks = async () => {
      for (let task of tasks) {
        await loadData(task.key);
        setCompletedTasks((prev) => [...prev, task.key]);
      }

      // Navigate to the main app after tasks
      navigation.replace('BottomNavigation');
    };

    runTasks();
  }, []);

  const isTaskDone = (taskKey) => completedTasks.includes(taskKey);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loading Necessary Data...</Text>
      {tasks.map((task) => (
        <View key={task.key} style={styles.taskRow}>
          {isTaskDone(task.key) ? (
            <Ionicons name="checkmark-circle" size={24} color="green" />
          ) : (
            <ActivityIndicator size="small" color="gray" />
          )}
          <Text style={styles.taskText}>{task.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default DataLoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  taskText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
