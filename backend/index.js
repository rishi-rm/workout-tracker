import express from "express"
import cors from "cors"
import { connectDB } from "./db.js"
import Workout from "./models/Workout.js"

const app = express()
app.use(express.json())
app.use(cors())


connectDB()

app.use((req, res, next)=>{
    const clientKey = req.headers["x-api-key"]

    if(!clientKey || clientKey!==process.env.SECRET_KEY){
        return res.status(403).json({message:"Forbidden"})
    }

    next()
})

app.get("/ping", (_req, res) => res.status(200).send("pong")); // for UptimeRobot

app.get("/", (req, res) => { res.send("api running") });

app.post("/workouts", async (req, res) => {
  const { exercise, weight, reps, date } = req.body;

  try {
    const updated = await Workout.findOneAndUpdate(
      { exercise, date },
      { weight, reps },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "Workout logged",
      data: updated
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/workouts/today/:date", async (req, res) => {
    const { date } = req.params
    try {
        const workouts = await Workout.find({ date }).sort({ createdAt: -1 })

        res.json({
            date,
            count: workouts.length,
            data: workouts
        })
    } catch (e) {
        res.status(500).json({
            message: "Server error"
        })
    }
})

app.get("/workouts/latest/:exercise", async (req, res) => {
    const { exercise } = req.params
    try {
        const latestExercise = await Workout.findOne({ exercise }).sort({ date: -1 }).limit(1)
        if(!latestExercise){
            return res.json({
                message: "No previous entry found"
            })
        }
        res.json({
            data: latestExercise
        })
    } catch (e) {
        res.status(500).json({
            message: "Server error"
        })
    }
})

app.get("/workouts/lastweek/:exercise", async(req, res)=>{
    const { exercise } = req.params
    const {date} = req.query

    const target = new Date(date)
    target.setDate(target.getDate()-7)

    const targetISO = target.toISOString().slice(0, 10)

    try{
        const lastWeekEntry = await Workout.findOne({
            exercise,
            date: targetISO
        })

        res.json({data : lastWeekEntry || null})
    }catch(e){
        res.status(500).json({ message: "server error"})
    }
})

app.get("/workouts", async (req, res) => {
    const allWorkouts = await Workout.find().sort({ createdAt: -1 })
    res.json(allWorkouts)
})

app.listen(5000, () => {
    console.log("Live at http://localhost:5000")
})