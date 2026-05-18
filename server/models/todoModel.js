const pool = require("../db/pool");

/*
TRANSLATED DOMAIN: 
`getAllTodos` would normally return all the todos for a specific user
for our project, `getAllWorkouts` would return all the workouts for a specific user

`getSingleTodos` would normally return a single todo for a specific user
for our project, `getSingleWorkouts` would return a single workout for a specific user

`createTodo` would normally create a new todo, returning the full todo row
for our project, `createWorkout` would create a new workout, returning the full workout row

`updateTodo` would normally update an existing todo (checking if complete) for a specific user
for our project, `updateWorkout` would update an existing workout (the title, date, duration, type, description, or notes of an existing workout)

`deleteTodo` would normally delete an existing todo for a specific user
for our project `deleteWorkout` would delete an existing workout for a specific user
*/

// Returns all todos for a specific user, ordered by creation time
module.exports.listByUser = async (user_id) => {
  const query = "SELECT * FROM todos WHERE user_id = $1 ORDER BY todo_id ASC";
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single todo row (used for ownership checks before update/delete)
module.exports.find = async (todo_id) => {
  const query = "SELECT * FROM todos WHERE todo_id = $1";
  const { rows } = await pool.query(query, [todo_id]);
  return rows[0] || null;
};

// Creates a new todo. Returns the full todo row.
module.exports.create = async (title, user_id) => {
  const query =
    "INSERT INTO todos (title, user_id) VALUES ($1, $2) RETURNING *";
  const { rows } = await pool.query(query, [title, user_id]);
  return rows[0];
};

// Updates is_complete for a todo. Returns the updated row.
module.exports.update = async (todo_id, { is_complete }) => {
  const query =
    "UPDATE todos SET is_complete = $1 WHERE todo_id = $2 RETURNING *";
  const { rows } = await pool.query(query, [is_complete, todo_id]);
  return rows[0];
};

// Deletes a todo by id
module.exports.destroy = async (todo_id) => {
  const query = "DELETE FROM todos WHERE todo_id = $1 RETURNING *";
  const { rows } = await pool.query(query, [todo_id]);
  return rows[0] || null;
};
