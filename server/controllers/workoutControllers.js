const workoutModel = require("../models/workoutModel");

module.exports.listWorkouts = async (req, res, next) => {
  try {
    const workouts = await workoutModel.listByUser(req.session.user_id);
    res.send(workouts);
  } catch (err) {
    next(err);
  }
};

module.exports.createWorkout = async (req, res, next) => {
  try {
    const { title, description, date, type, duration, notes } = req.body;
    if (!title) return res.status(400).send({ error: "Title is required." });
    const workout = await workoutModel.create(
      title,
      description,
      date,
      type,
      duration,
      notes,
      req.session.user_id,
    );
    res.status(201).send(workout);
  } catch (err) {
    next(err);
  }
};

module.exports.updateWorkout = async (req, res, next) => {
  try {
    const { workout_id } = req.params;
    const workout = await workoutModel.find(workout_id);
    if (!workout) return res.status(404).send({ error: "Workout not found." });
    if (workout.user_id !== req.session.user_id) {
      return res.status(403).send({ error: "Not authorized." });
    }
    const updated = await workoutModel.update(workout_id, req.body);
    res.send(updated);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteWorkout = async (req, res, next) => {
  try {
    const { workout_id } = req.params;

    // First find the workout to verify ownership
    const workout = await workoutModel.find(workout_id);
    if (!workout) return res.status(404).send({ error: "Workout not found." });
    if (workout.user_id !== req.session.user_id) {
      return res.status(403).send({ error: "Not authorized." });
    }

    // Destroy the workout only after ownership has been verified
    const destroyedWorkout = await workoutModel.destroy(workout_id);
    res.send(destroyedWorkout);
  } catch (err) {
    next(err);
  }
};
