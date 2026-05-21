const bcrypt = require("bcrypt");
const pool = require("./pool");

const SALT_ROUNDS = 8;

/* 
  TRANSLATION DOMAIN (server/db/schema.sql):
  - Resource table will be called:
    -> Users
      * Columns *
        ~ user_id
        ~ username
        ~ password
    -> Workouts
      * Columns *
        ~ workout_id
        ~ title
        ~ description
        ~ date
        ~ type
        ~ duration 
        ~ notes
        ~ user_id

  Users will be able to:
  - register for an account
  - login to the application


  Workouts will have:
  - information of each workout completed such as:
    - title, date, duration, description, notes from user


  TRANSLATING DOMAIN (server/db/seed.js):
  - Sample data would include 2 people:
  Denji and Reze
  - Inside each workout for each will be listed
    - The title of the workout, it's description, date, type, notes from the user


  */
const seed = async () => {
  // Drop tables in reverse dependency order (todos references users via FK)
  await pool.query("DROP TABLE IF EXISTS workouts CASCADE");
  await pool.query("DROP TABLE IF EXISTS users CASCADE");

  await pool.query(`
      CREATE TABLE users (
        user_id       SERIAL PRIMARY KEY,
        username      TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      )
    `);

  await pool.query(`
      CREATE TABLE workouts (
        workout_id     SERIAL PRIMARY KEY,
        title       TEXT NOT NULL,
        description TEXT,
        date        TEXT,
        type        TEXT,
        duration    INT,
        notes       TEXT,
        user_id     INT REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);

  // Hash passwords in parallel — bcrypt is slow by design (CPU-bound hashing)
  const [denjiHash, rezeHash] = await Promise.all([
    bcrypt.hash("password123", SALT_ROUNDS),
    bcrypt.hash("password123", SALT_ROUNDS),
  ]);

  // RETURNING captures inserted user_ids so we don't hardcode them
  const { rows: users } = await pool.query(
    `
      INSERT INTO users (username, password_hash) VALUES
        ('denji', $1),
        ('reze',   $2)
      RETURNING user_id, username
    `,
    [denjiHash, rezeHash],
  );

  const [denji, reze] = users;

  await pool.query(
    `
      INSERT INTO workouts (title, description, date, type, duration, notes, user_id) VALUES
        ('Morning Run',        'Easy 5k around the park',         '2026-05-01', 'Cardio',    30,  'Felt good, steady pace',        $1),
        ('Upper Body Lift',    'Bench, OHP, rows',                '2026-05-03', 'Strength',  45,  'Hit a new PR on bench',         $1),
        ('Leg Day',            'Squats, lunges, leg press',       '2026-05-05', 'Strength',  60,  'Quads were on fire',            $1),
        ('HIIT Session',       '20 min tabata intervals',         '2026-05-02', 'Cardio',    20,  'Brutal but effective',          $2),
        ('Back and Biceps',    'Deadlifts, pull-ups, curls',      '2026-05-04', 'Strength',  50,  'Grip gave out on deadlifts',   $2),
        ('Evening Yoga',       'Full body stretch and recovery',  '2026-05-06', 'Flexibility', 40, 'Much needed after leg day',   $2)
    `,
    [denji.user_id, reze.user_id],
  );

  return users;
};

seed()
  .then((users) => {
    console.log("Database seeded successfully.");
    console.log(`  Users: ${users.map((u) => u.username).join(", ")}`);
  })
  .catch((err) => {
    console.error("Error seeding database:", err);
    process.exit(1);
  })
  .finally(() => pool.end());
