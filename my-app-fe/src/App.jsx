import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Footer from "./components/footer";
import Login from "./components/login";
import Registration from "./components/registration";
//import Dashboard from "./components/dashboard";
import DashboardGuest from "./components/dashboardGuest";
import BookRoomForm from "./components/bookRoomForm";
import ProtectedRoute from "./components/protectedRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/dashboardGuest" element={<ProtectedRoute> <DashboardGuest /> </ProtectedRoute> }/>
        <Route path="/bookRoomForm" element={<BookRoomForm />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
