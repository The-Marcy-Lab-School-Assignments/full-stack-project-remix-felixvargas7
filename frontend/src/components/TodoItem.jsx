import { updateTodo, deleteTodo } from '../adapters/todo-adapters';

/*
This file handles the application's updating and deleting actions,
It also has loadTodos to re-render the page after each 
It references this via a prop, from TodoPage

TRANSLATED DOMAIN:
We change the function names:
`TodoItem`, which is responsible for the deleting of a todo,
becomes `Workout item`, responsible for deleting a workout via:
`handleDelete` remains same name, changes deleteTodo to deleteWorkout(workout.workout_id)
and then call at the end would be our loadWorkouts()
We focus on delete right now as its the MVP feature, whereas PATCH is bonus feature

Our return would not have a checked, since we don't use a boolean, but rather the parameters we changed earlier:
      ~ workout_id
      ~ title
      ~ description
      ~ date
      ~ type
      ~ duration 
      ~ notes
*/

function TodoItem({ todo, loadTodos }) {
  const handleChange = async (e) => {
    const { error } = await updateTodo(todo.todo_id, { is_complete: e.target.checked });
    if (error) return console.error(error);
    loadTodos();
  };

  const handleDelete = async () => {
    const { error } = await deleteTodo(todo.todo_id);
    if (error) return console.error(error);
    loadTodos();
  };

  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.is_complete}
        onChange={handleChange}
      />
      <span className={todo.is_complete ? 'completed' : ''}>{todo.title}</span>
      <button className="delete-btn" onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default TodoItem;
