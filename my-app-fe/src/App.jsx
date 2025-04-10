import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Footer from "./components/footer";
import Login from "./components/login";
import Registration from "./components/registration";
//import Dashboard from "./components/dashboard";
import DashboardGuest from "./components/dashboardGuest";
import DashboardAdmin from "./components/dashboardAdmin";
//import BookRoomForm from "./components/bookRoomForm";
import ProtectedRoute from "./components/protectedRoute";
import { useState } from 'react';

function App() {
  const [error, setError] = useState('');
  const [authStatus, setAuthStatus] = useState(false);
  const [userRole, setUserRole] = useState(null);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <Login
                error={error}
                setError={setError}
                setAuthStatus={setAuthStatus}
                setUserRole={setUserRole}
              />
            }
          />
          <Route path="/registration" element={<Registration />} />
          <Route
            path="/dashboardGuest"
            element={
              <ProtectedRoute authStatus={authStatus} allowedRole="guest" userRole={userRole}>
                <DashboardGuest
                  error={error}
                  setError={setError}
                  setAuthStatus={setAuthStatus}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboardAdmin"
            element={
              <ProtectedRoute authStatus={authStatus} allowedRole="admin" userRole={userRole}>
                <DashboardAdmin
                  error={error}
                  setError={setError}
                  setAuthStatus={setAuthStatus}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;