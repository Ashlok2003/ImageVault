import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import './index.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/Home';
import { FileExplorerProvider } from './contexts/FileExplorerContext';

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <FileExplorerProvider>
                  <Dashboard />
                </FileExplorerProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  )
}

