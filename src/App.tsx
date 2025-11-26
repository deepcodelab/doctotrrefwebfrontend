import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import DoctorList from "./pages/Doctors";
import MyAppointments from "./pages/MyAppointments";
import Dashboard from "./pages/Dashboard";
import BookAppointment from "./pages/BookAppointment";
import DoctorAppointments from "./pages/DoctorAppointment";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorDetails from "./pages/DoctorDetails";
import ChatWidget from "./components/ChatWidget";

const App = () => (
  <Router>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register"  element={<Register/>} />
      <Route path="/doctors" element={<BookAppointment/>} />
      <Route path="/appointments" element={<MyAppointments/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/profile" element={<DoctorProfile></DoctorProfile>} />
      <Route path="/book-appointment" element={<BookAppointment/>} />
      <Route path="/my-appointment" element={<DoctorAppointments/>} />
      <Route path="/doctors/:id" element={<DoctorDetails />}></Route>
    </Routes>
    <ChatWidget />
  </Router>
);

export default App;
