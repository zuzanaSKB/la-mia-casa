import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Footer from "./components/footer";
import Login from "./components/login";
import Registration from "./components/registration";
import Dashboard from "./components/dashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
