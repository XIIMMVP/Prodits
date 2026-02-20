import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './store/useStore';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Routine from './pages/Routine';
import Insights from './pages/Insights';
import Journal from './pages/Journal';

function App() {
  return (
    <StoreProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/routine" element={<Routine />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/journal" element={<Journal />} />
          </Routes>
        </Layout>
      </Router>
    </StoreProvider>
  );
}

export default App;
