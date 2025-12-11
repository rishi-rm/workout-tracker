import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Setup from "./Setup.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/setup" element={<Setup />} />
    </Routes>
  );
}
