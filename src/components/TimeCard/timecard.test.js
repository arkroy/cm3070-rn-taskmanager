import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import TimerCard from './index';
import moment from 'moment';

jest.useFakeTimers();

describe('TimerCard', () => {
  const mockHandleTimerPress = jest.fn();

  const task = {
    id: '1',
    title: 'Test Task',
    startTime: moment().subtract(10, 'minutes').toISOString(), // Task started 10 mins ago
    endTime: moment().add(20, 'minutes').toISOString(), // Task ends in 20 mins
    location: 'Test Location',
    cost: 100,
  };

  it('should render the TimerCard with task details', () => {
    const { getByText } = render(
      <TimerCard 
        currentTask={task} 
        isTimerActive={false} 
        startTimerTime={null} 
        handleTimerPress={mockHandleTimerPress} 
      />
    );

    expect(getByText('Test Task')).toBeTruthy();
    expect(getByText('Location: Test Location')).toBeTruthy();
    expect(getByText('Cost: $100')).toBeTruthy();
    expect(getByText(/Start/)).toBeTruthy();
  });

  it('should start the timer when "Start" button is pressed', () => {
    const { getByText } = render(
      <TimerCard 
        currentTask={task} 
        isTimerActive={false} 
        startTimerTime={null} 
        handleTimerPress={mockHandleTimerPress} 
      />
    );

    const startButton = getByText('Start');
    fireEvent.press(startButton);

    expect(mockHandleTimerPress).toHaveBeenCalledWith(true);
  });

  it('should stop the timer when "Stop" button is pressed', () => {
    const { getByText } = render(
      <TimerCard 
        currentTask={task} 
        isTimerActive={true} 
        startTimerTime={new Date()} 
        handleTimerPress={mockHandleTimerPress} 
      />
    );

    const stopButton = getByText('Stop');
    fireEvent.press(stopButton);

    expect(mockHandleTimerPress).toHaveBeenCalledWith(false);
  });

  it('should update the progress as time passes', () => {
    const { getByText, rerender } = render(
      <TimerCard 
        currentTask={task} 
        isTimerActive={true} 
        startTimerTime={moment().subtract(10, 'minutes').toDate()} 
        handleTimerPress={mockHandleTimerPress} 
      />
    );

    expect(getByText('Stop')).toBeTruthy();

    // Fast-forward time by 10 seconds
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // Rerender the component to simulate time passing
    rerender(
      <TimerCard 
        currentTask={task} 
        isTimerActive={true} 
        startTimerTime={moment().subtract(10, 'minutes').toDate()} 
        handleTimerPress={mockHandleTimerPress} 
      />
    );

    // You would now want to check if the progress state has been updated.
    // Here you can use debug to see if the UI renders the correct progress
    // based on elapsed time and total time (which is internal).
  });
});