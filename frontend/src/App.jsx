import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import Issues from "./pages/Issues";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Protected Routes with Layout (Sidebar) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/members" element={<Members />} />
          <Route path="/issues" element={<Issues />} />
        </Route>

        {/* Redirect any unknown routes to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;