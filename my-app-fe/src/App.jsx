import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Footer from "./components/footer";
import Login from "./components/login";
import Registration from "./components/registration";
import DashboardGuest from "./components/dashboardGuest";
import DashboardAdmin from "./components/dashboardAdmin";
import BookRoomForm from "./components/bookRoomForm";
import ProtectedRoute from "./components/protectedRoute";
import { useState } from 'react';

function App() {
  const [error, setError] = useState('');
  const [authStatus, setAuthStatus] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <Home
                error={error}
                setError={setError}
                setAuthStatus={setAuthStatus}
                setUserRole={setUserRole}
                setUserId={setUserId}
              />
            } 
          />
          <Route
            path="/login"
            element={
              <Login
                error={error}
                setError={setError}
                setAuthStatus={setAuthStatus}
                setUserRole={setUserRole}
                setUserId={setUserId}
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
                  setUserRole={setUserRole}
                  userId={userId}
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
          <Route
            path="/bookRoomForm"
            element={
              <ProtectedRoute authStatus={authStatus} allowedRole="guest" userRole={userRole}>
                <BookRoomForm
                  error={error}
                  setError={setError}
                  userId={userId}
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