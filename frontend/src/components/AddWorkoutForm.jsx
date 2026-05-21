import { useState } from 'react';
import { createWorkout } from '../adapters/workout-adapters';
/*
// TRANSLATED DOMAIN: 
We change the function names:
AddTodoForm, 
1) Creates the form and submit its, communicating back to TodoPage by calling loadTodos()
2) Internally, AddTodoForm owns a piece of useState, used to track what the user is currently typing (title in just the todo app) 
3) When sending the data once the form is submitted, 

turns to AddWorkoutForm, which will be in charge of creating a workout form


*/

function AddWorkoutForm({ loadWorkouts }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;
    const { error } = await createWorkout({ title, description, date, type, duration, notes });
    if (error) return console.error(error);
    setTitle('');
    setDescription('');
    setDate('');
    setType('');
    setDuration('');
    setNotes('');
    await loadWorkouts();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title *" required />
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Select type</option>
        <option value="Cardio">Cardio</option>
        <option value="Strength">Strength</option>
        <option value="Flexibility">Flexibility</option>
        <option value="Other">Other</option>
      </select>
      <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (mins)" />
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
      <button type="submit" className="btn-primary">Log Workout</button>
    </form>
  );
}

export default AddWorkoutForm;