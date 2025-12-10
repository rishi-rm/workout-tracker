import { useEffect, useState } from "react"
import { useSwipeable } from 'react-swipeable';

export default function App() {
  const URL = "https://workout-tracker-2-c1g2.onrender.com"
  const userName = "Rishabh"
  const split = {
    1: ["Lat pulldows", "Rows", "Back extension", "Bicep curls", "Hammer curls", 'rear delt flys'],
    2: ["incline db press", 'pec flys', 'shoulder db press', 'lateral raises', 'tricep push down', 'tricep overhead'],
    3: ['shrugs', 'hack squats', 'hamstring curls', 'calf raises'],
    4: [],
    5: ["Lat pulldows", "Rows", "Back extension", "Bicep curls", "Hammer curls", 'rear delt flys'],
    6: ["incline db press", 'pec flys', 'shoulder db press', 'lateral raises', 'tricep push down', 'tricep overhead'],
    7: []
  }

  // todayWorkout = {
  //   "Incline db press" : "25 4",
  //   "Pec flys" : "45 6",
  //   "Shoulder db press" : "15 6"
  // }

  const [submitDone, setSubmitDone] = useState(false)

  const [inputs, setInputs] = useState({})

  const [lastWeek, setLastWeek] = useState({})

  function getTodayISO() {
    return new Date().toISOString().slice(0, 10); // "2025-12-09"
  }

  function addDays(isoDate, days) {
    const dateObj = new Date(isoDate);
    dateObj.setDate(dateObj.getDate() + days);
    return dateObj.toISOString().slice(0, 10);
  }

  function isoToDisplay(isoDate) {
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short"
    });
  }

  const [selectedDate, setSelectedDate] = useState(getTodayISO())

  useEffect(() => {
    const fetchTodayData = async () => {
      const res = await fetch(`${URL}/workouts/today/${selectedDate}`)
      const data = await res.json()

      console.log(data)
      const filled = {}
      data.data.forEach(entry => {
        filled[entry.exercise] = {
          weight: entry.weight,
          reps: entry.reps
        }
      })

      setInputs(filled)
    }

    fetchTodayData()
  }, [selectedDate])

  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      if (eventData.dir === 'Right') {
        setSelectedDate(prev => addDays(prev, -1))
      }else if(eventData.dir === 'Left'){
        setSelectedDate(prev => addDays(prev, 1))
      }
    },
    trackMouse: true
  })

  const selectedDayNumber = new Date(selectedDate).getDay()
  const mappedDay = selectedDayNumber === 0 ? 7 : selectedDayNumber
  useEffect(() => {
    split[mappedDay].forEach(async (exercise) => {
      const res = await fetch(`${URL}/workouts/lastweek/${exercise}?date=${selectedDate}`)

      const json = await res.json()

      setLastWeek(prev => ({
        ...prev,
        [exercise]: json.data
      }))
    })
  }, [selectedDate])

  const displayDate = isoToDisplay(selectedDate)

  const todayISO = getTodayISO();
  const isToday = selectedDate === todayISO;


  return (
    <div className="min-h-screen flex flex-col gap-6 items-center">
      {/* heading */}
      <div className="p-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 h-[8rem] w-screen bg-pink-400 rounded-br-2xl rounded-bl-2xl text-center flex flex-col gap-4">
        <h1 className="font-bold text-3xl text-white">Hey, {userName}</h1>
        <p className="text-white">Log today's grind.</p>
      </div>
      <div className="flex items-center justify-around">
        <div className="text-2xl cursor-pointer" onClick={() => setSelectedDate(prev => addDays(prev, -1))}>
          ←
        </div>
        {/* workout details */}
        <div {...handlers} className="bg-white drop-shadow-lg rounded-xl pb-8 min-h-[25rem]  w-[80%] p-4 border-2 border-purple-100">
          <div className="font-bold text-2xl mt-4">
            Workout Details
          </div>
          <div className="font-semibold text-lg text-gray-500 mt-2 mb-2">
            {displayDate}
          </div>
          <div>
            <ul className="flex flex-col gap-2">
              {
                split[mappedDay].length===0?<div className="text-xl font-semibold text-gray-400 text-center mt-16">
                  Rest for today.
                </div>:
                split[mappedDay].map((exercise, key) => (
                  <li key={key}>
                    <div>{exercise.charAt(0).toUpperCase() + exercise.slice(1)}</div>
                    <div className="flex gap-4">
                      <div className="w-[40%]">
                        <input required={true} type="number" placeholder="Weight"
                          className="w-[100%] border rounded p-2 border-gray-400"
                          value={inputs[exercise]?.weight || ""}
                          onChange={(e) => {
                            setInputs(prev => ({
                              ...prev,
                              [exercise]: { ...prev[exercise], weight: e.target.value }
                            }))
                          }}
                        />
                        <div className="text-sm text-gray-400 font-semibold text-center">{
                          lastWeek[exercise] ? `${lastWeek[exercise].weight}kg` : '--'
                        }</div>
                      </div>
                      <div className="w-[40%]">
                        <input required={true} type="number" placeholder="Reps"
                          className="w-[100%] border rounded p-2 border-gray-400"
                          value={inputs[exercise]?.reps || ""}
                          onChange={(e) => {
                            setInputs(prev => ({
                              ...prev,
                              [exercise]: { ...prev[exercise], reps: e.target.value }
                            }))
                          }}
                        />
                        <div className="text-sm text-gray-400 font-semibold text-center">
                          {
                            lastWeek[exercise] ? `${lastWeek[exercise].reps}` : '--'
                          }
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
        {!isToday ?
          <div className="text-2xl cursor-pointer" onClick={() => {
            setSelectedDate(prev => addDays(prev, 1))
            console.log(selectedDate, " ", todayISO)
          }}>
            →
          </div> : <div className="text-2xl opacity-0">→</div>
        }
      </div>
      {
        submitDone &&
        <div className="text-sm text-green-500 font-semibold -mb-4 -mt-2">
          Submit done!
        </div>
      }
      <button
        className="
        w-[20rem]
        px-5 py-2.5 
        rounded-xl 
        bg-indigo-600 
        text-white 
        font-medium 
    shadow-sm 
    hover:bg-indigo-500 
    hover:shadow-[0_0_12px_rgba(99,102,241,0.6)]
    active:scale-95
    transition-all 
    duration-200
  "
        onClick={async () => {
          console.log(inputs)
          for (const exercise of split[mappedDay]) {
            const weight = inputs[exercise]?.weight
            const reps = inputs[exercise]?.reps

            if (!weight || !reps) continue

            await fetch(`${URL}/workouts`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                exercise,
                weight: Number(weight),
                reps: Number(reps),
                date: selectedDate
              })
            })
          }
          setSubmitDone(true)
          setTimeout(() => {
            setSubmitDone(false)
          }, 3000)
          console.log("done")
        }}
      >
        Submit
      </button>
    </div>
  )
}