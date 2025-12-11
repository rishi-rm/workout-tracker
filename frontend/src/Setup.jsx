import { useState } from "react";

export default function Setup() {
  const [value, setValue] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Set Secret Key</h1>

      <input
        className="border p-2 w-[80%] rounded mb-4"
        placeholder="Enter secret key"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded shadow"
        onClick={() => {
          localStorage.setItem("WORKOUT_SECRET", value);
          alert("Secret saved to this device!");
        }}
      >
        Save Key
      </button>
    </div>
  );
}
