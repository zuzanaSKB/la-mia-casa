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
import { useState, useEffect } from 'react';
import { getBirthdayDiscount } from "../services/birthdayDiscountService";
import UpdateProfile from "./components/updateProfile";

function App() {
  const [error, setError] = useState('');
  const [authStatus, setAuthStatus] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [birthdayDiscount, setHasBirthdayDiscount] = useState(null);

  useEffect(() => {
    const fetchDiscount = async () => {
      if (userId && userRole !== 'admin') {
        try {
          const response = await getBirthdayDiscount();
          console.log("discount response: ", response);
  
          if (response && response.discount) {
            setHasBirthdayDiscount(response.discount);
          } else {
            setHasBirthdayDiscount(null);
            console.info("No valid birthday discount available.");
          }
  
        } catch (error) {
          console.error("Unexpected error fetching birthday discount:", error);
          //setError("Chyba pri načítavaní zľavy.");
        }
      } else {
        setHasBirthdayDiscount(null);
      }
    };
  
    fetchDiscount();
  }, [userId, userRole]);  

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
                setUsername={setUsername}
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
                  username={username}
                  setUsername={setUsername}
                  hasBirthdayDiscount={birthdayDiscount}
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
                  setUserRole={setUserRole}
                  username={username}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookRoomForm"
            element={
              <ProtectedRoute authStatus={authStatus} allowedRole="guest" userRole={userRole}>
                <BookRoomForm
                  userId={userId}
                  error={error}
                  setError={setError}
                  setAuthStatus={setAuthStatus}
                  setUserRole={setUserRole}
                  hasBirthdayDiscount={birthdayDiscount}
                  setHasBirthdayDiscount={setHasBirthdayDiscount}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updateProfile"
            element={
              <ProtectedRoute authStatus={authStatus} allowedRole="guest" userRole={userRole}>
                <UpdateProfile
                  userId={userId}
                  username={username}
                  setUsername={setUsername}
                  error={error}
                  setError={setError}
                  setAuthStatus={setAuthStatus}
                  setUserRole={setUserRole}
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