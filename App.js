import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { TodosProvider } from './Context/useTodos';

export default function App() {
  return (
    <NavigationContainer>
        <TodosProvider>
          <StackNavigator />
        </TodosProvider>
    </NavigationContainer>
  );
}

