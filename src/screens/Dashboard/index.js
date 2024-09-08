import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native'; 
import { LIST_TASKS, UPDATE_TASK, GET_USER, CREATE_USER } from '../../utils/schemas'; // Assuming you have these queries/mutations set up
import { getCurrentUser } from 'aws-amplify/auth';
import moment from 'moment';
import { currentTaskVar, userVar } from '../../utils/apolloState';
import TaskList from '../../components/TaskList';
import TimerCard from '../../components/TimeCard';
import DateFilter from '../../components/DateFilter';
import FloatingNavBar from '../../components/FloatingNavbar';

function DashboardScreen({ route, navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTask, setCurrentTask] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [startTimerTime, setStartTimerTime] = useState(null);

  const formattedSelectedDate = moment(selectedDate).format('YYYY-MM-DD');
  const formattedCurrentDate = moment(new Date()).format('YYYY-MM-DD');

  // Query to list tasks
  const { data: currentDateTasks, loading: currentDateLoading, error: currentDateError, refetch: refetchCurrentDateTasks } = useQuery(LIST_TASKS, {
    variables: {
      filter: {
        date: { eq: formattedCurrentDate },
      },
    },
  });

  const { data, loading, error, refetch } = useQuery(LIST_TASKS, {
    variables: {
      filter: {
        date: { eq: formattedSelectedDate },
      },
    },
  });

  // Mutation to update a task
  const [updateTask] = useMutation(UPDATE_TASK);

  // Effect to set the most relevant task for the TimerCard
  useEffect(() => {
    console.log('User Variable:', userVar());

    console.log('Current tasks:', data?.listTasks?.items); // Log fetched tasks

    if (currentDateTasks?.listTasks?.items) {
      const now = new Date();

      // Find the most relevant task (ongoing or latest incomplete task)
      const relevantTask = currentDateTasks.listTasks.items
        .filter(task => task.status !== 'COMPLETE')
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0];

      setCurrentTask(relevantTask || null);
    }
  }, [currentDateTasks]);

  // Start the task timer when navigating from TaskDetailsScreen
  useEffect(() => {
    if (route.params?.startTimerForTask) {
      const task = route.params.startTimerForTask;
      currentTaskVar(task);
      setCurrentTask(task);
      setIsTimerActive(true);
      setStartTimerTime(new Date());
    }
  }, [route.params]);

  const handleTimerPress = async (status) => {
    if (status) {
      setIsTimerActive(true);
      setStartTimerTime(new Date());
    } else {
      setIsTimerActive(false);

      const endTime = new Date();
      const actualDuration = moment(endTime).diff(startTimerTime, 'seconds');
      console.log(`Task completed in ${actualDuration} seconds.`);

      const plannedDuration = moment(currentTask.endTime).diff(currentTask.startTime, 'seconds');
      console.log(`Planned duration for task: ${plannedDuration} seconds.`);

      try {
        const { data: updatedData } = await updateTask({
          variables: {
            input: {
              id: currentTask.id,
              status: 'COMPLETE',
              actualDuration: actualDuration,
              plannedDuration: plannedDuration,
            },
          },
        });
        console.log('Task updated successfully:', updatedData);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  const handleTaskPress = (task) => {
    currentTaskVar(task);
    navigation.navigate('TaskDetails', { task });
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchCurrentDateTasks();
    }, [refetch, refetchCurrentDateTasks])
  );

  const filteredTasks = data?.listTasks?.items || [];

  if (loading || currentDateLoading) return <Text>Loading...</Text>;
  if (error || currentDateError) return <Text>Error loading tasks: {error?.message || currentDateError?.message}</Text>;

  return (
    <View style={styles.container}>
      <TimerCard
        currentTask={currentTask}
        isTimerActive={isTimerActive}
        startTimerTime={startTimerTime}
        handleTimerPress={handleTimerPress}
      />

      <DateFilter selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => (
          <TaskList task={item} onPress={() => handleTaskPress(item)} />
        )}
        keyExtractor={(task) => task.id}
      />

      <FloatingNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
});

export default DashboardScreen;