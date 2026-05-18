import { useState, useEffect } from 'react';
import { fetchAllTodos } from '../adapters/todo-adapters';
import AddTodoForm from './AddTodoForm';
import TodoList from './TodoList';

/*
What TodoPage does:
- Owns `todos`, `isLoading`, `error` state
- Defines loadTodos for refetching from the server
- Passes down the states as props in other components that are mutating the application with an action

TRANSLATED DOMAIN:
- We have to change first the names:
Component:
  ~ `TodoPage` into `WorkoutPage`
States:
  ~ `todos` into `workouts` (handles our workouts now)
  ~ `isLoading` and `error` stays the same (not specific)

function: 
  ~ `loadTodos` which allows for refetching from the server for todos,
  now `loadWorkouts` which will do the same but for workouts
  ~ `fetchAllTodos` referenced as `fetchAllWorkouts` based on previous modifications
  ~ callback `useEFfect` function ran changed to `loadTodos()`, allows us to run loadTodos since loadTodos returns a promise
    - useEffect can't handle async callbacks directly
    - Needs to be accessible outside of the useEffect to be passed down as props in other components
  ~ The return section also replaced to have `AddWorkoutForm`, `loadWorkouts={loadWorkouts}`, <p>Loading workouts<p>
  <WorkoutList workouts={workouts} loadWorkouts={loadWorkouts} />
*/

function TodoPage({ currentUser, handleLogout }) {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // This helper fetches todos on page load with useEffect
  // It is also used within the AddTodoForm and TodoList
  // to re-fetch the todos when a mutation action is performed
  // such as creating, deleting, or updating a todo.
  const loadTodos = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchAllTodos();
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setTodos(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <section>
      <div id="user-controls">
        <span>Welcome, <strong>{currentUser.username}</strong>!</span>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      <AddTodoForm loadTodos={loadTodos} />
      {isLoading && <p>Loading todos...</p>}
      {error && <p className="error">Something went wrong: {error}</p>}
      <TodoList todos={todos} loadTodos={loadTodos} />
    </section>
  );
}

export default TodoPage;
