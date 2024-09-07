import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useQuery } from '@apollo/client';
import { LIST_TASKS } from '../../utils/schemas';
import moment from 'moment';
import { currentTaskVar } from '../../utils/apolloState';
import TaskList from '../../components/TaskList';
import TimerCard from '../../components/TimeCard';
import DateFilter from '../../components/DateFilter';
import FloatingNavBar from '../../components/FloatingNavbar';
import TaskFilters from '../../components/TaskFilters'; // Sub-category filters

function DashboardScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTask, setCurrentTask] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [startTimerTime, setStartTimerTime] = useState(null);

  const [taskTypeFilter, setTaskTypeFilter] = useState(null); // Type filter (Personal/Professional)
  const [taskStatusFilter, setTaskStatusFilter] = useState(null); // Status filter (Complete/Pending)

  const filter = {
    date: { eq: moment(selectedDate).format('YYYY-MM-DD') },
    ...(taskTypeFilter && { type: { eq: taskTypeFilter } }),
    ...(taskStatusFilter && { status: { eq: taskStatusFilter } }),
  };

  const { data, loading, error } = useQuery(LIST_TASKS, { variables: { filter } });

  useEffect(() => {
    if (data?.listTasks?.items) {
      const currentTime = new Date();
      const upcomingTask = data.listTasks.items
        .filter(task => new Date(task.startTime) > currentTime)
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0];
      setCurrentTask(upcomingTask || null);
    }
  }, [data]);

  const handleTimerPress = (status, actualDuration, plannedDuration) => {
    setIsTimerActive(status);
    setStartTimerTime(status ? new Date() : null);
  };

  const handleTaskPress = (task) => {
    currentTaskVar(task); // Store task in reactive variable
    navigation.navigate('TaskDetails', { taskId: task.id });
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading tasks: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <TimerCard
        currentTask={currentTask}
        isTimerActive={isTimerActive}
        startTimerTime={startTimerTime}
        handleTimerPress={handleTimerPress}
      />

      <DateFilter selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

      {/* Sub-category Filters */}
      <TaskFilters
        taskTypeFilter={taskTypeFilter}
        setTaskTypeFilter={setTaskTypeFilter}
        taskStatusFilter={taskStatusFilter}
        setTaskStatusFilter={setTaskStatusFilter}
        tasks={data?.listTasks?.items || []}
      />

      <FlatList
        data={data?.listTasks?.items || []}
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