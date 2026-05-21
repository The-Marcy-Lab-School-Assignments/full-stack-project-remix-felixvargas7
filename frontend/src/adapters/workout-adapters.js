/*
What this file does:
Responsible for fetching data, however more specifically:
- The adapter handles the fetch, error checking, the JSON parsing
- It also hands back a clean { data, error: null } object to the component. 

*** The component NEVER touches raw fetch or response.ok, it just receives usable data. ***

TRANSLATED DOMAIN:
In our workout-adapters.js, we have to change:
- The endpoints of each request
- The parameters specific to our workout table:
      ~ workout_id
      ~ title
      ~ description
      ~ date
      ~ type
      ~ duration 
      ~ notes
      ~ user_id
- The name of each function change to suit my application:

`fetchAllTodos` originally fetches all todos, `fetchAllWorkouts` 
will now fetch all workouts 
  = Parameters needed: None
`createTodos` originally creates a new todo, `createWorkout` 
will now create a new workout
  = Parameters needed: title, description, date, type, duration, notes, (user_id comes from a session cookie to prevent spoofing and allowing for persistance)
`updateTodo` originally updates a todo, `updateWorkout` 
will now update a workout
  = Parameters needed: workout_id, updates
`deleteTodo` originally deletes a todo, `deleteWorkout` 
will now delete a workout
  = Parameters needed: workout_id
*/
const handleFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok)
      throw new Error(
        `Fetch failed. ${response.status} ${response.statusText}`,
      );
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const fetchAllWorkouts = async () => {
  return handleFetch("/api/workouts");
};

export const createWorkout = async ({
  title,
  description,
  date,
  type,
  duration,
  notes,
}) => {
  return handleFetch("/api/workouts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, date, type, duration, notes }),
  });
};

export const updateWorkout = async (workout_id, updates) => {
  return handleFetch(`/api/workouts/${workout_id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
};

export const deleteWorkout = async (workout_id) => {
  return handleFetch(`/api/workouts/${workout_id}`, { method: "DELETE" });
};
