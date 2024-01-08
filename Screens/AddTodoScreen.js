import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTodos } from '../Context/useTodos';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const ToggleSwitch = ({ isOn, onToggle }) => {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[styles.switch, isOn ? styles.switchOn : styles.switchOff]}
    >
      <View style={[styles.toggle, isOn ? styles.toggleOn : styles.toggleOff]} />
    </TouchableOpacity>
  );
};

const AddTodoScreen = () => {
  const navigation = useNavigation();
  const { setTodos } = useTodos();
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [endDate, setEndDate] = useState('');
  const [todoTime, setTodoTime] = useState('');
  const [recurrence, setRecurrence] = useState('');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskType, setTaskType] = useState('');

  const handleSubmit = () => {
    // Create a new todo with a unique ID
    const newTodo = {
      id: Date.now(), // Using current timestamp as a simple unique ID
      name: taskName,
      type: taskType,
      date: endDate,
      time: todoTime,
      recurrence: isRecurrent ? recurrence : undefined,
      recurrenceEndDate: isRecurrent ? recurrenceEndDate : undefined,
    };

    setTodos(prevTodos => [...prevTodos, newTodo]);
    navigation.navigate('Todos'); // Adjust based on your navigation setup
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Adauga un task nou</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nume task</Text>
        <TextInput style={styles.input} placeholder='nume task' value={taskName} onChangeText={setTaskName} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tipul taskului</Text>
        <Picker
          selectedValue={taskType}
          onValueChange={(itemValue) => setTaskType(itemValue)}>
          <Picker.Item label="Selecteaza tipul" value="" />
          <Picker.Item label="Urmeaza" value="Urmeaza" />
          <Picker.Item label="Overdue" value="Overdue" />
        </Picker>
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Task recurent</Text>
        <ToggleSwitch
          isOn={isRecurrent}
          onToggle={() => setIsRecurrent(!isRecurrent)}
        />
      </View>
      {isRecurrent && (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Frecventa recurentei</Text>
            <Picker
              selectedValue={recurrence}
              onValueChange={(itemValue) => setRecurrence(itemValue)}>
              <Picker.Item label="Selecteaza frecventa" value="" />
              <Picker.Item label="Zilnic" value="daily" />
              <Picker.Item label="Saptamanal" value="weekly" />
              <Picker.Item label="Lunar" value="monthly" />
            </Picker>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data de sfarsit a recurentei</Text>
            <TextInput style={styles.input} placeholder='YYYY-MM-DD' value={recurrenceEndDate} onChangeText={setRecurrenceEndDate} />
          </View>
        </>
      )}
       <View style={styles.inputContainer}>
            <Text style={styles.label}>Data de sfarsit a taskului</Text>
            <TextInput style={styles.input} placeholder='YYYY-MM-DD' value={endDate} onChangeText={setEndDate} />
          </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ora finalizarii</Text>
        <TextInput style={styles.input} placeholder='HH:MM' value={todoTime} onChangeText={setTodoTime} />
      </View>
      <Button title="Add task" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    height: 40,
  },
  switch: {
    width: 50,
    height: 25,
    borderRadius: 25,
    justifyContent: 'center',
    padding: 3,
  },
  switchOn: {
    backgroundColor: 'green',
  },
  switchOff: {
    backgroundColor: 'grey',
  },
  toggle: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  toggleOn: {
    alignSelf: 'flex-end',
    backgroundColor: 'white',
  },
  toggleOff: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
  },
});

export default AddTodoScreen;
