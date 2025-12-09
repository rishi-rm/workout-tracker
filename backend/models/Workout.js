import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
    exercise: {type: String, required: true},
    weight: {type: Number, required: true},
    reps: {type: Number, required: true},
    date: {type: String, required: true }
}, {timestamps: true})

workoutSchema.index({exercise: 1, date: -1})

export default mongoose.model("Workout", workoutSchema)