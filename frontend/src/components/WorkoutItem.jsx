import { deleteWorkout } from '../adapters/workout-adapters';

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
function WorkoutItem({ workout, loadWorkouts }) {
  const handleDelete = async () => {
    const { error } = await deleteWorkout(workout.workout_id);
    if (error) return console.error(error);
    loadWorkouts();
  };

  return (
    <li className="workout-item">
      <div>
        <strong>{workout.title}</strong>
        {workout.type && <span> — {workout.type}</span>}
        {workout.date && <span> | {workout.date}</span>}
        {workout.duration && <span> | {workout.duration} mins</span>}
      </div>
      {workout.description && <p>{workout.description}</p>}
      {workout.notes && <p><em>{workout.notes}</em></p>}
      <button className="delete-btn" onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default WorkoutItem;