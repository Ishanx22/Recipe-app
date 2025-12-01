import { Routes, Route } from 'react-router';
import './App.css';

import Landing from "./pages/Landing";
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';

import Aurora from "./components/Aurora";   // ← IMPORTANT

function App() {
  return (
    <>
      {/* Aurora stays mounted always */}
      <Aurora
          colorStops={["#3d27ff", "#7bff67", "#3d27ff"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />

      {/* Page content changes, but background stays */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;
