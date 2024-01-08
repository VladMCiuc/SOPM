import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import arrow from '../assets/arrow.png'; // Ensure this is a local asset
import { useNavigation } from '@react-navigation/native';
import { useTodos } from '../Context/useTodos';

const getWeekNumber = (date) => {
    const currentDate = new Date(date.getTime());
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor((currentDate - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
    return Math.ceil(days / 7);
}

const getMaxWeeksInYear = (year) => {
    const dec31 = new Date(year, 11, 31);
    return getWeekNumber(dec31);
}
const TodosScreen = () => {
    const navigation = useNavigation();
    const dayNames = useMemo(() => ["Luni", "Marti", "Miercuri", "Joi", "Vineri", "Sambata", "Duminica"], []);
    const todayIndex = new Date().getDay();
    const previousDayIndex = todayIndex === 0 ? dayNames.length - 1 : todayIndex - 1;

    // Initialize selectedDay to a day before the current day
    const [selectedDay, setSelectedDay] = useState(dayNames[previousDayIndex]);
    const [currentWeek, setCurrentWeek] = useState(getWeekNumber(new Date()));
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const { todos, setTodos } = useTodos();

    const isRecurrentTaskDue = (todo, selectedDate) => {
        const todoCreationDate = new Date(todo.date);
        if (todo.recurrence === 'daily') {
            return true;
        } else if (todo.recurrence === 'weekly') {
            return todoCreationDate.getDay() === selectedDate.getDay();
        } else if (todo.recurrence === 'monthly') {
            return todoCreationDate.getDate() === selectedDate.getDate();
        }
        return false;
    };

    const filteredTodos = todos.filter(todo => {
        const selectedDate = new Date(currentYear, 0, (currentWeek - 1) * 7 + 1);
        selectedDate.setDate(selectedDate.getDate() + dayNames.indexOf(selectedDay));

        const taskTime = new Date(todo.date);
        const taskDateTime = new Date(currentYear, 0, (currentWeek - 1) * 7 + 1);
        taskDateTime.setDate(taskTime.getDate());
        taskDateTime.setHours(taskTime.getHours());
        taskDateTime.setMinutes(taskTime.getMinutes());

        if (todo.recurrence) {
            const todoStartDate = new Date(todo.date);
            todoStartDate.setDate(todoStartDate.getDate() - 1); // Adjust to one day before

            const recurrenceEndDate = todo.recurrenceEndDate ? new Date(todo.recurrenceEndDate) : new Date('9999-12-31');
            const isWithinRecurrenceRange = selectedDate >= todoStartDate && selectedDate <= recurrenceEndDate;

            return isWithinRecurrenceRange && isRecurrentTaskDue(todo, selectedDate);

        } else {
            const todoDate = new Date(todo.date);
            todoDate.setDate(todoDate.getDate()); // Adjust to one day before

            const isTaskPassed = taskDateTime < new Date();

            return todoDate.toDateString() === selectedDate.toDateString();
        }
    });

    const selectDay = (day) => {
        setSelectedDay(day);
    };
    

    const incrementWeek = () => {
        const maxWeeks = getMaxWeeksInYear(currentYear);
        if (currentWeek === maxWeeks) {
            setCurrentWeek(1);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentWeek(currentWeek + 1);
        }
    };

    const decrementWeek = () => {
        if (currentWeek === 1) {
            setCurrentYear(currentYear - 1);
            setCurrentWeek(getMaxWeeksInYear(currentYear - 1));
        } else {
            setCurrentWeek(currentWeek - 1);
        }
    };

    const deleteTodo = (idToDelete) => {
        setTodos(todos.filter(todo => todo.id !== idToDelete));
    };

    useEffect(() => {
        const today = new Date();
        // setSelectedDay(dayNames[today.getDay()]);
        setCurrentWeek(getWeekNumber(today));
        setCurrentYear(today.getFullYear());
    }, [dayNames]);
    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={decrementWeek} style={styles.arrowButton}>
                        <Image source={arrow} style={styles.arrowImage} />
                    </TouchableOpacity>
                    <Text>
                     {new Date(currentYear, 0, (currentWeek - 1) * 7 + dayNames.indexOf(selectedDay) + 1)
                        .toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </Text>
                    <TouchableOpacity onPress={incrementWeek} style={styles.arrowButton}>
                        <Image source={arrow} style={[styles.arrowImage, styles.rotateImage]} />
                    </TouchableOpacity>
                    
                </View>

                <View style={styles.dayButtons}>
                    {dayNames.map((day) => (
                        <TouchableOpacity key={day} onPress={() => selectDay(day)} style={[styles.dayButton,selectedDay === day && styles.selectedDayButton,]}>
                            <Text>{day}</Text>
                        </TouchableOpacity>
                        
                    ))}
                </View>

                <View style={styles.todosContainer}>
                    {filteredTodos.length > 0 ? filteredTodos.map((todo) => (
                        <View key={todo.id} style={styles.todo}>
                            <Text>{todo.name} - ({todo.type})</Text>
                            <Text>Pana la:{todo.time}</Text>
                            <View style={styles.todoButtons}>
                                <TouchableOpacity onPress={() => navigation.navigate('EditTodo', { todoId: todo.id })
                                } style={styles.editButton}>
                                    <Text>Modifica</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => deleteTodo(todo.id)} style={styles.deleteButton}>
                                    <Text>Sterge</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )) : <Text>No tasks for this day.</Text>}
                </View>

                <View style={styles.addButtonContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('AddTodo')} style={styles.addButton}>
                        <Text>Adauga Task</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView >

    );
}

export default TodosScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#d0f0c0',
        flex: 1,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: '#feb2b2', // Tailwind bg-red-200
    },
    arrowButton: {
        padding: 8,
    },
    arrowImage: {
        height: 32,
        width: 42,
    },
    rotateImage: {
        transform: [{ rotate: '180deg' }],
    },
    dayButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    dayButton: {
        borderWidth: 2,
        borderColor: 'black',
        padding: 4,
        backgroundColor: '#feb2b2', // Tailwind bg-red-200
    },
    selectedDayButton: {
        backgroundColor: '#f3342f', 
      },
    todosContainer: {
        flex: 1,
        paddingVertical: 8,
    },
    todo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: '#feb2b2', // Tailwind bg-red-200
    },
    todoButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#48bb78', // Tailwind bg-green-500
        padding: 8,
        borderRadius: 4,
        marginRight: 4,
    },
    deleteButton: {
        backgroundColor: '#f56565', // Tailwind bg-red-500
        padding: 8,
        borderRadius: 4,
    },
    addButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    addButton: {
        backgroundColor: '#4299e1', // Tailwind bg-blue-400
        padding: 12,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'black',
    },
    text: {
        color: 'black', // Default text color
    },
});
