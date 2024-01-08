import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTodos } from '../Context/useTodos';
import { useNavigation, useRoute } from '@react-navigation/native';
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

const EditTodoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { todos, setTodos } = useTodos();
  const [todo, setTodo] = useState(null);

  useEffect(() => {
    const todoToEdit = todos.find(t => t.id === route.params?.todoId);
    setTodo(todoToEdit || {});
  }, [todos, route.params?.todoId]);

  const handleChange = (key, value) => {
    setTodo(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = () => {
    const updatedTodos = todos.map(t => t.id === todo.id ? todo : t);
    setTodos(updatedTodos);
    navigation.goBack();
  };

  if (!todo) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Task</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nume task</Text>
        <TextInput
          style={styles.input}
          placeholder='nume task'
          value={todo.name}
          onChangeText={(text) => handleChange('name', text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tipul taskului</Text>
        <Picker
          selectedValue={todo.type}
          onValueChange={(itemValue) => handleChange('type', itemValue)}>
          <Picker.Item label="Selecteaza tipul" value="" />
          <Picker.Item label="Urmeaza" value="Urmeaza" />
          <Picker.Item label="Overdue" value="Overdue" />
        </Picker>
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Task recurent</Text>
        <ToggleSwitch
          isOn={todo.isRecurrent}
          onToggle={() => handleChange('isRecurrent', !todo.isRecurrent)}
        />
      </View>
      {todo.isRecurrent && (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Frecventa recurentei</Text>
            <Picker
              selectedValue={todo.recurrence}
              onValueChange={(itemValue) => handleChange('recurrence', itemValue)}>
              <Picker.Item label="Selecteaza frecventa" value="" />
              <Picker.Item label="Zilnic" value="daily" />
              <Picker.Item label="Saptamanal" value="weekly" />
              <Picker.Item label="Lunar" value="monthly" />
            </Picker>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data de sfarsit a recurentei</Text>
            <TextInput
              style={styles.input}
              placeholder='YYYY-MM-DD'
              value={todo.recurrenceEndDate}
              onChangeText={(text) => handleChange('recurrenceEndDate', text)}
            />
          </View>
        </>
      )}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ora finalizarii</Text>
        <TextInput
          style={styles.input}
          placeholder='HH:MM'
          value={todo.time}
          onChangeText={(text) => handleChange('time', text)}
        />
      </View>
      <Button title="Save Changes" onPress={handleSubmit} />
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

export default EditTodoScreen;
