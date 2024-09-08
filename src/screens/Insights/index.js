import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { useQuery } from '@apollo/client';
import { SegmentedButtons } from 'react-native-paper';
import { LIST_TASKS } from '../../utils/schemas';
import FloatingNavBar from '../../components/FloatingNavbar';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#e26a00',
  backgroundGradientFrom: '#fb8c00',
  backgroundGradientTo: '#ffa726',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

const InsightsPage = () => {
  const [timePeriod, setTimePeriod] = useState('week');
  const [insightsData, setInsightsData] = useState(null);

  // Calculate startDate and endDate based on selected time period
  const startDate = timePeriod === 'week'
    ? moment().subtract(1, 'weeks').format('YYYY-MM-DD')
    : moment().subtract(1, 'months').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');

  // Query to fetch task data for the selected period
  const { data, loading, error } = useQuery(LIST_TASKS, {
    variables: {
      filter: {
        date: {
          between: [startDate, endDate],
        },
      },
    },
  });

  useEffect(() => {
    if (data && data.listTasks && data.listTasks.items) {
      console.log('Task data:', data.listTasks.items);
      calculateInsights(data.listTasks.items);
    }
  }, [data]);

  // Calculate insights based on task data
  const calculateInsights = (tasks) => {
    let completedTasks = 0;
    let incompleteTasks = 0;
    let totalPlannedTime = 0;
    let totalActualTime = 0;
    let personalTasks = 0;
    let professionalTasks = 0;
    let personalTime = 0;
    let professionalTime = 0;

    tasks.forEach((task) => {
      // Handle null status and treat them as 'INCOMPLETE'
      const taskStatus = task.status || 'INCOMPLETE';

      if (taskStatus === 'COMPLETE') {
        completedTasks += 1;
        totalPlannedTime += moment(task.endTime).diff(task.startTime, 'seconds');
        totalActualTime += task.actualDuration || 0;
      } else {
        incompleteTasks += 1;
      }

      if (task.type === 'PERSONAL') {
        personalTasks += 1;
        personalTime += moment(task.endTime).diff(task.startTime, 'seconds');
      } else if (task.type === 'PROFESSIONAL') {
        professionalTasks += 1;
        professionalTime += moment(task.endTime).diff(task.startTime, 'seconds');
      }
    });

    const productivity = completedTasks / (completedTasks + incompleteTasks) || 0;
    const efficiency = totalPlannedTime > 0 ? (totalActualTime / totalPlannedTime) * 100 : 0;

    setInsightsData({
      labels: timePeriod === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      productivityData: [productivity * 100], // Scale productivity to percentage
      efficiencyData: [efficiency], // Efficiency in percentage
      personalTime: personalTime / 3600, // Convert to hours
      professionalTime: professionalTime / 3600, // Convert to hours
    });

    // Log insights data for debugging
    console.log('Calculated Insights:', {
      completedTasks,
      incompleteTasks,
      totalPlannedTime,
      totalActualTime,
      personalTasks,
      professionalTasks,
      productivity,
      efficiency,
      personalTime: personalTime / 3600,
      professionalTime: professionalTime / 3600,
    });
  };

  if (loading) {
    return <Text>Loading insights data...</Text>;
  }

  if (error) {
    return <Text>Error loading insights: {error.message}</Text>;
  }

  if (!insightsData) {
    return <Text>No data available for the selected period</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Time Period Segmented Control */}
      <Text style={styles.label}>Select Time Period</Text>
      <SegmentedButtons
        value={timePeriod}
        onValueChange={setTimePeriod}
        buttons={[
          { value: 'week', label: 'Past Week' },
          { value: 'month', label: 'Past Month' },
        ]}
        style={styles.segmentedControl}
      />

      {/* Productivity Graph */}
      <Text style={styles.graphTitle}>Productivity</Text>
      <BarChart
        data={{
          labels: insightsData.labels,
          datasets: [
            {
              data: insightsData.productivityData,
            },
          ],
        }}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
      />

      {/* Efficiency Graph */}
      <Text style={styles.graphTitle}>Efficiency (Actual vs Planned Time)</Text>
      <LineChart
        data={{
          labels: insightsData.labels,
          datasets: [
            {
              data: insightsData.efficiencyData,
            },
          ],
        }}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
      />

      {/* Time Spent on Personal vs Professional */}
      <Text style={styles.graphTitle}>Time Spent (Personal vs Professional)</Text>
      <BarChart
        data={{
          labels: ['Personal', 'Professional'],
          datasets: [
            {
              data: [insightsData.personalTime, insightsData.professionalTime],
            },
          ],
        }}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
      />
      <FloatingNavBar />
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  segmentedControl: {
    marginBottom: 20,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default InsightsPage;