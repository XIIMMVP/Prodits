import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Routine from './pages/Routine';
import Insights from './pages/Insights';
import Journal from './pages/Journal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/routine" element={<Routine />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/journal" element={<Journal />} />
      </Routes>
    </Router>
  );
}

export default App;
