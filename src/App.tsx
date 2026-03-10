import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import StarField from './components/StarField';
import Home from './pages/Home';
import SingleReading from './pages/SingleReading';
import ThreeCardReading from './pages/ThreeCardReading';
import CelticCrossReading from './pages/CelticCrossReading';
import DailyDraw from './pages/DailyDraw';
import ReadingSelect from './pages/ReadingSelect';
import History from './pages/History';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import AuthCallback from './pages/Auth/Callback';
import { useAuthStore } from './stores/useAuthStore';

export default function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter basename="/tarot">
      <div className="relative min-h-screen bg-bg-primary text-text-primary">
        <StarField />
        <Navbar />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reading" element={<ReadingSelect />} />
            <Route path="/reading/single" element={<SingleReading />} />
            <Route path="/reading/three-card" element={<ThreeCardReading />} />
            <Route path="/reading/celtic-cross" element={<CelticCrossReading />} />
            <Route path="/daily" element={<DailyDraw />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
