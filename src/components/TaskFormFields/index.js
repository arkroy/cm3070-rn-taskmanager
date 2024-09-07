import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

const TaskFormFields = ({
  title,
  setTitle,
  date,
  setDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  isPersonal,
  setIsPersonal,
  notes,
  setNotes,
  showDatePicker,
  setShowDatePicker,
  showStartTimePicker,
  setShowStartTimePicker,
  showEndTimePicker,
  setShowEndTimePicker,
}) => (
  <>
    <Text style={styles.label}>Title (Mandatory)</Text>
    <TextInput
      style={styles.input}
      value={title}
      onChangeText={setTitle}
      placeholder="Enter task title"
    />

    <Text style={styles.label}>Date (Mandatory)</Text>
    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
      <Text>{moment(date).format('YYYY-MM-DD')}</Text>
    </TouchableOpacity>
    {showDatePicker && (
      <DateTimePicker
        value={date}
        mode="date"
        minimumDate={new Date()}
        display="default"
        onChange={(event, selectedDate) => {
          setShowDatePicker(false);
          if (selectedDate) setDate(selectedDate);
        }}
      />
    )}

    <Text style={styles.label}>Start Time (Mandatory)</Text>
    <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.datePicker}>
      <Text>{startTime.toLocaleTimeString()}</Text>
    </TouchableOpacity>
    {showStartTimePicker && (
      <DateTimePicker
        value={startTime}
        mode="time"
        display="default"
        onChange={(event, selectedTime) => {
          setShowStartTimePicker(false);
          if (selectedTime) setStartTime(selectedTime);
        }}
      />
    )}

    <Text style={styles.label}>End Time (Mandatory)</Text>
    <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.datePicker}>
      <Text>{endTime.toLocaleTimeString()}</Text>
    </TouchableOpacity>
    {showEndTimePicker && (
      <DateTimePicker
        value={endTime}
        mode="time"
        display="default"
        onChange={(event, selectedTime) => {
          setShowEndTimePicker(false);
          if (selectedTime) setEndTime(selectedTime);
        }}
      />
    )}

    <Text style={styles.label}>Personal/Professional</Text>
    <View style={styles.switchContainer}>
      <Text>{isPersonal ? 'Personal' : 'Professional'}</Text>
      <Switch
        value={isPersonal}
        onValueChange={(value) => setIsPersonal(value)}
      />
    </View>

    <Text style={styles.label}>Notes (Optional)</Text>
    <TextInput
      style={[styles.input, styles.textArea]}
      value={notes}
      onChangeText={setNotes}
      placeholder="Enter additional notes"
      multiline
      numberOfLines={4}
    />
  </>
);

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  datePicker: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  textArea: {
    height: 100,
  },
});

export default TaskFormFields;