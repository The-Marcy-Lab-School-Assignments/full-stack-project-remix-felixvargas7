const path = require("path");
const express = require("express");
const cookieSession = require("cookie-session");
require("dotenv").config();

const logRoutes = require("./middleware/logRoutes");
const checkAuthentication = require("./middleware/checkAuthentication");
const authControllers = require("./controllers/authControllers");
const workoutControllers = require("./controllers/workoutControllers");

const app = express();
const PORT = process.env.PORT || 8080;

// ====================================
// Middleware
// ====================================

app.use(logRoutes);
app.use(cookieSession({ name: "session", secret: process.env.SESSION_SECRET }));
app.use(express.json());

// In production, serve the built React app from frontend/dist.
// In development, Vite's dev server handles the frontend on a separate port
// and proxies /api requests to this server.
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ====================================
// Auth routes
// ====================================

app.post("/api/auth/register", authControllers.register);
app.post("/api/auth/login", authControllers.login);
app.get("/api/auth/me", authControllers.getMe);
app.delete("/api/auth/logout", authControllers.logout);

// ====================================
// Workout routes (all require authentication)
// ====================================

app.get("/api/workouts", checkAuthentication, workoutControllers.listWorkouts);
app.post(
  "/api/workouts",
  checkAuthentication,
  workoutControllers.createWorkout,
);
app.patch(
  "/api/workouts/:workout_id",
  checkAuthentication,
  workoutControllers.updateWorkout,
);
app.delete(
  "/api/workouts/:workout_id",
  checkAuthentication,
  workoutControllers.deleteWorkout,
);

// ====================================
// Global Error Handler
// ====================================

const handleError = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: "Internal Server Error" });
};
app.use(handleError);

// ====================================
// Listen
// ====================================

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
