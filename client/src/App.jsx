import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Notepad from "./components/Notepad";
import InputBody from "./components/InputBody";

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<InputBody/>}/>
        <Route path="/:id" element={<Notepad />} />
      </Routes>
    </Router>
  );
}

export default App;
