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

// Returns all workouts for a specific user, ordered by creation time
module.exports.listByUser = async (user_id) => {
  const query =
    "SELECT * FROM workouts WHERE user_id = $1 ORDER BY workout_id ASC";
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single workout row (used for ownership checks before update/delete)
module.exports.find = async (workout_id) => {
  const query = "SELECT * FROM workouts WHERE workout_id = $1";
  const { rows } = await pool.query(query, [workout_id]);
  return rows[0] || null;
};

// Creates a new workout. Returns the full workout row.
module.exports.create = async (
  title,
  description,
  date,
  type,
  duration,
  notes,
  user_id,
) => {
  const query = `INSERT INTO workouts (title, description, date, type, duration, notes, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`;
  const { rows } = await pool.query(query, [
    title,
    description,
    date,
    type,
    duration,
    notes,
    user_id,
  ]);
  return rows[0];
};

// Updates a workout. Returns the updated row.
module.exports.update = async (
  workout_id,
  { title, description, date, type, duration, notes },
) => {
  const query = `
    UPDATE workouts
    SET
      title       = COALESCE($1, title),
      description = COALESCE($2, description),
      date        = COALESCE($3, date),
      type        = COALESCE($4, type),
      duration    = COALESCE($5, duration),
      notes       = COALESCE($6, notes)
    WHERE workout_id = $7
    RETURNING *
  `;
  const { rows } = await pool.query(query, [
    title,
    description,
    date,
    type,
    duration,
    notes,
    workout_id,
  ]);
  return rows[0];
};

// Deletes a workout by id
module.exports.destroy = async (workout_id) => {
  const query = "DELETE FROM workouts WHERE workout_id = $1 RETURNING *";
  const { rows } = await pool.query(query, [workout_id]);
  return rows[0] || null;
};
