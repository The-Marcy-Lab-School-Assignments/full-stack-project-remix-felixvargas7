import WorkoutItem from './WorkoutItem';

function WorkoutList({ workouts, loadWorkouts }) {
  return (
    <ul id="workout-list">
      {workouts.map((workout) => (
        <WorkoutItem
          key={workout.workout_id}
          workout={workout}
          loadWorkouts={loadWorkouts}
        />
      ))}
    </ul>
  );
}

export default WorkoutList;
