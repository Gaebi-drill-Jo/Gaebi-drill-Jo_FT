import Hero from './main_page/Hero_page'
import Login from './Log/Login'
import Graph from './graph/graph'
import Alarm from './alarm/alarm';
import Join from './Join/Join';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const dustValues = [
  15,  // index 0 → 3시 pm2.5 값
  22,  // index 1 → 6시 pm2.5 값
  35,  // index 2 → 9시 pm2.5 값
  28,  // index 3 → 12시 pm2.5 값
  40,  // index 4 → 15시 pm2.5 값
  30,  // index 5 → 18시 pm2.5 값
  20,  // index 6 → 21시 pm2.5 값
  18   // index 7 → 24시 pm2.5 값
];

const tempValues = [
  1, 
  2, 
  25.0, 
  25.4,
  24.8,
  23.9,
  22.7,
  21.8
];

const humidityValues = [
  45, 
  48,
  50,
  52,
  55,
  60,
  58,
  53
];

const xLabels = [
  3,   // 또는 "03시"
  6,
  9,
  12,
  15,
  18,
  21,
  24
];




function App() {

  return (
    <Router>
      <Routes>
         <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/graph"
          element={<Graph
              dustValues={dustValues}
              tempValues={tempValues}
              humidityValues={humidityValues}
              xLabels={xLabels}/>}
        />
        <Route path='Join'element={<Join/>}/>
        <Route path="/alarm" element={<Alarm />} />
      </Routes>
    </Router>
  )
}

export default App
